const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || "";

let cachedLocation = null;
let deviceInfo = null;
const loggedTracks = new Set();

// Helper to get OS and Browser details
function getDeviceInfo() {
  if (deviceInfo) return deviceInfo;

  const ua = navigator.userAgent;
  let browser = "Unknown Browser";
  let os = "Unknown OS";

  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("SamsungBrowser")) browser = "Samsung Browser";
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

// Fetch geolocation data
async function getLocation() {
  if (cachedLocation) return cachedLocation;

  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      cachedLocation = `${data.city || "Noma'lum"}, ${data.country_name || "Noma'lum"} (${data.ip || "Noma'lum"})`;
      return cachedLocation;
    }
  } catch (err) {
    console.warn("Geolocation fetch failed:", err);
  }

  cachedLocation = "Noma'lum Joylashuv";
  return cachedLocation;
}

// Universal function to send Telegram message
export async function sendTelegramMessage(text) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("Telegram bot token or Chat ID is missing in environment variables.");
    return;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: "HTML"
      })
    });
  } catch (err) {
    console.error("Failed to send Telegram message:", err);
  }
}

// Track Session Start
export async function logSessionStart() {
  const location = await getLocation();
  const device = getDeviceInfo();
  const language = localStorage.getItem("ielts_lang")?.toUpperCase() || "UZ";

  const message = `🚀 <b>Yangi foydalanuvchi kirdi!</b>\n\n` +
                  `📍 <b>Joylashuv:</b> ${location}\n` +
                  `🖥️ <b>Qurilma:</b> ${device}\n` +
                  `🌐 <b>Til:</b> ${language}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await sendTelegramMessage(message);
}

// Track Audio Play
export async function logTrackPlay(trackNum, trackTitle) {
  if (loggedTracks.has(trackNum)) return; // Log only once per track session
  loggedTracks.add(trackNum);

  const location = await getLocation();
  const message = `🎧 <b>Trek eshitildi:</b>\n\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")} - ${trackTitle}\n` +
                  `📍 <b>Foydalanuvchi joylashuvi:</b> ${location}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await sendTelegramMessage(message);
}

// Track Notebook Save
export async function logNoteSave(trackNum) {
  const location = await getLocation();
  const message = `📝 <b>Daftarga lug'at/eslatma saqlandi:</b>\n\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")}\n` +
                  `📍 <b>Foydalanuvchi:</b> ${location}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await sendTelegramMessage(message);
}

// Track Dictation Save
export async function logDictationSave(trackNum) {
  const location = await getLocation();
  const message = `✍️ <b>Diktant matni saqlandi:</b>\n\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")}\n` +
                  `📍 <b>Foydalanuvchi:</b> ${location}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await sendTelegramMessage(message);
}
