import {
  buildStatsReportText,
  buildUsersReportText,
} from './lib/stats-metrics.js';
import { loadStats } from './lib/stats-store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdEnv = process.env.TELEGRAM_CHAT_ID || '';
  const chatIds = chatIdEnv.split(',').map((id) => id.trim()).filter(Boolean);

  if (!token || chatIds.length === 0) {
    return res.status(200).json({ error: 'Configuration missing on server.' });
  }

  try {
    const update = req.body;

    let isStatsQuery = false;
    let isUsersQuery = false;
    let isStartQuery = false;
    let queryId = null;

    if (update.callback_query) {
      queryId = update.callback_query.id;
      if (update.callback_query.data === 'get_stats') isStatsQuery = true;
      else if (update.callback_query.data === 'get_users') isUsersQuery = true;
    } else if (update.message?.text) {
      if (update.message.text.startsWith('/stats')) isStatsQuery = true;
      else if (update.message.text.startsWith('/users')) isUsersQuery = true;
      else if (update.message.text.startsWith('/start')) isStartQuery = true;
    }

    if (!isStatsQuery && !isUsersQuery && !isStartQuery) {
      return res.status(200).end();
    }

    const incomingChatId = update.callback_query
      ? update.callback_query.message.chat.id.toString()
      : (update.message ? update.message.chat.id.toString() : null);

    if (!incomingChatId || !chatIds.includes(incomingChatId)) {
      return res.status(200).end();
    }

    const stats = await loadStats({ telegramToken: token, chatId: incomingChatId });
    const hasUsers = stats?.users && Object.keys(stats.users).length > 0;

    let reportText = '';

    if (isStartQuery) {
      reportText = '👋 <b>Assalomu alaykum! TinglangApp botiga xush kelibsiz!</b>\n\n'
        + 'Ushbu bot orqali <b>Basic IELTS Listening</b> ilovasining foydalanish statistikasini kuzatishingiz mumkin.\n\n'
        + '<b>Mavjud buyruqlar:</b>\n'
        + '📊 /stats - Umumiy foydalanish statistikasi\n'
        + '👥 /users - Foydalanuvchilar ro\'yxati va qurilmalari\n\n'
        + 'Quyidagi tugmalardan foydalanib kerakli ma\'lumotni darhol olishingiz mumkin:';
    } else if (hasUsers) {
      if (isStatsQuery) reportText = buildStatsReportText(stats);
      else if (isUsersQuery) reportText = buildUsersReportText(stats);
    } else {
      reportText = '📊 <b>Statistika topilmadi.</b>\n\n'
        + 'Statistika to\'planishi uchun ilovaga kamida bir marta kirilgan bo\'lishi kerak.\n\n'
        + '⚠️ <b>Muhim shartlar:</b>\n'
        + '1. Bot guruhda/kanalda <b>Admin</b> bo\'lishi va <b>xabarlarni pin qilish (Pin messages)</b> huquqiga ega bo\'lishi shart.\n'
        + '2. Agar bot shaxsiy chatda bo\'lsa, xabarlarni pin qila olmasligi mumkin. Bot uchun alohida guruh ochib, uni o\'sha yerda admin qilish tavsiya etiladi.';
    }

    if (queryId) {
      await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: queryId }),
      });
    }

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '📊 Statistika', callback_data: 'get_stats' },
          { text: '👥 Foydalanuvchilar', callback_data: 'get_users' },
        ],
      ],
    };

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: incomingChatId,
        text: reportText,
        parse_mode: 'HTML',
        reply_markup: inlineKeyboard,
      }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error in webhook handler:', err);
    return res.status(200).json({ error: 'Internal server error' });
  }
}