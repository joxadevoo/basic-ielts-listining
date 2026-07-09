import { resolveCorsOrigin } from './lib/log-security.js';
import { computePublicMetrics } from './lib/stats-metrics.js';
import { emptyStats, loadStats } from './lib/stats-store.js';

const EMPTY_METRICS = {
  totalUnique: 0,
  totalVisits: 0,
  dailyActive: 0,
  weeklyActive: 0,
  monthlyActive: 0,
  deviceTypes: {},
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', resolveCorsOrigin(req));
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Cache-Control', 'public, max-age=60');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatIdEnv = process.env.TELEGRAM_CHAT_ID || '';
    const chatIds = chatIdEnv.split(',').map((id) => id.trim()).filter(Boolean);
    const chatId = chatIds.find((id) => id.startsWith('-')) || chatIds[0];

    let stats = emptyStats();
    if (token && chatId) {
      stats = await loadStats({ telegramToken: token, chatId });
    }

    return res.status(200).json(computePublicMetrics(stats));
  } catch (err) {
    console.error('Error in /api/stats:', err);
    return res.status(200).json(EMPTY_METRICS);
  }
}