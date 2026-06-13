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
    return res.status(200).json({ totalUnique: 0, totalVisits: 0, monthlyActive: 0 });
  }

  // Use the group chat ID (starts with -) if available, otherwise the first chat ID
  const chatId = chatIds.find(id => id.startsWith('-')) || chatIds[0];

  try {
    const chatRes = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`);
    const chatData = await chatRes.json();

    if (!chatRes.ok || !chatData.ok) {
      return res.status(200).json({ totalUnique: 0, totalVisits: 0, monthlyActive: 0 });
    }

    const pinnedMessage = chatData.result.pinned_message;
    let stats = { totalUnique: 0, totalVisits: 0, monthlyActive: 0 };

    if (pinnedMessage) {
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
        stats.totalUnique = parsedStats.totalUnique || 0;
        stats.totalVisits = parsedStats.totalVisits || 0;
        
        // Calculate active users in the last 30 days (Monthly Active Users)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

        let monthlyActive = 0;
        if (parsedStats.users) {
          for (const uData of Object.values(parsedStats.users)) {
            if (uData.lastActive && uData.lastActive >= thirtyDaysAgoStr) {
              monthlyActive++;
            }
          }
        }
        stats.monthlyActive = monthlyActive;
      }
    }

    return res.status(200).json(stats);
  } catch (err) {
    return res.status(200).json({ totalUnique: 0, totalVisits: 0, monthlyActive: 0, error: err.message });
  }
}
