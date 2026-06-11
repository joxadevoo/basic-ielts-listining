let locationData = null;
let deviceInfo = null;
const loggedTracks = new Set();

// Helper to get OS and Browser details (Obfuscated / Generic names)
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

// Fetch geolocation data
async function getLocData() {
  if (locationData) return locationData;

  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      locationData = await res.json();
      return locationData;
    }
  } catch (err) {
    console.warn("Loc fetch failed:", err);
  }
  return null;
}

// Post metrics to Vercel proxy or Telegram API fallback (Obfuscated)
async function postSystemEvent(text, replyMarkup = null) {
  const payload = { text, replyMarkup };

  // 1. Try Vercel Serverless Function Proxy first (highly secure, hides token and URL completely)
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
    // Silent fallback to client-side
  }

  // 2. Client-side fallback (Only works if VITE_TELEGRAM env variables are set in client bundle)
  const t = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || "";
  const c = import.meta.env.VITE_TELEGRAM_CHAT_ID || "";
  if (!t || !c) return;

  // Obfuscated Telegram Bot URL reconstruction
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
  const loc = await getLocData();
  const locationStr = loc ? `${loc.city || "Noma'lum"}, ${loc.country_name || "Noma'lum"} (${loc.ip || "Noma'lum"})` : "Noma'lum Joylashuv";
  const device = getSysInfo();
  const language = localStorage.getItem("ielts_lang")?.toUpperCase() || "UZ";

  const message = `🚀 <b>Yangi foydalanuvchi kirdi!</b>\n\n` +
                  `📍 <b>Joylashuv:</b> ${locationStr}\n` +
                  `🖥️ <b>Qurilma:</b> ${device}\n` +
                  `🌐 <b>Til:</b> ${language}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await postSystemEvent(message, buildButtons(loc));
}

// Track Audio Play
export async function logTrackPlay(trackNum, trackTitle) {
  if (loggedTracks.has(trackNum)) return;
  loggedTracks.add(trackNum);

  const loc = await getLocData();
  const locationStr = loc ? `${loc.city || "Noma'lum"}, ${loc.country_name || "Noma'lum"} (${loc.ip || "Noma'lum"})` : "Noma'lum Joylashuv";
  const message = `🎧 <b>Trek eshitildi:</b>\n\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")} - ${trackTitle}\n` +
                  `📍 <b>Foydalanuvchi joylashuvi:</b> ${locationStr}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await postSystemEvent(message, buildButtons(loc));
}

// Track Notebook Save
export async function logNoteSave(trackNum) {
  const loc = await getLocData();
  const locationStr = loc ? `${loc.city || "Noma'lum"}, ${loc.country_name || "Noma'lum"} (${loc.ip || "Noma'lum"})` : "Noma'lum Joylashuv";
  const message = `📝 <b>Daftarga lug'at/eslatma saqlandi:</b>\n\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")}\n` +
                  `📍 <b>Foydalanuvchi:</b> ${locationStr}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await postSystemEvent(message, buildButtons(loc));
}

// Track Dictation Save
export async function logDictationSave(trackNum) {
  const loc = await getLocData();
  const locationStr = loc ? `${loc.city || "Noma'lum"}, ${loc.country_name || "Noma'lum"} (${loc.ip || "Noma'lum"})` : "Noma'lum Joylashuv";
  const message = `✍️ <b>Diktant matni saqlandi:</b>\n\n` +
                  `🎵 <b>Trek:</b> #${trackNum.toString().padStart(2, "0")}\n` +
                  `📍 <b>Foydalanuvchi:</b> ${locationStr}\n` +
                  `🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  await postSystemEvent(message, buildButtons(loc));
}
