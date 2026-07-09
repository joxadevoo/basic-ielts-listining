export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatIdEnv = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID || "";
  const chatIds = chatIdEnv.split(',').map(id => id.trim()).filter(id => id);

  if (!token || chatIds.length === 0) {
    return res.status(200).json({ totalUnique: 0, totalVisits: 0, dailyActive: 0, weeklyActive: 0, monthlyActive: 0, deviceTypes: {} });
  }

  const chatId = chatIds.find(id => id.startsWith('-')) || chatIds[0];

  try {
    const chatRes = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`);
    const chatData = await chatRes.json();

    if (!chatRes.ok || !chatData.ok) {
      return res.status(200).json({ totalUnique: 0, totalVisits: 0, dailyActive: 0, weeklyActive: 0, monthlyActive: 0, deviceTypes: {} });
    }

    const pinnedMessage = chatData.result.pinned_message;
    let result = { totalUnique: 0, totalVisits: 0, dailyActive: 0, weeklyActive: 0, monthlyActive: 0, deviceTypes: {} };

    if (pinnedMessage) {
      let parsedStats = null;
      
      // Try text_link first
      if (pinnedMessage.entities) {
        const linkEntity = pinnedMessage.entities.find(e => e.type === 'text_link' && e.url && e.url.includes('?stats='));
        if (linkEntity) {
          try {
            const urlObj = new URL(linkEntity.url);
            const statsStr = decodeURIComponent(urlObj.searchParams.get('stats'));
            parsedStats = JSON.parse(statsStr);
          } catch (e) {
            console.error("Failed to parse stats from text_link entity:", e);
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
        result.totalUnique = parsedStats.totalUnique || 0;
        result.totalVisits = parsedStats.totalVisits || 0;
        
        // Calculate date boundaries in Tashkent time (GMT+5)
        const getTashkentDateString = (offsetDays = 0) => {
          const d = new Date();
          // Adjust UTC to Tashkent (UTC+5)
          const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
          const tzDate = new Date(utc + (3600000 * 5));
          if (offsetDays !== 0) {
            tzDate.setDate(tzDate.getDate() - offsetDays);
          }
          return tzDate.toISOString().split('T')[0];
        };

        const todayStr = getTashkentDateString(0);
        const sevenDaysAgoStr = getTashkentDateString(7);
        const thirtyDaysAgoStr = getTashkentDateString(30);

        const dailySet = new Set();
        const weeklySet = new Set();
        const monthlySet = new Set();
        const deviceTypes = {};

        if (parsedStats.users) {
          for (const uData of Object.values(parsedStats.users)) {
            const lastAct = uData.la || uData.lastActive;
            const fp = uData.fp || uData.fingerprint;

            if (lastAct && fp) {
              if (lastAct === todayStr) {
                dailySet.add(fp);
              }
              if (lastAct >= sevenDaysAgoStr) {
                weeklySet.add(fp);
              }
              if (lastAct >= thirtyDaysAgoStr) {
                monthlySet.add(fp);
              }
            } else if (lastAct) {
              // Legacy fallback
              if (lastAct === todayStr) dailySet.add(Math.random());
              if (lastAct >= sevenDaysAgoStr) weeklySet.add(Math.random());
              if (lastAct >= thirtyDaysAgoStr) monthlySet.add(Math.random());
            }

            // Device types breakdown
            const dt = uData.dt || uData.deviceType || 'Unknown';
            deviceTypes[dt] = (deviceTypes[dt] || 0) + 1;
          }
        }

        result.dailyActive = dailySet.size;
        result.weeklyActive = weeklySet.size;
        result.monthlyActive = monthlySet.size;
        result.deviceTypes = deviceTypes;
      }
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(200).json({ totalUnique: 0, totalVisits: 0, dailyActive: 0, weeklyActive: 0, monthlyActive: 0, deviceTypes: {}, error: err.message });
  }
}
