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
      Object.keys(progress).forEach((trackNumStr) => {
        const trackNum = parseInt(trackNumStr, 10);
        const trackObj = TRACKS.find((t) => t.trackNum === trackNum);
        if (trackObj) {
          listenedTracksCount++;
          totalTracksDuration += trackObj.duration || 0;
        }
      });
    }
  } catch (e) {
    console.error('Failed to parse progress in getLocalStats:', e);
  }

  return {
    totalUsageTime,
    listenedTracksCount,
    totalTracksDuration: Math.round(totalTracksDuration),
  };
}

// Helper to get OS and Browser details
function getSysInfo() {
  if (deviceInfo) return deviceInfo;

  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('SamsungBrowser')) browser = 'Samsung';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
  else if (ua.includes('Edge') || ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  deviceInfo = `${os} (${browser})`;
  return deviceInfo;
}

// Helper to detect if device is Phone, Tablet, or PC
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/iPad|tablet|PlayBook|Silk/i.test(ua)) {
    return 'Planshet';
  }
  if (/Mobile|Android|iPod|iPhone|IEMobile|BlackBerry|Opera Mini/i.test(ua)) {
    return 'Telefon';
  }
  return 'Kompyuter';
}

function getDeviceId() {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = `tinglang-${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
}

// Post validated event payload to server-side /api/log
async function postSystemEvent(type, extras = {}) {
  const { nickname, visitCount } = getDeviceDetails();
  const localStats = getLocalStats();

  const payload = {
    type,
    deviceId: getDeviceId(),
    nickname,
    device: getSysInfo(),
    deviceType: getDeviceType(),
    visitCount: parseInt(visitCount, 10) || 1,
    language: localStorage.getItem('ielts_lang')?.toUpperCase() || 'UZ',
    totalUsageTime: localStats.totalUsageTime,
    listenedTracksCount: localStats.listenedTracksCount,
    totalTracksDuration: localStats.totalTracksDuration,
    ...extras,
  };

  try {
    const response = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // Server unavailable — skip logging
  }
}

function getDeviceDetails() {
  return {
    nickname: localStorage.getItem('device_nickname') || "Noma'lum Qurilma",
    visitCount: localStorage.getItem('device_visit_count') || '1',
  };
}

export async function logSessionStart() {
  const { nickname } = getDeviceDetails();
  const res = await postSystemEvent('session_start');
  if (res && res.nickname && res.nickname !== nickname) {
    localStorage.setItem('device_nickname', res.nickname);
    window.dispatchEvent(new CustomEvent('nickname-restored', { detail: res.nickname }));
  }
}

export async function logTrackPlay(trackNum) {
  if (loggedTracks.has(trackNum)) return;
  loggedTracks.add(trackNum);
  await postSystemEvent('track_play', { trackNum });
}

export async function logNoteSave(trackNum) {
  await postSystemEvent('note_save', { trackNum });
}

export async function logDictationSave(trackNum) {
  await postSystemEvent('dictation_save', { trackNum });
}