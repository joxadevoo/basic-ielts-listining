import crypto from 'crypto';

const EVENT_TYPES = new Set(['session_start', 'track_play', 'note_save', 'dictation_save']);
const DEVICE_TYPES = new Set(['Kompyuter', 'Telefon', 'Planshet']);
const LANGUAGES = new Set(['UZ', 'EN']);

const rateLimitStore = new Map();

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function sanitizeString(value, maxLen) {
  if (value == null) return '';
  return String(value)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .trim()
    .slice(0, maxLen);
}

function clampInt(value, min, max, fallback) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

function toOrigin(urlOrHost) {
  if (!urlOrHost) return null;
  const value = String(urlOrHost).trim().replace(/\/$/, '');
  if (!value) return null;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return `https://${value}`;
}

export function getPrimaryAppUrl() {
  const fromEnv = toOrigin(process.env.APP_URL)
    || toOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL)
    || toOrigin(process.env.VERCEL_URL);
  return (fromEnv || 'https://fluentear.vercel.app').replace(/\/$/, '');
}

export function getAllowedOrigins() {
  const configured = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  const defaults = [
    'https://fluentear.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  const deploymentOrigins = [
    process.env.APP_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ]
    .map(toOrigin)
    .filter(Boolean);

  return [...new Set([...configured, ...defaults, ...deploymentOrigins])];
}

export function isAllowedOrigin(req) {
  const allowed = getAllowedOrigins();
  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';
  const host = req.headers.host || req.headers['x-forwarded-host'] || '';
  const hostOrigin = toOrigin(host);

  if (hostOrigin && allowed.includes(hostOrigin)) {
    if (!origin && !referer) return true;
    if (origin === hostOrigin || referer.startsWith(hostOrigin)) return true;
  }

  if (!origin && !referer) {
    return process.env.NODE_ENV !== 'production';
  }

  return allowed.some((entry) => origin === entry || referer.startsWith(entry));
}

export function resolveCorsOrigin(req) {
  const origin = req.headers.origin || '';
  if (origin && getAllowedOrigins().includes(origin)) return origin;
  return getPrimaryAppUrl();
}

export function checkRateLimit(ip, type) {
  const maxPerHour = clampInt(process.env.LOG_RATE_LIMIT_PER_HOUR, 1, 1000, 60);
  const maxSessionStarts = clampInt(process.env.LOG_SESSION_START_LIMIT_PER_HOUR, 1, 100, 10);
  const now = Date.now();
  const hourMs = 3600000;

  let entry = rateLimitStore.get(ip);
  if (!entry || now - entry.windowStart > hourMs) {
    entry = { count: 0, sessionStarts: 0, windowStart: now };
  }

  if (entry.count >= maxPerHour) {
    return { allowed: false, reason: 'rate_limit' };
  }
  if (type === 'session_start' && entry.sessionStarts >= maxSessionStarts) {
    return { allowed: false, reason: 'session_rate_limit' };
  }

  entry.count += 1;
  if (type === 'session_start') entry.sessionStarts += 1;
  rateLimitStore.set(ip, entry);

  if (rateLimitStore.size > 5000) {
    for (const [key, value] of rateLimitStore) {
      if (now - value.windowStart > hourMs) rateLimitStore.delete(key);
    }
  }

  return { allowed: true };
}

export function parseLogPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Invalid payload' };
  }

  const type = sanitizeString(body.type, 32);
  if (!EVENT_TYPES.has(type)) {
    return { ok: false, error: 'Invalid event type' };
  }

  const deviceId = sanitizeString(body.deviceId, 32);
  if (!deviceId || !/^[a-zA-Z0-9_-]+$/.test(deviceId)) {
    return { ok: false, error: 'Invalid deviceId' };
  }

  const payload = {
    type,
    deviceId,
    nickname: sanitizeString(body.nickname, 50) || "Noma'lum Qurilma",
    device: sanitizeString(body.device, 64) || 'Unknown',
    deviceType: sanitizeString(body.deviceType, 16),
    language: sanitizeString(body.language, 5).toUpperCase() || 'UZ',
    visitCount: clampInt(body.visitCount, 1, 100000, 1),
    trackNum: type === 'session_start' ? null : clampInt(body.trackNum, 1, 200, null),
    totalUsageTime: clampInt(body.totalUsageTime, 0, 864000, 0),
    listenedTracksCount: clampInt(body.listenedTracksCount, 0, 500, 0),
    totalTracksDuration: clampInt(body.totalTracksDuration, 0, 1000000, 0),
  };

  if (!DEVICE_TYPES.has(payload.deviceType)) payload.deviceType = 'Kompyuter';
  if (!LANGUAGES.has(payload.language)) payload.language = 'UZ';

  if (type !== 'session_start' && payload.trackNum == null) {
    return { ok: false, error: 'trackNum required' };
  }

  return { ok: true, payload };
}

export function buildLogMessage(payload, trackTitle = '') {
  const time = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });
  const nick = escapeHtml(payload.nickname);
  const dev = escapeHtml(payload.device);
  const dt = escapeHtml(payload.deviceType);
  const lang = escapeHtml(payload.language);
  const trackLabel = String(payload.trackNum).padStart(2, '0');

  switch (payload.type) {
    case 'session_start':
      return `🚀 <b>Yangi foydalanuvchi kirdi!</b>\n\n`
        + `👤 <b>Laqabi (Nickname):</b> ${nick}\n`
        + `🔢 <b>Kirishlar soni:</b> ${payload.visitCount}\n`
        + `🖥️ <b>Qurilma:</b> ${dev} (${dt})\n`
        + `🌐 <b>Til:</b> ${lang}\n`
        + `🕒 <b>Vaqt:</b> ${time}`;

    case 'track_play': {
      const title = escapeHtml(trackTitle || `Track ${payload.trackNum}`);
      return `🎧 <b>Trek eshitildi:</b>\n\n`
        + `👤 <b>Foydalanuvchi (Nickname):</b> ${nick}\n`
        + `🎵 <b>Trek:</b> #${trackLabel} - ${title}\n`
        + `🕒 <b>Vaqt:</b> ${time}`;
    }

    case 'note_save':
      return `📝 <b>Daftarga lug'at/eslatma saqlandi:</b>\n\n`
        + `👤 <b>Foydalanuvchi (Nickname):</b> ${nick}\n`
        + `🎵 <b>Trek:</b> #${trackLabel}\n`
        + `🕒 <b>Vaqt:</b> ${time}`;

    case 'dictation_save':
      return `✍️ <b>Diktant matni saqlandi:</b>\n\n`
        + `👤 <b>Foydalanuvchi (Nickname):</b> ${nick}\n`
        + `🎵 <b>Trek:</b> #${trackLabel}\n`
        + `🕒 <b>Vaqt:</b> ${time}`;

    default:
      return '';
  }
}

export function buildReplyMarkup() {
  const appUrl = getPrimaryAppUrl();
  return {
    inline_keyboard: [
      [
        { text: '📊 Statistika', callback_data: 'get_stats' },
        { text: '👥 Foydalanuvchilar', callback_data: 'get_users' },
      ],
      [
        { text: "🌐 FluentEar'ni ochish", url: appUrl },
      ],
    ],
  };
}

export function fingerprintFromRequest(ip, userAgent) {
  if (!ip || !userAgent) return null;
  const raw = `${ip}_${userAgent}`;
  return crypto.createHash('sha256').update(raw).digest('hex').substring(0, 16);
}