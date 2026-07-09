import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { fingerprintFromRequest } from './log-security.js';
import { buildPinnedSummaryText, recomputeDerivedFields } from './stats-metrics.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_STATS_FILE = path.resolve(__dirname, '../../.data/fluentear-stats.json');
const BLOB_PATHNAME = 'internal/fluentear-stats.json';
const IS_VERCEL = Boolean(process.env.VERCEL);

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN || '';
}

function getBlobOptions() {
  const token = getBlobToken();
  const storeId = process.env.BLOB_STORE_ID || '';
  return {
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
  };
}

async function readBlobJson() {
  const blobOptions = getBlobOptions();
  const { get, head } = await import('@vercel/blob');

  for (const access of ['private', 'public']) {
    try {
      const result = await get(BLOB_PATHNAME, { access, ...blobOptions });
      if (result?.stream) {
        const text = await new Response(result.stream).text();
        if (text) return JSON.parse(text);
      }
    } catch (err) {
      if (err?.name !== 'BlobNotFoundError') {
        console.error(`Blob get failed (${access}):`, err?.message || err);
      }
    }
  }

  try {
    const meta = await head(BLOB_PATHNAME, blobOptions);
    if (meta?.downloadUrl) {
      const res = await fetch(meta.downloadUrl);
      if (res.ok) {
        const text = await res.text();
        if (text) return JSON.parse(text);
      }
    }
  } catch (err) {
    if (err?.name !== 'BlobNotFoundError') {
      console.error('Blob head/download failed:', err?.message || err);
    }
  }

  return null;
}

async function writeBlobJson(stats) {
  const payload = JSON.stringify(stats);
  const blobOptions = getBlobOptions();
  const { put } = await import('@vercel/blob');
  const baseOptions = {
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    ...blobOptions,
  };

  const attempts = ['public', 'private'];
  let lastError = null;

  for (const access of attempts) {
    try {
      const result = await put(BLOB_PATHNAME, payload, {
        ...baseOptions,
        access,
      });
      console.log(`Stats saved to ${access} Blob:`, result.pathname);
      return;
    } catch (err) {
      lastError = err;
      console.error(`Blob put failed (${access}):`, err?.message || err);
    }
  }

  throw lastError || new Error('Blob save failed');
}

async function loadFromPrimaryStore() {
  const token = getBlobToken();

  if (token || IS_VERCEL) {
    return readBlobJson();
  }

  try {
    const raw = await fs.readFile(LOCAL_STATS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function saveToPrimaryStore(stats) {
  const token = getBlobToken();

  if (token || IS_VERCEL) {
    if (!token) {
      throw new Error(
        'BLOB_READ_WRITE_TOKEN is missing. Connect Blob store to the fluentear project in Vercel Storage.',
      );
    }
    await writeBlobJson(stats);
    return;
  }

  const payload = JSON.stringify(stats);
  await fs.mkdir(path.dirname(LOCAL_STATS_FILE), { recursive: true });
  await fs.writeFile(LOCAL_STATS_FILE, payload, 'utf8');
}

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
    return parseLegacyStatsFromPinnedMessage(chatData.result.pinned_message);
  } catch (err) {
    console.error('Legacy Telegram stats migration failed:', err);
    return null;
  }
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