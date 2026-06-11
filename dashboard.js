import { db, auth } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';

// DOM Elements
const appContainer = document.querySelector('.app-container');
const adminDashboard = document.getElementById('admin-dashboard');
const loginScreen = document.getElementById('admin-login-screen');
const dashboardPanel = document.getElementById('admin-dashboard-panel');
const loginForm = document.getElementById('admin-login-form');
const btnCancelLogin = document.getElementById('btn-cancel-admin-login');
const loginError = document.getElementById('admin-login-error');
const adminEmailInput = document.getElementById('admin-email');
const adminPasswordInput = document.getElementById('admin-password');

// Menu tabs
const menuItems = document.querySelectorAll('.db-menu-item');
const tabPanels = document.querySelectorAll('.db-tab-panel');

// Refresh & Logout
const btnRefresh = document.getElementById('db-btn-refresh');
const btnLogout = document.getElementById('db-btn-logout');

// Overview Stats
const valDevices = document.getElementById('db-val-devices');
const valSessions = document.getElementById('db-val-sessions');
const valTime = document.getElementById('db-val-time');
const valActive = document.getElementById('db-val-active');

// Breakdown Containers
const chartOsContainer = document.getElementById('db-chart-os');
const chartLocationsContainer = document.getElementById('db-chart-locations');

// Lists
const devicesListContainer = document.getElementById('db-devices-list');
const sessionsListContainer = document.getElementById('db-sessions-list');
const deviceSearchInput = document.getElementById('db-device-search');

// Modal Elements
const deviceModal = document.getElementById('db-device-modal');
const modalTitle = document.getElementById('db-modal-device-title');
const modalOs = document.getElementById('db-detail-os');
const modalBrowser = document.getElementById('db-detail-browser');
const modalLocation = document.getElementById('db-detail-location');
const modalSessionsCount = document.getElementById('db-detail-sessions-count');
const modalTimeline = document.getElementById('db-device-timeline');
const btnCloseModal = document.getElementById('db-btn-close-modal');

// State
let dashboardState = {
  devices: [],
  sessions: [],
  activeTab: 'overview',
  adminUser: null
};

// Target admin email
const ADMIN_EMAIL = 'joxacybers@gmail.com';
const ADMIN_PASSWORD_FALLBACK = 'tryhackme04';

// Format session duration
function formatDuration(seconds) {
  if (isNaN(seconds) || seconds <= 0) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  if (h > 0) return `${h}s ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// Format timestamp to local string
function formatTimestamp(timestamp) {
  if (!timestamp) return "-";
  
  let date;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }
  
  return date.toLocaleString('uz-UZ', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function initDashboard() {
  if (!adminDashboard) return;

  // Listen to hash changes
  window.addEventListener('hashchange', checkHashRoute);
  
  // Initial check
  checkHashRoute();

  // Listen to Auth State
  if (auth) {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email === ADMIN_EMAIL) {
        dashboardState.adminUser = user;
        showDashboardPanel();
        loadAnalyticsData();
      } else {
        dashboardState.adminUser = null;
        if (window.location.hash === '#ma2010') {
          showLoginScreen();
        }
      }
    });
  }

  setupDashboardEventListeners();
}

function checkHashRoute() {
  const isDashboardHash = window.location.hash === '#ma2010';
  
  if (isDashboardHash) {
    appContainer.classList.add('dashboard-active');
    adminDashboard.style.display = 'flex';
    
    if (dashboardState.adminUser) {
      showDashboardPanel();
    } else {
      showLoginScreen();
    }
  } else {
    appContainer.classList.remove('dashboard-active');
    adminDashboard.style.display = 'none';
  }
}

function showLoginScreen() {
  loginScreen.style.display = 'flex';
  dashboardPanel.style.display = 'none';
  loginError.style.display = 'none';
}

function showDashboardPanel() {
  loginScreen.style.display = 'none';
  dashboardPanel.style.display = 'flex';
}

function setupDashboardEventListeners() {
  // Login Submit
  loginForm.addEventListener('submit', handleAdminLogin);
  
  // Cancel/Orqaga
  btnCancelLogin.addEventListener('click', () => {
    window.location.hash = 'app';
  });

  // Sidebar Menu Tabs
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.dbTab;
      switchTab(tab);
    });
  });

  // Refresh
  btnRefresh.addEventListener('click', () => {
    loadAnalyticsData();
  });

  // Logout
  btnLogout.addEventListener('click', async () => {
    if (auth) {
      await signOut(auth);
      window.location.hash = 'app';
    }
  });

  // Device Search
  deviceSearchInput.addEventListener('input', renderDevices);

  // Close detail modal
  btnCloseModal.addEventListener('click', () => {
    deviceModal.classList.remove('active');
  });
}

// Switching tab panels
function switchTab(tab) {
  dashboardState.activeTab = tab;
  
  menuItems.forEach(item => {
    if (item.dataset.dbTab === tab) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  tabPanels.forEach(panel => {
    if (panel.id === `db-panel-${tab}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  if (tab === 'devices') {
    renderDevices();
  } else if (tab === 'sessions') {
    renderSessions();
  }
}

// Handle Login Form Submit
async function handleAdminLogin(e) {
  e.preventDefault();
  loginError.style.display = 'none';

  const email = adminEmailInput.value.trim();
  const password = adminPasswordInput.value;

  if (email.toLowerCase() !== ADMIN_EMAIL) {
    loginError.textContent = "Sizda admin huquqlari mavjud emas!";
    loginError.style.display = 'block';
    return;
  }

  if (!auth) {
    loginError.textContent = "Firebase yuklanmagan!";
    loginError.style.display = 'block';
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.warn("Auth error, attempting registration fallback:", err);
    // Fallback: If user not found, create admin user dynamically if credentials match fallback
    if ((err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') && 
        email === ADMIN_EMAIL && password === ADMIN_PASSWORD_FALLBACK) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (signupErr) {
        console.error("Sign up error:", signupErr);
        loginError.textContent = "Parol noto'g'ri kiritildi!";
        loginError.style.display = 'block';
      }
    } else {
      loginError.textContent = "Parol noto'g'ri yoki xatolik yuz berdi!";
      loginError.style.display = 'block';
    }
  }
}

// Load Data from Firestore
async function loadAnalyticsData() {
  if (!db) return;

  btnRefresh.disabled = true;
  btnRefresh.innerHTML = `
    <svg class="loading-spin" viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: currentColor; animation: spin 1s linear infinite;">
      <path d="M12 4V2C6.48 2 2 6.48 2 12h2c0-4.41 3.59-8 8-8zm0 16v2c5.52 0 10-4.48 10-10h-2c0 4.41-3.59 8-8 8z"/>
    </svg>
    Yuklanmoqda...
  `;

  // Define CSS keyframe in JS if not already styled for spin animation
  if (!document.getElementById('db-loading-style')) {
    const style = document.createElement('style');
    style.id = 'db-loading-style';
    style.textContent = `
      @keyframes spin { 100% { transform: rotate(360deg); } }
      .loading-spin { animation: spin 1s linear infinite; }
    `;
    document.head.appendChild(style);
  }

  try {
    // 1. Fetch devices
    const devicesQuery = query(collection(db, 'ielts_devices'), orderBy('lastSeen', 'desc'));
    const devicesSnap = await getDocs(devicesQuery);
    const devices = [];
    devicesSnap.forEach(doc => {
      devices.push(doc.data());
    });
    dashboardState.devices = devices;

    // 2. Fetch sessions
    const sessionsQuery = query(collection(db, 'ielts_sessions'), orderBy('startTime', 'desc'));
    const sessionsSnap = await getDocs(sessionsQuery);
    const sessions = [];
    sessionsSnap.forEach(doc => {
      sessions.push(doc.data());
    });
    dashboardState.sessions = sessions;

    // Render dashboard views
    updateOverviewStats();
    if (dashboardState.activeTab === 'devices') {
      renderDevices();
    } else if (dashboardState.activeTab === 'sessions') {
      renderSessions();
    }

  } catch (err) {
    console.error("Error loading analytics:", err);
  } finally {
    btnRefresh.disabled = false;
    btnRefresh.innerHTML = `
      <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: currentColor;">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
      </svg>
      Yangilash
    `;
  }
}

// Aggregate and Render Overview Panel
function updateOverviewStats() {
  const devicesCount = dashboardState.devices.length;
  const sessionsCount = dashboardState.sessions.length;
  
  // Calculate total duration
  let totalSeconds = 0;
  dashboardState.sessions.forEach(s => {
    totalSeconds += s.duration || 0;
  });
  
  // Calculate active today (last 24 hours)
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const activeTodayCount = dashboardState.sessions.filter(s => {
    const start = s.startTime?.toDate ? s.startTime.toDate().getTime() : new Date(s.startTime).getTime();
    return start >= oneDayAgo;
  }).length;

  valDevices.textContent = devicesCount;
  valSessions.textContent = sessionsCount;
  valTime.textContent = formatDuration(totalSeconds);
  valActive.textContent = activeTodayCount;

  // Aggregate platforms (OS)
  const osCounts = {};
  dashboardState.devices.forEach(d => {
    const os = d.os || "Unknown";
    osCounts[os] = (osCounts[os] || 0) + 1;
  });
  renderBreakdown(chartOsContainer, osCounts, devicesCount);

  // Aggregate locations (Country + City)
  const locationCounts = {};
  dashboardState.devices.forEach(d => {
    const loc = d.location ? `${d.location.country || "Unknown"}, ${d.location.city || "Unknown"}` : "Unknown";
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });
  renderBreakdown(chartLocationsContainer, locationCounts, devicesCount);
}

function renderBreakdown(container, counts, total) {
  container.innerHTML = '';
  
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) {
    container.innerHTML = '<div style="color:var(--text-muted); font-size:0.8rem; text-align:center;">Ma\'lumotlar mavjud emas</div>';
    return;
  }

  // Display top 5
  sorted.slice(0, 5).forEach(([label, count]) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    
    const item = document.createElement('div');
    item.className = 'db-chart-bar-item';
    item.innerHTML = `
      <div class="db-chart-bar-label-row">
        <span>${label}</span>
        <span>${count} (${pct}%)</span>
      </div>
      <div class="db-chart-bar-bg">
        <div class="db-chart-bar-fill" style="width: ${pct}%"></div>
      </div>
    `;
    container.appendChild(item);
  });
}

// Render Devices Tab
function renderDevices() {
  devicesListContainer.innerHTML = '';
  const queryText = deviceSearchInput.value.toLowerCase().trim();

  const filteredDevices = dashboardState.devices.filter(d => {
    const id = (d.deviceId || "").toLowerCase();
    const os = (d.os || "").toLowerCase();
    const browser = (d.browser || "").toLowerCase();
    const country = d.location?.country ? d.location.country.toLowerCase() : "";
    const city = d.location?.city ? d.location.city.toLowerCase() : "";
    
    return id.includes(queryText) || os.includes(queryText) || browser.includes(queryText) || country.includes(queryText) || city.includes(queryText);
  });

  if (filteredDevices.length === 0) {
    devicesListContainer.innerHTML = '<div style="color:var(--text-muted); padding:32px; text-align:center;">Qurilmalar topilmadi</div>';
    return;
  }

  filteredDevices.forEach(d => {
    const item = document.createElement('div');
    item.className = 'db-list-item';
    
    const countryCode = d.location?.country ? d.location.country.substring(0, 2).toUpperCase() : "??";
    const lastSeenStr = formatTimestamp(d.lastSeen);
    
    item.innerHTML = `
      <div class="db-item-primary">
        <div class="db-device-avatar">${countryCode}</div>
        <div class="db-item-details">
          <div class="db-item-title">${d.location?.city || "Unknown City"}, ${d.location?.country || "Unknown Country"}</div>
          <div class="db-item-subtitle">${d.os || "Unknown OS"} • ${d.browser || "Unknown Browser"} • ID: ${d.deviceId.substring(0, 15)}...</div>
        </div>
      </div>
      <div class="db-item-meta">
        <div class="db-meta-primary">${d.sessionCount || 1} ta sessiya</div>
        <div class="db-meta-secondary">Oxirgi faollik: ${lastSeenStr}</div>
      </div>
    `;
    
    item.addEventListener('click', () => openDeviceDetailModal(d));
    devicesListContainer.appendChild(item);
  });
}

// Render Sessions Tab
function renderSessions() {
  sessionsListContainer.innerHTML = '';

  if (dashboardState.sessions.length === 0) {
    sessionsListContainer.innerHTML = '<div style="color:var(--text-muted); padding:32px; text-align:center;">Sessiyalar topilmadi</div>';
    return;
  }

  dashboardState.sessions.forEach(s => {
    const item = document.createElement('div');
    item.className = 'db-list-item';
    
    // Find device location
    const dev = dashboardState.devices.find(d => d.deviceId === s.deviceId);
    const locationStr = dev?.location ? `${dev.location.city || "Unknown"}, ${dev.location.country || "Unknown"}` : (s.location ? `${s.location.city || "Unknown"}, ${s.location.country || "Unknown"}` : "Unknown Location");
    const countryCode = dev?.location?.country ? dev.location.country.substring(0, 2).toUpperCase() : (s.location?.country ? s.location.country.substring(0, 2).toUpperCase() : "??");
    const startTimeStr = formatTimestamp(s.startTime);
    const durationStr = formatDuration(s.duration);
    
    // Tracks summary
    const tracksPlayedCount = s.tracks ? s.tracks.length : 0;
    
    item.innerHTML = `
      <div class="db-item-primary">
        <div class="db-device-avatar">${countryCode}</div>
        <div class="db-item-details">
          <div class="db-item-title">${locationStr}</div>
          <div class="db-item-subtitle">Boshlandi: ${startTimeStr} • ID: ${s.deviceId.substring(0, 10)}...</div>
        </div>
      </div>
      <div class="db-item-meta">
        <div class="db-meta-primary">Davomiyligi: ${durationStr}</div>
        <div class="db-meta-secondary">${tracksPlayedCount} ta audio tinglandi</div>
      </div>
    `;
    
    item.addEventListener('click', () => {
      if (dev) openDeviceDetailModal(dev);
    });
    sessionsListContainer.appendChild(item);
  });
}

// Device details modal
function openDeviceDetailModal(device) {
  modalTitle.textContent = `Qurilma: ${device.deviceId.substring(0, 15)}...`;
  modalOs.textContent = device.os || "Noma'lum";
  modalBrowser.textContent = device.browser || "Noma'lum";
  modalLocation.textContent = device.location ? `${device.location.city || "Noma'lum"}, ${device.location.country || "Noma'lum"} (${device.location.ip || "Noma'lum"})` : "Noma'lum";
  modalSessionsCount.textContent = device.sessionCount || 1;

  // Build timeline
  modalTimeline.innerHTML = '';
  
  // Filter sessions for this device
  const devSessions = dashboardState.sessions
    .filter(s => s.deviceId === device.deviceId)
    .sort((a, b) => {
      const aTime = a.startTime?.toDate ? a.startTime.toDate().getTime() : new Date(a.startTime).getTime();
      const bTime = b.startTime?.toDate ? b.startTime.toDate().getTime() : new Date(b.startTime).getTime();
      return bTime - aTime;
    });

  if (devSessions.length === 0) {
    modalTimeline.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem;">Sessiyalar tarixi mavjud emas</div>';
  } else {
    devSessions.forEach(s => {
      const sessionDateStr = formatTimestamp(s.startTime);
      const durationStr = formatDuration(s.duration);
      
      const sessionItem = document.createElement('div');
      sessionItem.className = 'db-timeline-item';
      
      let tracksLog = '';
      if (s.tracks && s.tracks.length > 0) {
        tracksLog = `<div style="margin-top: 6px; font-size:0.78rem; color:var(--text-muted)">
          Tinglangan audio treklar: ${s.tracks.map(t => `<strong style="color:var(--color-secondary)">Trek ${t.trackNum.toString().padStart(2, '0')}</strong>`).join(', ')}
        </div>`;
      }
      
      let savesLog = '';
      if (s.notesSaved > 0 || s.dictationsSaved > 0) {
        savesLog = `<div style="margin-top: 4px; font-size:0.76rem; color:hsl(150, 90%, 40%)">
          Harakatlar: ${s.notesSaved > 0 ? `Daftarga saqlandi (${s.notesSaved} marta)` : ''} 
          ${s.dictationsSaved > 0 ? `${s.notesSaved > 0 ? ' • ' : ''}Diktant saqlandi (${s.dictationsSaved} marta)` : ''}
        </div>`;
      }

      sessionItem.innerHTML = `
        <div class="db-timeline-time">${sessionDateStr}</div>
        <div class="db-timeline-content">
          Sessiya boshlandi • Davomiyligi: <strong>${durationStr}</strong> • Til: ${s.language?.toUpperCase() || 'UZ'}
          ${tracksLog}
          ${savesLog}
        </div>
      `;
      modalTimeline.appendChild(sessionItem);
    });
  }

  deviceModal.classList.add('active');
}
