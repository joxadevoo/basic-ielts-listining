import crypto from 'crypto';

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

    // 1. Post the notification message to the Telegram Chats for session starts
    // Other events (track plays, saves) will update the pinned stats silently to prevent spam
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const shouldSendMessage = (type === 'session_start' || !type);
    
    if (shouldSendMessage) {
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
    }

    // 2. Update the pinned statistics summary message in all configured chats if nickname is provided
    let finalNickname = nickname;
    if (nickname) {
      // Extract IP address
      const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
      // Extract User-Agent
      const userAgent = req.headers['user-agent'] || 'unknown';

      const updatePromises = chatIds.map(async (cid) => {
        try {
          const resolved = await updatePinnedStats(token, cid, nickname, device, deviceType, totalUsageTime, listenedTracksCount, totalTracksDuration, type, ip, userAgent);
          if (resolved) {
            finalNickname = resolved;
          }
        } catch (e) {
          console.error(`Failed to update pinned stats for chat ${cid}:`, e);
        }
      });
      await Promise.all(updatePromises);
    }

    return res.status(200).json({ success: true, nickname: finalNickname });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

async function updatePinnedStats(token, chatId, nickname, device, deviceType, totalUsageTime, listenedTracksCount, totalTracksDuration, type, ip, userAgent) {
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

    let finalNickname = nickname;
    if (ip && userAgent) {
      const fingerprintRaw = `${ip}_${userAgent}`;
      const fingerprint = crypto.createHash('sha256').update(fingerprintRaw).digest('hex').substring(0, 16);
      
      // Look if fingerprint already exists
      for (const [uName, uData] of Object.entries(stats.users)) {
        if (uData.fingerprint === fingerprint) {
          finalNickname = uName;
          break;
        }
      }
    }

    if (!stats.users[finalNickname]) {
      stats.users[finalNickname] = {
        totalVisits: 0,
        dailyVisits: {},
        lastActive: today
      };
    }

    const user = stats.users[finalNickname];

    // Ensure fingerprint is stored
    if (ip && userAgent) {
      const fingerprintRaw = `${ip}_${userAgent}`;
      const fingerprint = crypto.createHash('sha256').update(fingerprintRaw).digest('hex').substring(0, 16);
      user.fp = fingerprint;
    }
    
    if (type === 'session_start') {
      user.v = (user.v || 0) + 1;
      user.la = today;
      stats.totalVisits = (stats.totalVisits || 0) + 1;
    }

    // Store only compact device info (e.g. "Android" not full UA)
    if (device) user.d = device;
    if (deviceType) user.dt = deviceType;

    // Clean old per-user bloat fields if they exist from legacy data
    delete user.totalVisits;
    delete user.dailyVisits;
    delete user.lastActive;
    delete user.fingerprint;
    delete user.device;
    delete user.deviceType;
    delete user.totalUsageTime;
    delete user.listenedTracksCount;
    delete user.totalTracksDuration;

    // Calculate totalUnique and monthlyActive dynamically based on unique fingerprints
    const uniqueFingerprints = new Set();
    let legacyUniques = 0;
    
    const activeFingerprints = new Set();
    let legacyActive = 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

    // Aggregate device stats for charts
    const deviceTypes = {};
    const osBrowsers = {};

    if (stats.users) {
      for (const uData of Object.values(stats.users)) {
        // Uniqueness
        if (uData.fp) {
          uniqueFingerprints.add(uData.fp);
        } else {
          legacyUniques++;
        }

        // Monthly active (last 30 days)
        const lastAct = uData.la || uData.lastActive;
        if (lastAct && lastAct >= thirtyDaysAgoStr) {
          if (uData.fp) {
            activeFingerprints.add(uData.fp);
          } else {
            legacyActive++;
          }
        }

        // Device breakdown
        const dt = uData.dt || uData.deviceType || 'Unknown';
        deviceTypes[dt] = (deviceTypes[dt] || 0) + 1;
        
        const db = uData.d || uData.device || 'Unknown';
        osBrowsers[db] = (osBrowsers[db] || 0) + 1;
      }
    }

    stats.totalUnique = uniqueFingerprints.size + legacyUniques;
    let monthlyActive = activeFingerprints.size + legacyActive;

    // Build device breakdown text for Telegram (compact)
    let deviceBreakdown = '';
    for (const [dt, count] of Object.entries(deviceTypes).sort((a, b) => b[1] - a[1])) {
      const emoji = dt === 'Kompyuter' ? '💻' : dt === 'Telefon' ? '📱' : '📟';
      deviceBreakdown += `  ${emoji} ${dt}: ${count}\n`;
    }

    let browserBreakdown = '';
    for (const [db, count] of Object.entries(osBrowsers).sort((a, b) => b[1] - a[1]).slice(0, 5)) {
      browserBreakdown += `  🌐 ${db}: ${count}\n`;
    }

    // Store device stats in stats object for public API
    stats.deviceTypes = deviceTypes;
    stats.osBrowsers = osBrowsers;

    // Format the pinned summary message text
    let statsText = `<a href="https://tinglash.vercel.app/?stats=${encodeURIComponent(JSON.stringify(stats))}">\u200B</a>` +
                    `📌 <b>FluentEar Statistikasi</b>\n\n` +
                    `👥 <b>Unikal foydalanuvchilar:</b> ${stats.totalUnique || 0} ta\n` +
                    `📈 <b>Jami kirishlar:</b> ${stats.totalVisits || 0} marta\n` +
                    `📅 <b>Oylik faol (MAU):</b> ${monthlyActive} ta\n\n` +
                    `📊 <b>Qurilma turlari:</b>\n${deviceBreakdown}\n` +
                    `🖥️ <b>Tizimlar:</b>\n${browserBreakdown}`;

    statsText += `\n🕒 <b>Yangilangan:</b> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`;

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
    return finalNickname;
  } catch (err) {
    console.error("Error in updatePinnedStats helper:", err);
  }
}
