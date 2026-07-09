import { TRACKS } from '../tracks.js';
import {
  buildLogMessage,
  buildReplyMarkup,
  checkRateLimit,
  getClientIp,
  isAllowedOrigin,
  parseLogPayload,
  resolveCorsOrigin,
} from './lib/log-security.js';
import {
  applyUserEvent,
  loadStats,
  saveStats,
  syncPinnedSummaryMessages,
} from './lib/stats-store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', resolveCorsOrigin(req));
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const parsed = parseLogPayload(req.body);
  if (!parsed.ok) {
    return res.status(400).json({ error: parsed.error });
  }

  const payload = parsed.payload;
  const clientIp = getClientIp(req);
  const rate = checkRateLimit(clientIp, payload.type);
  if (!rate.allowed) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdEnv = process.env.TELEGRAM_CHAT_ID || '';
  const chatIds = chatIdEnv.split(',').map((id) => id.trim()).filter(Boolean);

  if (!token || chatIds.length === 0) {
    return res.status(500).json({ error: 'Configuration missing on server.' });
  }

  try {
    let trackTitle = '';
    if (payload.trackNum != null) {
      const track = TRACKS.find((entry) => entry.trackNum === payload.trackNum);
      trackTitle = track?.title?.split(' - ')[1] || track?.title || '';
    }

    const text = buildLogMessage(payload, trackTitle);
    const replyMarkup = buildReplyMarkup();
    const shouldSendMessage = payload.type === 'session_start';

    if (shouldSendMessage) {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const sendPromises = chatIds.map(async (cid) => {
        try {
          await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: cid,
              text,
              parse_mode: 'HTML',
              reply_markup: replyMarkup,
            }),
          });
        } catch (e) {
          console.error(`Failed to send message to chat ${cid}:`, e);
        }
      });

      await Promise.all(sendPromises);
    }

    const userAgent = req.headers['user-agent'] || 'unknown';
    const primaryChatId = chatIds.find((id) => id.startsWith('-')) || chatIds[0];

    let stats = await loadStats({ telegramToken: token, chatId: primaryChatId });
    const finalNickname = applyUserEvent(stats, payload, clientIp, userAgent);
    stats = await saveStats(stats);
    await syncPinnedSummaryMessages(token, chatIds, stats);

    return res.status(200).json({ success: true, nickname: finalNickname });
  } catch (err) {
    console.error('Error in /api/log:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
