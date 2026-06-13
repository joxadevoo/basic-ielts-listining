import { TRACKS } from './tracks.js';

let deviceInfo = null;
const loggedTracks = new Set();

// Track active usage time in localStorage
let totalUsageTime = parseInt(localStorage.getItem('ielts_total_usage_time') || '0', 10);

setInterval(() => {
  if (document.visibilityState === 'visible') {
    totalUsageTime += 10;
    localStorage.setItem('ielts_total_usage_time', totalUsageTime.toString());
  }
}, 10000);

// Helper to calculate local progress statistics
function getLocalStats() {
  let listenedTracksCount = 0;
  let totalTracksDuration = 0;
  
  try {
    const savedProgress = localStorage.getItem('ielts_listening_progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      Object.keys(progress).forEach(trackNumStr => {
        const trackNum = parseInt(trackNumStr, 10);
        const trackObj = TRACKS.find(t => t.trackNum === trackNum);
        if (trackObj) {
          listenedTracksCount++;
          totalTracksDuration += trackObj.duration || 0;
        }
      });
    }
  } catch (e) {
    console.error("Failed to parse progress in getLocalStats:", e);
  }

  return {
    totalUsageTime,
    listenedTracksCount,
    totalTracksDuration: Math.round(totalTracksDuration)
  };
}

// Helper to get OS and Browser details
function getSysInfo() {
  if (deviceInfo) return deviceInfo;

  const ua = navigator.userAgent;
  let browser = "Unknown";
  let os = "Unknown";

  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("SamsungBrowser")) browser = "Samsung";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
  else if (ua.includes("Edge") || ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  deviceInfo = `${os} (${browser})`;
  return deviceInfo;
}

// Helper to detect if device is Phone, Tablet, or PC
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/iPad|tablet|PlayBook|Silk/i.test(ua)) {
    return "Planshet";
  }
  if (/Mobile|Android|iPod|iPhone|IEMobile|BlackBerry|Opera Mini/i.test(ua)) {
    return "Telefon";
  }
  return "Kompyuter";
}

// Post metrics to Vercel proxy or Telegram API fallback
async function postSystemEvent(text, replyMarkup = null, type = null) {
  const { nickname } = getDeviceDetails();
  const device = getSysInfo();
  const deviceType = getDeviceType();
  const localStats = getLocalStats();

  const payload = {
    text,
    replyMarkup,
    type,
    nickname,
    device,
    deviceType,
    totalUsageTime: localStats.totalUsageTime,
    listenedTracksCount: localStats.listenedTracksCount,
    totalTracksDuration: localStats.totalTracksDuration
  };

  try {
    const response = await fetch("/api/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (response.ok) return;
  } catch (err) {
    // Silent fallback
  }

  const t = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || "";
  const c = import.meta.env.VITE_TELEGRAM_CHAT_ID || "";
  if (!t || !c) return;

  const base = atob("aHR0cHM6Ly9hcGkudGVsZWdyYW0ub3JnL2JvdA==");
  const method = atob("c2VuZE1lc3NhZ2U=");
  const url = `${base}${t}/${method}`;
  const chatIds = c.split(',').map(id => id.trim()).filter(id => id);

  for (const cid of chatIds) {
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: cid,
          text: text,
          parse_mode: "HTML",
          reply_markup: replyMarkup
        })
      });
    } catch (err) {
      // Silent fail
    }
  }
}

// Helper to construct inline keyboard buttons
function buildButtons() {
  return {
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
      ],
      [
        {
          text: "🌐 TinglangApp'ni ochish",
          url: window.location.origin || "https://tinglash.vercel.app/"
        }
      ]
    ]
  };
}

// Helper to get device tracking details
function getDeviceDetails() {
  return {
    nickname: localStorage.getItem('device_nickname') || 'Noma\'lum Qurilma',
    visitCount: localStorage.getItem('device_visit_count') || '1'
  };
}

// Track Session Start
export async function logSessionStart() {
  const device = getSysInfo();
  const deviceType = getDeviceType();
  const language = localStorage.getItem("ielts_lang")?.toUpperCase() || "UZ";
  const { nickname, visitCount } = getDeviceDetails();

  const message = `🚀 <b>Yangi foydalanuvchi kirdi!</b>\n\n` +
                  `👤 <b>Laqabi (Nickname):</b> ${nickname}\n` +
                  `🔢 <b>Kirishlar soni:</b> ${visitCount}\n` +
                  `🖥️ <b>Qurilma:</b> ${device} (${deviceType})\n` +
                  `🌐 <b>Til:</b> ${language}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await postSystemEvent(message, buildButtons(), "session_start");
}

// Track Audio Play
export async function logTrackPlay(trackNum, trackTitle) {
  if (loggedTracks.has(trackNum)) return;
  loggedTracks.add(trackNum);

  const { nickname } = getDeviceDetails();

  const message = `🎧 <b>Trek eshitildi:</b>\n\n` +
                  `👤 <b>Foydalanuvchi (Nickname):</b> ${nickname}\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")} - ${trackTitle}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await postSystemEvent(message, buildButtons(), "track_play");
}

// Track Notebook Save
export async function logNoteSave(trackNum) {
  const { nickname } = getDeviceDetails();

  const message = `📝 <b>Daftarga lug'at/eslatma saqlandi:</b>\n\n` +
                  `👤 <b>Foydalanuvchi (Nickname):</b> ${nickname}\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await postSystemEvent(message, buildButtons(), "note_save");
}

// Track Dictation Save
export async function logDictationSave(trackNum) {
  const { nickname } = getDeviceDetails();

  const message = `✍️ <b>Diktant matni saqlandi:</b>\n\n` +
                  `👤 <b>Foydalanuvchi (Nickname):</b> ${nickname}\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await postSystemEvent(message, buildButtons(), "dictation_save");
}
