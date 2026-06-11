export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Telegram webhooks send POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(200).json({ error: 'Configuration missing on server.' });
  }

  try {
    const update = req.body;
    
    // Check if it's a callback query or a /stats / /users text command
    let isStatsQuery = false;
    let isUsersQuery = false;
    let queryId = null;

    if (update.callback_query) {
      queryId = update.callback_query.id;
      if (update.callback_query.data === 'get_stats') {
        isStatsQuery = true;
      } else if (update.callback_query.data === 'get_users') {
        isUsersQuery = true;
      }
    } else if (update.message && update.message.text) {
      if (update.message.text.startsWith('/stats')) {
        isStatsQuery = true;
      } else if (update.message.text.startsWith('/users')) {
        isUsersQuery = true;
      }
    }

    if (!isStatsQuery && !isUsersQuery) {
      return res.status(200).end(); // Ignore other updates silently
    }

    // Fetch pinned message to extract the JSON statistics
    const chatRes = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`);
    const chatData = await chatRes.json();

    let stats = null;
    if (chatRes.ok && chatData.ok && chatData.result.pinned_message) {
      const match = chatData.result.pinned_message.text.match(/<!--STATS_DATA:(.*?)-->/);
      if (match) {
        stats = JSON.parse(match[1]);
      }
    }

    let reportText = '';
    if (stats) {
      if (isStatsQuery) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

        let monthlyActive = 0;
        if (stats.users) {
          for (const uData of Object.values(stats.users)) {
            if (uData.lastActive && uData.lastActive >= thirtyDaysAgoStr) {
              monthlyActive++;
            }
          }
        }

        reportText = `📊 <b>TinglangApp Foydalanish Statistikasi</b>\n\n` +
                     `👥 <b>Jami unikal qurilmalar:</b> <code>${stats.totalUnique || 0}</code> ta\n` +
                     `📈 <b>Jami kirishlar soni:</b> <code>${stats.totalVisits || 0}</code> marta\n` +
                     `📅 <b>Oylik faol foydalanuvchilar (MAU):</b> <code>${monthlyActive}</code> ta\n`;
      } else if (isUsersQuery) {
        reportText = `👥 <b>TinglangApp Foydalanuvchilar Ro'yxati</b>\n\n`;
        
        // Sort users by total visits descending
        const sortedUsers = Object.entries(stats.users || {}).sort((a, b) => b[1].totalVisits - a[1].totalVisits);

        sortedUsers.forEach(([name, uData], index) => {
          reportText += `${index + 1}. 👤 <b>${name}</b>\n` +
                        `   • Jami kirishlar: <b>${uData.totalVisits}</b> marta\n` +
                        `   • Oxirgi faollik: <code>${uData.lastActive}</code>\n\n`;
        });
        
        if (sortedUsers.length === 0) {
          reportText += `<i>Hozircha foydalanuvchilar faolligi qayd etilmagan.</i>`;
        }
      }
    } else {
      reportText = `📊 <b>Statistika topilmadi.</b>\n\nIlovaga birinchi foydalanuvchi kirganida statistika xabari shakllanadi va pin qilinadi.`;
    }

    // Acknowledge callback query to stop the loading icon on the user's Telegram client
    if (queryId) {
      await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: queryId })
      });
    }

    const inlineKeyboard = {
      inline_keyboard: [
        [
          {
            text: "📊 Statistika",
            callback_data: "get_stats"
          },
          {
            text: "👥 Foydalanuvchilar",
            callback_data: "get_users"
          }
        ]
      ]
    };

    // Post the statistics report back to the chat
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: reportText,
        parse_mode: 'HTML',
        reply_markup: inlineKeyboard
      })
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error in webhook handler:", err);
    return res.status(200).json({ error: err.message });
  }
}
