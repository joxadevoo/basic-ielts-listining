const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || "";

let locationData = null;
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
async function getLocationData() {
  if (locationData) return locationData;

  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      locationData = await res.json();
      return locationData;
    }
  } catch (err) {
    console.warn("Geolocation fetch failed:", err);
  }
  return null;
}

// Universal function to send Telegram message with optional buttons
export async function sendTelegramMessage(text, replyMarkup = null) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("Telegram bot token or Chat ID is missing in environment variables.");
    return;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: CHAT_ID,
    text: text,
    parse_mode: "HTML"
  };

  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Failed to send Telegram message:", err);
  }
}

// Helper to construct location keyboard buttons
function buildButtons(loc) {
  const buttons = [];
  const locationRow = [];

  if (loc) {
    if (loc.latitude && loc.longitude) {
      locationRow.push({
        text: "📍 Xaritada ko'rish",
        url: `https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`
      });
    }
    if (loc.ip) {
      locationRow.push({
        text: "🔍 IP Tafsilotlari",
        url: `https://ipinfo.io/${loc.ip}`
      });
    }
  }

  if (locationRow.length > 0) {
    buttons.push(locationRow);
  }

  // Row for App Link
  buttons.push([
    {
      text: "🌐 TinglangApp'ni ochish",
      url: window.location.origin || "https://tinglash.vercel.app/"
    }
  ]);

  return { inline_keyboard: buttons };
}

// Track Session Start
export async function logSessionStart() {
  const loc = await getLocationData();
  const locationStr = loc ? `${loc.city || "Noma'lum"}, ${loc.country_name || "Noma'lum"} (${loc.ip || "Noma'lum"})` : "Noma'lum Joylashuv";
  const device = getDeviceInfo();
  const language = localStorage.getItem("ielts_lang")?.toUpperCase() || "UZ";

  const message = `🚀 <b>Yangi foydalanuvchi kirdi!</b>\n\n` +
                  `📍 <b>Joylashuv:</b> ${locationStr}\n` +
                  `🖥️ <b>Qurilma:</b> ${device}\n` +
                  `🌐 <b>Til:</b> ${language}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await sendTelegramMessage(message, buildButtons(loc));
}

// Track Audio Play
export async function logTrackPlay(trackNum, trackTitle) {
  if (loggedTracks.has(trackNum)) return; // Log only once per track session
  loggedTracks.add(trackNum);

  const loc = await getLocationData();
  const locationStr = loc ? `${loc.city || "Noma'lum"}, ${loc.country_name || "Noma'lum"} (${loc.ip || "Noma'lum"})` : "Noma'lum Joylashuv";
  const message = `🎧 <b>Trek eshitildi:</b>\n\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")} - ${trackTitle}\n` +
                  `📍 <b>Foydalanuvchi joylashuvi:</b> ${locationStr}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await sendTelegramMessage(message, buildButtons(loc));
}

// Track Notebook Save
export async function logNoteSave(trackNum) {
  const loc = await getLocationData();
  const locationStr = loc ? `${loc.city || "Noma'lum"}, ${loc.country_name || "Noma'lum"} (${loc.ip || "Noma'lum"})` : "Noma'lum Joylashuv";
  const message = `📝 <b>Daftarga lug'at/eslatma saqlandi:</b>\n\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")}\n` +
                  `📍 <b>Foydalanuvchi:</b> ${locationStr}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await sendTelegramMessage(message, buildButtons(loc));
}

// Track Dictation Save
export async function logDictationSave(trackNum) {
  const loc = await getLocationData();
  const locationStr = loc ? `${loc.city || "Noma'lum"}, ${loc.country_name || "Noma'lum"} (${loc.ip || "Noma'lum"})` : "Noma'lum Joylashuv";
  const message = `✍️ <b>Diktant matni saqlandi:</b>\n\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")}\n` +
                  `📍 <b>Foydalanuvchi:</b> ${locationStr}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await sendTelegramMessage(message, buildButtons(loc));
}
