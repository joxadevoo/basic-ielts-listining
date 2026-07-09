import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { fingerprintFromRequest } from './log-security.js';
import { buildPinnedSummaryText, recomputeDerivedFields } from './stats-metrics.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_STATS_FILE = path.resolve(__dirname, '../../.data/fluentear-stats.json');
const BLOB_PATHNAME = 'internal/fluentear-stats.json';
const IS_VERCEL = Boolean(process.env.VERCEL);
const STATS_SITE_URL = 'https://fluentear.vercel.app';
const STATS_B64_START = 'STATS_B64_START:';
const STATS_B64_END = ':STATS_B64_END';

function encodeStatsPayload(stats) {
  const payload = {
    tv: stats.totalVisits || 0,
    tu: stats.totalUnique || 0,
    u: stats.users || {},
    ua: stats.updatedAt || null,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decodeStatsPayload(encoded) {
  const raw = Buffer.from(encoded, 'base64url').toString('utf8');
  const compact = JSON.parse(raw);
  return {
    totalVisits: compact.tv ?? compact.totalVisits ?? 0,
    totalUnique: compact.tu ?? compact.totalUnique ?? 0,
    users: compact.u ?? compact.users ?? {},
    updatedAt: compact.ua ?? compact.updatedAt ?? null,
  };
}

function buildPinnedMessageWithStats(stats) {
  const summary = buildPinnedSummaryText(stats);
  const encoded = encodeStatsPayload(stats);
  const hiddenLink = `<a href="${STATS_SITE_URL}/#s=${encoded}">&#8203;</a>`;
  return `${summary}\n${hiddenLink}`;
}

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN || '';
}

function getBlobOptionSets() {
  const token = getBlobToken();
  // Use token only — BLOB_STORE_ID from an old project/domain causes "store does not exist"
  return token ? [{ token }] : [];
}

async function readBlobJson() {
  const optionSets = getBlobOptionSets();
  const { get, head } = await import('@vercel/blob');

  for (const blobOptions of optionSets) {
    for (const access of ['public', 'private']) {
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
  }

  return null;
}

async function writeBlobJson(stats) {
  const payload = JSON.stringify(stats);
  const optionSets = getBlobOptionSets();
  const { put } = await import('@vercel/blob');
  let lastError = null;

  for (const blobOptions of optionSets) {
    for (const access of ['public', 'private']) {
      try {
        const result = await put(BLOB_PATHNAME, payload, {
          access,
          contentType: 'application/json',
          addRandomSuffix: false,
          allowOverwrite: true,
          ...blobOptions,
        });
        console.log(`Stats saved to ${access} Blob:`, result.pathname);
        return;
      } catch (err) {
        lastError = err;
        console.error(`Blob put failed (${access}):`, err?.message || err);
      }
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

  if (token) {
    await writeBlobJson(stats);
    return;
  }

  if (IS_VERCEL) {
    throw new Error('Blob unavailable — stats will be stored in Telegram pin message');
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

function parseStatsFromPinnedMessage(pinnedMessage) {
  if (!pinnedMessage) return null;

  let parsedStats = null;
  const text = pinnedMessage.text || pinnedMessage.caption || '';

  if (pinnedMessage.entities) {
    const linkEntity = pinnedMessage.entities.find(
      (entity) => entity.type === 'text_link' && entity.url
        && (entity.url.includes('#s=') || entity.url.includes('?stats=')),
    );
    if (linkEntity?.url) {
      try {
        const hashMatch = linkEntity.url.match(/#s=([A-Za-z0-9_-]+)/);
        if (hashMatch) {
          parsedStats = decodeStatsPayload(hashMatch[1]);
        } else {
          const urlObj = new URL(linkEntity.url);
          const statsStr = decodeURIComponent(urlObj.searchParams.get('stats') || '');
          if (statsStr) parsedStats = JSON.parse(statsStr);
        }
      } catch (err) {
        console.error('Failed to parse stats from text_link URL:', err);
      }
    }
  }

  if (!parsedStats && typeof text === 'string') {
    const hashMatch = text.match(/#s=([A-Za-z0-9_-]+)/);
    if (hashMatch) {
      try {
        parsedStats = decodeStatsPayload(hashMatch[1]);
      } catch (err) {
        console.error('Failed to parse stats from text hash:', err);
      }
    }
  }

  if (!parsedStats && typeof text === 'string') {
    const b64Match = text.match(
      new RegExp(`${STATS_B64_START}([A-Za-z0-9_-]+)${STATS_B64_END}`),
    );
    if (b64Match) {
      try {
        parsedStats = decodeStatsPayload(b64Match[1]);
      } catch (err) {
        console.error('Failed to parse stats from B64 marker:', err);
      }
    }
  }

  if (!parsedStats && typeof text === 'string') {
    const legacyMatch = text.match(
      /(?:<!--STATS_DATA:|STATS_DATA_START:)(.*?)(?:-->|:STATS_DATA_END)/,
    );
    if (legacyMatch) {
      try {
        parsedStats = JSON.parse(legacyMatch[1]);
      } catch (err) {
        console.error('Failed to parse legacy stats from text match:', err);
      }
    }
  }

  return parsedStats;
}

async function loadFromTelegramPinned(token, chatId) {
  try {
    const chatRes = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`);
    const chatData = await chatRes.json();
    if (!chatRes.ok || !chatData.ok) return null;
    return parseStatsFromPinnedMessage(chatData.result.pinned_message);
  } catch (err) {
    console.error('Telegram pinned stats load failed:', err);
    return null;
  }
}

function hasStatsData(stats) {
  return Boolean(
    stats
    && ((stats.totalVisits || 0) > 0 || Object.keys(stats.users || {}).length > 0),
  );
}

export async function loadStats({ telegramToken, chatId } = {}) {
  const fromBlob = await loadFromPrimaryStore();
  if (hasStatsData(fromBlob)) {
    return recomputeDerivedFields(fromBlob);
  }

  if (telegramToken && chatId) {
    const fromTelegram = await loadFromTelegramPinned(telegramToken, chatId);
    if (hasStatsData(fromTelegram)) {
      const normalized = recomputeDerivedFields(fromTelegram);
      try {
        await saveToPrimaryStore(normalized);
      } catch (err) {
        console.warn('Blob cache skipped (using Telegram storage):', err?.message || err);
      }
      return normalized;
    }
  }

  return fromBlob || emptyStats();
}

export async function saveStats(stats, { telegramReady = false } = {}) {
  const normalized = recomputeDerivedFields(stats);
  normalized.updatedAt = new Date().toISOString();

  try {
    await saveToPrimaryStore(normalized);
  } catch (err) {
    console.warn('Blob save failed:', err?.message || err);
    if (!telegramReady) throw err;
  }

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
  const statsText = buildPinnedMessageWithStats(stats);
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '📊 Statistika', callback_data: 'get_stats' },
        { text: '👥 Foydalanuvchilar', callback_data: 'get_users' },
      ],
    ],
  };

  let syncedAny = false;

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
        if (editRes.ok && editData.ok) {
          syncedAny = true;
          continue;
        }
        console.error('editMessageText failed:', editData);
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
      if (pinRes.ok && pinData.ok) {
        syncedAny = true;
      } else {
        console.error('pinChatMessage failed:', pinData);
      }
    } catch (err) {
      console.error(`Failed to sync pinned stats for chat ${chatId}:`, err);
    }
  }

  if (!syncedAny) {
    throw new Error('Failed to sync stats to Telegram pinned message');
  }
}