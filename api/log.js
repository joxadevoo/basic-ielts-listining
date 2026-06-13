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
  const chatIdEnv = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID || "";
  const chatIds = chatIdEnv.split(',').map(id => id.trim()).filter(id => id);

  if (!token || chatIds.length === 0) {
    return res.status(500).json({ error: 'Configuration missing on server.' });
  }

  try {
    const { text, replyMarkup, type, nickname, device, deviceType, totalUsageTime, listenedTracksCount, totalTracksDuration } = req.body;

    // 1. Post the notification message to the Telegram Chats
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const sendPromises = chatIds.map(async (cid) => {
      try {
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: cid,
            text: text,
            parse_mode: 'HTML',
            reply_markup: replyMarkup
          })
        });
      } catch (e) {
        console.error(`Failed to send message to chat ${cid}:`, e);
      }
    });

    await Promise.all(sendPromises);

    // 2. Update the pinned statistics summary message in all configured chats if nickname is provided
    if (nickname) {
      const updatePromises = chatIds.map(async (cid) => {
        try {
          await updatePinnedStats(token, cid, nickname, device, deviceType, totalUsageTime, listenedTracksCount, totalTracksDuration, type);
        } catch (e) {
          console.error(`Failed to update pinned stats for chat ${cid}:`, e);
        }
      });
      await Promise.all(updatePromises);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

async function updatePinnedStats(token, chatId, nickname, device, deviceType, totalUsageTime, listenedTracksCount, totalTracksDuration, type) {
  try {
    // Get chat to locate the current pinned message
    const chatRes = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`);
    const chatData = await chatRes.json();
    
    if (!chatRes.ok || !chatData.ok) {
      console.error(`Failed to fetch getChat details for chatId ${chatId}:`, chatData);
      return;
    }

    const pinnedMessage = chatData.result.pinned_message;
    let stats = { totalUnique: 0, totalVisits: 0, users: {} };
    let pinnedMessageId = null;

    if (pinnedMessage) {
      pinnedMessageId = pinnedMessage.message_id;
      let parsedStats = null;
      
      // Try extracting from text_link entities first
      if (pinnedMessage.entities) {
        const linkEntity = pinnedMessage.entities.find(e => e.type === 'text_link' && e.url && e.url.includes('?stats='));
        if (linkEntity) {
          try {
            const urlObj = new URL(linkEntity.url);
            const statsStr = decodeURIComponent(urlObj.searchParams.get('stats'));
            parsedStats = JSON.parse(statsStr);
          } catch (e) {
            console.error("Failed to parse stats from text_link entity URL:", e);
          }
        }
      }
      
      // Fallback to text matching
      if (!parsedStats) {
        const match = (pinnedMessage.text && typeof pinnedMessage.text === 'string')
          ? pinnedMessage.text.match(/(?:<!--STATS_DATA:|STATS_DATA_START:)(.*?)(?:-->|:STATS_DATA_END)/)
          : null;
        if (match) {
          try {
            parsedStats = JSON.parse(match[1]);
          } catch (e) {
            console.error("Failed to parse stats from text match:", e);
          }
        }
      }
      
      if (parsedStats) {
        stats = parsedStats;
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
    
    if (type === 'session_start') {
      user.totalVisits = (user.totalVisits || 0) + 1;
      if (!user.dailyVisits) user.dailyVisits = {};
      user.dailyVisits[today] = (user.dailyVisits[today] || 0) + 1;
      user.lastActive = today;
      stats.totalVisits = (stats.totalVisits || 0) + 1;
    }

    if (device) user.device = device;
    if (deviceType) user.deviceType = deviceType;
    if (typeof totalUsageTime === 'number') user.totalUsageTime = totalUsageTime;
    if (typeof listenedTracksCount === 'number') user.listenedTracksCount = listenedTracksCount;
    if (typeof totalTracksDuration === 'number') user.totalTracksDuration = totalTracksDuration;

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

    // Sum stats across all users
    let totalUsageTimeAll = 0;
    let totalTrackDurationAll = 0;
    let totalTracksCountAll = 0;

    if (stats.users) {
      for (const uData of Object.values(stats.users)) {
        totalUsageTimeAll += uData.totalUsageTime || 0;
        totalTrackDurationAll += uData.totalTracksDuration || 0;
        totalTracksCountAll += uData.listenedTracksCount || 0;
      }
    }

    // Format helper for duration
    function formatDuration(seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      if (h > 0) {
        return `${h} soat ${m} daqiqa`;
      }
      return `${m} daqiqa`;
    }

    // Format the pinned summary message text
    let statsText = `<a href="https://tinglash.vercel.app/?stats=${encodeURIComponent(JSON.stringify(stats))}">&#8203;</a>` +
                    `📌 <b>TinglangApp Foydalanish Statistikasi</b>\n\n` +
                    `👥 <b>Jami unikal qurilmalar:</b> ${stats.totalUnique || 0} ta\n` +
                    `📈 <b>Jami kirishlar soni:</b> ${stats.totalVisits || 0} marta\n` +
                    `📅 <b>Oylik faol foydalanuvchilar (MAU):</b> ${monthlyActive} ta\n` +
                    `⏱️ <b>Jami foydalanish vaqti:</b> ${formatDuration(totalUsageTimeAll)}\n` +
                    `🎵 <b>Eshitilgan treklar soni:</b> ${totalTracksCountAll} ta\n` +
                    `⏳ <b>Treklar jami eshitilgan vaqti:</b> ${formatDuration(totalTrackDurationAll)}\n`;

    statsText += `\n🕒 <b>Oxirgi yangilanish:</b> ${new Date().toLocaleString()}`;

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

    if (pinnedMessageId) {
      // Edit pinned message
      const editRes = await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
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
      const editData = await editRes.json();
      if (!editRes.ok || !editData.ok) {
        console.error("editMessageText failed:", editData);
      }
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
        const pinRes = await fetch(`https://api.telegram.org/bot${token}/pinChatMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: sendData.result.message_id,
            disable_notification: true
          })
        });
        const pinData = await pinRes.json();
        if (!pinRes.ok || !pinData.ok) {
          console.error("pinChatMessage failed:", pinData);
        } else {
          console.log("pinChatMessage succeeded!");
        }
      } else {
        console.error("sendMessage for stats failed:", sendData);
      }
    }
  } catch (err) {
    console.error("Error in updatePinnedStats helper:", err);
  }
}
