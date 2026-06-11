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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Configuration missing on server.' });
  }

  try {
    const { text, replyMarkup, type, nickname } = req.body;

    // 1. Post the notification message to the Telegram Chat
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup
      })
    });

    const data = await response.json();

    // 2. If it is a new session start, update the pinned statistics summary message
    if (type === 'session_start' && nickname) {
      await updatePinnedStats(token, chatId, nickname);
    }

    if (response.ok && data.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(502).json({ error: 'Telegram API rejection', details: data });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

async function updatePinnedStats(token, chatId, nickname) {
  try {
    // Get chat to locate the current pinned message
    const chatRes = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`);
    const chatData = await chatRes.json();
    
    if (!chatRes.ok || !chatData.ok) {
      console.error("Failed to fetch getChat details:", chatData);
      return;
    }

    const pinnedMessage = chatData.result.pinned_message;
    let stats = { totalUnique: 0, totalVisits: 0, users: {} };
    let pinnedMessageId = null;

    if (pinnedMessage) {
      pinnedMessageId = pinnedMessage.message_id;
      // Extract JSON payload from the HTML comment in the pinned text
      const match = pinnedMessage.text.match(/<!--STATS_DATA:(.*?)-->/);
      if (match) {
        try {
          stats = JSON.parse(match[1]);
        } catch (e) {
          console.error("JSON parse failure for pinned stats:", e);
        }
      }
    }

    const today = new Date().toISOString().split('T')[0];
    
    if (!stats.users) stats.users = {};
    if (!stats.users[nickname]) {
      stats.users[nickname] = {
        totalVisits: 0,
        dailyVisits: {},
        lastActive: today
      };
      stats.totalUnique = (stats.totalUnique || 0) + 1;
    }

    const user = stats.users[nickname];
    user.totalVisits = (user.totalVisits || 0) + 1;
    if (!user.dailyVisits) user.dailyVisits = {};
    user.dailyVisits[today] = (user.dailyVisits[today] || 0) + 1;
    user.lastActive = today;
    stats.totalVisits = (stats.totalVisits || 0) + 1;

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

    // Format the pinned summary message text
    let statsText = `📌 <b>TinglangApp Foydalanish Statistikasi</b>\n\n` +
                    `👥 <b>Jami unikal qurilmalar:</b> ${stats.totalUnique || 0} ta\n` +
                    `📈 <b>Jami kirishlar soni:</b> ${stats.totalVisits || 0} marta\n` +
                    `📅 <b>Oylik faol foydalanuvchilar (MAU):</b> ${monthlyActive} ta\n`;

    statsText += `\n🕒 <b>Oxirgi yangilanish:</b> ${new Date().toLocaleString()}`;
    statsText += `\n\n<!--STATS_DATA:${JSON.stringify(stats)}-->`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          {
            text: "📊 Statistika olish",
            callback_data: "get_stats"
          }
        ]
      ]
    };

    if (pinnedMessageId) {
      // Edit pinned message
      await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: pinnedMessageId,
          text: statsText,
          parse_mode: 'HTML',
          reply_markup: inlineKeyboard
        })
      });
    } else {
      // Send new message
      const sendRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: statsText,
          parse_mode: 'HTML',
          reply_markup: inlineKeyboard
        })
      });
      const sendData = await sendRes.json();
      if (sendRes.ok && sendData.ok) {
        // Pin the message
        await fetch(`https://api.telegram.org/bot${token}/pinChatMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: sendData.result.message_id,
            disable_notification: true
          })
        });
      }
    }
  } catch (err) {
    console.error("Error in updatePinnedStats helper:", err);
  }
}
