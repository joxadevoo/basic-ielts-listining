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
  const chatIdEnv = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID || "";
  const chatIds = chatIdEnv.split(',').map(id => id.trim()).filter(id => id);

  if (!token || chatIds.length === 0) {
    return res.status(200).json({ error: 'Configuration missing on server.' });
  }

  try {
    const update = req.body;
    
    // Check if it's a callback query or a /stats / /users / /start text command
    let isStatsQuery = false;
    let isUsersQuery = false;
    let isStartQuery = false;
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
      } else if (update.message.text.startsWith('/start')) {
        isStartQuery = true;
      }
    }

    if (!isStatsQuery && !isUsersQuery && !isStartQuery) {
      return res.status(200).end(); // Ignore other updates silently
    }

    const incomingChatId = update.callback_query 
      ? update.callback_query.message.chat.id.toString() 
      : (update.message ? update.message.chat.id.toString() : null);

    if (!incomingChatId || !chatIds.includes(incomingChatId)) {
      return res.status(200).end(); // Ignore requests from other chats/users for security
    }

    // Fetch pinned message to extract the JSON statistics
    const chatRes = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${incomingChatId}`);
    const chatData = await chatRes.json();

    let stats = null;
    if (chatRes.ok && chatData.ok && chatData.result.pinned_message) {
      const pm = chatData.result.pinned_message;
      let parsedStats = null;
      
      // Try text_link first
      if (pm.entities) {
        const linkEntity = pm.entities.find(e => e.type === 'text_link' && e.url && e.url.includes('?stats='));
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
        const match = (pm.text && typeof pm.text === 'string')
          ? pm.text.match(/(?:<!--STATS_DATA:|STATS_DATA_START:)(.*?)(?:-->|:STATS_DATA_END)/)
          : null;
        if (match) {
          try {
            parsedStats = JSON.parse(match[1]);
          } catch (e) {
            console.error("Failed to parse stats from text match:", e);
          }
        }
      }
      
      stats = parsedStats;
    }

    let reportText = '';
    
    // Format helper for duration
    function formatDuration(seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      if (h > 0) {
        return `${h} soat ${m} daqiqa`;
      }
      return `${m} daqiqa`;
    }

    if (isStartQuery) {
      reportText = `👋 <b>Assalomu alaykum! TinglangApp botiga xush kelibsiz!</b>\n\n` +
                   `Ushbu bot orqali <b>Basic IELTS Listening</b> ilovasining foydalanish statistikasini kuzatishingiz mumkin.\n\n` +
                   `<b>Mavjud buyruqlar:</b>\n` +
                   `📊 /stats - Umumiy foydalanish statistikasi\n` +
                   `👥 /users - Foydalanuvchilar ro'yxati va qurilmalari\n\n` +
                   `Quyidagi tugmalardan foydalanib kerakli ma'lumotni darhol olishingiz mumkin:`;
    } else if (stats) {
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

        reportText = `📊 <b>TinglangApp Foydalanish Statistikasi</b>\n\n` +
                     `👥 <b>Jami unikal qurilmalar:</b> <code>${stats.totalUnique || 0}</code> ta\n` +
                     `📈 <b>Jami kirishlar soni:</b> <code>${stats.totalVisits || 0}</code> marta\n` +
                     `📅 <b>Oylik faol foydalanuvchilar (MAU):</b> <code>${monthlyActive}</code> ta\n` +
                     `⏱️ <b>Jami foydalanish vaqti:</b> <code>${formatDuration(totalUsageTimeAll)}</code>\n` +
                     `🎵 <b>Eshitilgan treklar soni:</b> <code>${totalTracksCountAll}</code> ta\n` +
                     `⏳ <b>Treklar jami eshitilgan vaqti:</b> <code>${formatDuration(totalTrackDurationAll)}</code>\n`;
      } else if (isUsersQuery) {
        reportText = `👥 <b>TinglangApp Foydalanuvchilar Ro'yxati</b>\n\n`;
        
        // Sort users by total visits descending
        const sortedUsers = Object.entries(stats.users || {}).sort((a, b) => b[1].totalVisits - a[1].totalVisits);

        sortedUsers.forEach(([name, uData], index) => {
          const deviceStr = uData.deviceType 
            ? `${uData.deviceType} (${uData.device || 'Noma\'lum'})` 
            : (uData.device || 'Noma\'lum');

          const usageTimeStr = formatDuration(uData.totalUsageTime || 0);
          const trackDurationStr = formatDuration(uData.totalTracksDuration || 0);

          reportText += `${index + 1}. 👤 <b>${name}</b>\n` +
                        `   • Qurilma: <code>${deviceStr}</code>\n` +
                        `   • Jami kirishlar: <b>${uData.totalVisits}</b> marta\n` +
                        `   • Foydalanish vaqti: <b>${usageTimeStr}</b>\n` +
                        `   • Eshitilgan treklar: <b>${uData.listenedTracksCount || 0} ta</b> (${trackDurationStr})\n` +
                        `   • Oxirgi faollik: <code>${uData.lastActive}</code>\n\n`;
        });
        
        if (sortedUsers.length === 0) {
          reportText += `<i>Hozircha foydalanuvchilar faolligi qayd etilmagan.</i>`;
        }
      }
    } else {
      reportText = `📊 <b>Statistika topilmadi.</b>\n\n` +
                   `Statistika to'planishi uchun ilovaga kamida bir marta kirilgan bo'lishi va Telegram chatda xabar <b>pin qilingan (mustahkamlangan)</b> bo'lishi kerak.\n\n` +
                   `⚠️ <b>Muhim shartlar:</b>\n` +
                   `1. Bot guruhda/kanalda <b>Admin</b> bo'lishi va <b>xabarlarni pin qilish (Pin messages)</b> huquqiga ega bo'lishi shart.\n` +
                   `2. Agar bot shaxsiy chatda bo'lsa, xabarlarni pin qila olmasligi mumkin. Bot uchun alohida guruh ochib, uni o'sha yerda admin qilish va Guruh ID-sini sozlash tavsiya etiladi.`;
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
        chat_id: incomingChatId,
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
