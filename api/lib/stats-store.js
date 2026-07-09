import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { fingerprintFromRequest } from './log-security.js';
import { buildPinnedSummaryText, recomputeDerivedFields } from './stats-metrics.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_STATS_FILE = path.resolve(__dirname, '../../.data/fluentear-stats.json');
const BLOB_PATHNAME = 'private/fluentear-stats.json';

export function emptyStats() {
  return {
    totalUnique: 0,
    totalVisits: 0,
    monthlyActive: 0,
    users: {},
    deviceTypes: {},
    osBrowsers: {},
    updatedAt: null,
  };
}

function parseLegacyStatsFromPinnedMessage(pinnedMessage) {
  if (!pinnedMessage) return null;

  let parsedStats = null;

  if (pinnedMessage.entities) {
    const linkEntity = pinnedMessage.entities.find(
      (entity) => entity.type === 'text_link' && entity.url && entity.url.includes('?stats='),
    );
    if (linkEntity) {
      try {
        const urlObj = new URL(linkEntity.url);
        const statsStr = decodeURIComponent(urlObj.searchParams.get('stats'));
        parsedStats = JSON.parse(statsStr);
      } catch (err) {
        console.error('Failed to parse legacy stats from text_link URL:', err);
      }
    }
  }

  if (!parsedStats && typeof pinnedMessage.text === 'string') {
    const match = pinnedMessage.text.match(
      /(?:<!--STATS_DATA:|STATS_DATA_START:)(.*?)(?:-->|:STATS_DATA_END)/,
    );
    if (match) {
      try {
        parsedStats = JSON.parse(match[1]);
      } catch (err) {
        console.error('Failed to parse legacy stats from text match:', err);
      }
    }
  }

  return parsedStats;
}

async function loadLegacyFromTelegram(token, chatId) {
  try {
    const chatRes = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`);
    const chatData = await chatRes.json();
    if (!chatRes.ok || !chatData.ok) return null;
    const legacy = parseLegacyStatsFromPinnedMessage(chatData.result.pinned_message);
    return legacy || null;
  } catch (err) {
    console.error('Legacy Telegram stats migration failed:', err);
    return null;
  }
}

async function loadFromPrimaryStore() {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    try {
      const { get } = await import('@vercel/blob');
      const result = await get(BLOB_PATHNAME, { access: 'private', token: blobToken });
      if (result?.stream) {
        const text = await new Response(result.stream).text();
        if (text) return JSON.parse(text);
      }
    } catch (err) {
      if (!(err?.name === 'BlobNotFoundError')) {
        console.error('Blob stats load failed:', err);
      }
    }
  }

  try {
    const raw = await fs.readFile(LOCAL_STATS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function saveToPrimaryStore(stats) {
  const payload = JSON.stringify(stats);
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (blobToken) {
    const { put } = await import('@vercel/blob');
    await put(BLOB_PATHNAME, payload, {
      access: 'private',
      token: blobToken,
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  await fs.mkdir(path.dirname(LOCAL_STATS_FILE), { recursive: true });
  await fs.writeFile(LOCAL_STATS_FILE, payload, 'utf8');
}

export async function loadStats({ telegramToken, chatId } = {}) {
  const existing = await loadFromPrimaryStore();
  if (existing && (Object.keys(existing.users || {}).length > 0 || existing.totalVisits > 0)) {
    return recomputeDerivedFields(existing);
  }

  if (telegramToken && chatId) {
    const legacy = await loadLegacyFromTelegram(telegramToken, chatId);
    if (legacy) {
      const migrated = recomputeDerivedFields(legacy);
      migrated.updatedAt = new Date().toISOString();
      await saveToPrimaryStore(migrated);
      return migrated;
    }
  }

  return existing || emptyStats();
}

export async function saveStats(stats) {
  const normalized = recomputeDerivedFields(stats);
  normalized.updatedAt = new Date().toISOString();
  await saveToPrimaryStore(normalized);
  return normalized;
}

export function applyUserEvent(stats, payload, ip, userAgent) {
  const today = new Date().toISOString().split('T')[0];
  if (!stats.users) stats.users = {};

  let finalNickname = payload.nickname;
  const fingerprint = fingerprintFromRequest(ip, userAgent);

  if (fingerprint) {
    for (const [userName, userData] of Object.entries(stats.users)) {
      if (userData.fp === fingerprint || userData.fingerprint === fingerprint) {
        finalNickname = userName;
        break;
      }
    }
  }

  if (!stats.users[finalNickname]) {
    stats.users[finalNickname] = { v: 0, la: today };
  }

  const user = stats.users[finalNickname];
  if (fingerprint) user.fp = fingerprint;

  if (payload.type === 'session_start') {
    user.v = (user.v || 0) + 1;
    user.la = today;
    stats.totalVisits = (stats.totalVisits || 0) + 1;
  }

  if (payload.device) user.d = payload.device;
  if (payload.deviceType) user.dt = payload.deviceType;

  delete user.totalVisits;
  delete user.dailyVisits;
  delete user.lastActive;
  delete user.fingerprint;
  delete user.device;
  delete user.deviceType;

  recomputeDerivedFields(stats);
  return finalNickname;
}

export async function getPinnedMessageId(token, chatId) {
  const chatRes = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`);
  const chatData = await chatRes.json();
  if (!chatRes.ok || !chatData.ok) return null;
  return chatData.result.pinned_message?.message_id || null;
}

export async function syncPinnedSummaryMessages(token, chatIds, stats) {
  const statsText = buildPinnedSummaryText(stats);
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '📊 Statistika', callback_data: 'get_stats' },
        { text: '👥 Foydalanuvchilar', callback_data: 'get_users' },
      ],
    ],
  };

  for (const chatId of chatIds) {
    try {
      const pinnedMessageId = await getPinnedMessageId(token, chatId);

      if (pinnedMessageId) {
        const editRes = await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: pinnedMessageId,
            text: statsText,
            parse_mode: 'HTML',
            reply_markup: inlineKeyboard,
          }),
        });
        const editData = await editRes.json();
        if (!editRes.ok || !editData.ok) {
          console.error('editMessageText failed:', editData);
        }
        continue;
      }

      const sendRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: statsText,
          parse_mode: 'HTML',
          reply_markup: inlineKeyboard,
        }),
      });
      const sendData = await sendRes.json();
      if (!sendRes.ok || !sendData.ok) {
        console.error('sendMessage for stats failed:', sendData);
        continue;
      }

      const pinRes = await fetch(`https://api.telegram.org/bot${token}/pinChatMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: sendData.result.message_id,
          disable_notification: true,
        }),
      });
      const pinData = await pinRes.json();
      if (!pinRes.ok || !pinData.ok) {
        console.error('pinChatMessage failed:', pinData);
      }
    } catch (err) {
      console.error(`Failed to sync pinned stats for chat ${chatId}:`, err);
    }
  }
}