import { db } from './firebase.js';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  increment, 
  arrayUnion, 
  serverTimestamp, 
  getDoc 
} from 'firebase/firestore';

// Helper to detect device info
function getDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let deviceType = "Desktop";

  // Simple browser detection
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("SamsungBrowser")) browser = "Samsung Browser";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
  else if (ua.includes("Trident")) browser = "Internet Explorer";
  else if (ua.includes("Edge") || ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

  // Simple OS detection
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  // Simple Device Type detection
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
    deviceType = "Mobile";
  } else if (/Tablet|iPad/i.test(ua)) {
    deviceType = "Tablet";
  }

  return { browser, os, deviceType, userAgent: ua };
}

// Generate unique ID
function generateUUID() {
  return 'device_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Retrieve or create Device ID
export function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem('ielts_device_id');
  if (!deviceId) {
    deviceId = generateUUID();
    localStorage.setItem('ielts_device_id', deviceId);
  }
  return deviceId;
}

let currentSessionId = null;
let sessionActive = false;
let sessionStartTime = null;

export async function initAnalytics() {
  if (!db) return;

  const deviceId = getOrCreateDeviceId();
  const deviceInfo = getDeviceInfo();
  currentSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  sessionStartTime = new Date();
  sessionActive = true;

  // Attempt to fetch IP location
  let location = { country: "Unknown", city: "Unknown", ip: "Unknown" };
  try {
    // Using a fast and free API for geolocation
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      location = {
        country: data.country_name || "Unknown",
        city: data.city || "Unknown",
        ip: data.ip || "Unknown"
      };
    }
  } catch (err) {
    console.warn("Could not retrieve geolocation data:", err);
  }

  // Update or create device doc
  const deviceRef = doc(db, 'ielts_devices', deviceId);
  try {
    const deviceSnap = await getDoc(deviceRef);
    if (!deviceSnap.exists()) {
      await setDoc(deviceRef, {
        deviceId,
        firstSeen: serverTimestamp(),
        lastSeen: serverTimestamp(),
        sessionCount: 1,
        ...deviceInfo,
        location
      });
    } else {
      await updateDoc(deviceRef, {
        lastSeen: serverTimestamp(),
        sessionCount: increment(1),
        location // Update location in case it changed
      });
    }
  } catch (err) {
    console.error("Error writing device analytics:", err);
  }

  // Create session doc
  const sessionRef = doc(db, 'ielts_sessions', currentSessionId);
  try {
    await setDoc(sessionRef, {
      sessionId: currentSessionId,
      deviceId,
      startTime: serverTimestamp(),
      lastActiveTime: serverTimestamp(),
      duration: 0,
      tracks: [],
      notesSaved: 0,
      dictationsSaved: 0,
      location,
      userAgent: deviceInfo.userAgent,
      language: localStorage.getItem('ielts_lang') || 'uz'
    });
  } catch (err) {
    console.error("Error writing session analytics:", err);
  }

  // Heartbeat every 20 seconds
  setInterval(sendHeartbeat, 20000);

  // Monitor tab visibility / window focus to capture session pauses or duration accurately
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      sendHeartbeat();
    }
  });
}

// Send Heartbeat / Sync duration
async function sendHeartbeat() {
  if (!db || !currentSessionId || !sessionActive) return;

  const now = new Date();
  const duration = Math.floor((now - sessionStartTime) / 1000); // duration in seconds

  const sessionRef = doc(db, 'ielts_sessions', currentSessionId);
  try {
    await updateDoc(sessionRef, {
      lastActiveTime: serverTimestamp(),
      duration: duration
    });
  } catch (err) {
    console.error("Error sending heartbeat:", err);
  }
}

// Log when a track is played
export async function logTrackPlay(trackNum) {
  if (!db || !currentSessionId) return;

  const sessionRef = doc(db, 'ielts_sessions', currentSessionId);
  try {
    await updateDoc(sessionRef, {
      tracks: arrayUnion({
        trackNum,
        playedAt: new Date()
      })
    });
  } catch (err) {
    console.error("Error logging track play:", err);
  }
}

// Log when a notebook note is saved
export async function logNoteSave() {
  if (!db || !currentSessionId) return;

  const sessionRef = doc(db, 'ielts_sessions', currentSessionId);
  try {
    await updateDoc(sessionRef, {
      notesSaved: increment(1)
    });
  } catch (err) {
    console.error("Error logging note save:", err);
  }
}

// Log when a dictation is saved
export async function logDictationSave() {
  if (!db || !currentSessionId) return;

  const sessionRef = doc(db, 'ielts_sessions', currentSessionId);
  try {
    await updateDoc(sessionRef, {
      dictationsSaved: increment(1)
    });
  } catch (err) {
    console.error("Error logging dictation save:", err);
  }
}
