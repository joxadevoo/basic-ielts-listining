let deviceInfo = null;
const loggedTracks = new Set();

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

// Post metrics to Vercel proxy or Telegram API fallback
async function postSystemEvent(text, replyMarkup = null, type = null, nickname = null) {
  const payload = { text, replyMarkup, type, nickname };

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

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: c,
        text: text,
        parse_mode: "HTML",
        reply_markup: replyMarkup
      })
    });
  } catch (err) {
    // Silent fail
  }
}

// Helper to construct inline keyboard buttons
function buildButtons() {
  return {
    inline_keyboard: [
      [
        {
          text: "📊 Statistika olish",
          callback_data: "get_stats"
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
  const language = localStorage.getItem("ielts_lang")?.toUpperCase() || "UZ";
  const { nickname, visitCount } = getDeviceDetails();

  const message = `🚀 <b>Yangi foydalanuvchi kirdi!</b>\n\n` +
                  `👤 <b>Laqabi (Nickname):</b> ${nickname}\n` +
                  `🔢 <b>Kirishlar soni:</b> ${visitCount}\n` +
                  `🖥️ <b>Qurilma:</b> ${device}\n` +
                  `🌐 <b>Til:</b> ${language}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await postSystemEvent(message, buildButtons(), "session_start", nickname);
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

  await postSystemEvent(message, buildButtons());
}

// Track Notebook Save
export async function logNoteSave(trackNum) {
  const { nickname } = getDeviceDetails();

  const message = `📝 <b>Daftarga lug'at/eslatma saqlandi:</b>\n\n` +
                  `👤 <b>Foydalanuvchi (Nickname):</b> ${nickname}\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await postSystemEvent(message, buildButtons());
}

// Track Dictation Save
export async function logDictationSave(trackNum) {
  const { nickname } = getDeviceDetails();

  const message = `✍️ <b>Diktant matni saqlandi:</b>\n\n` +
                  `👤 <b>Foydalanuvchi (Nickname):</b> ${nickname}\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await postSystemEvent(message, buildButtons());
}
