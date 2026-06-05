import { TRACKS } from './tracks.js';

const TRANSLATIONS = {
  en: {
    logo_title: "Basic IELTS Listening",
    header_progress: "Progress:",
    tab_tracks: "Tracks",
    tab_dictation: "Dictation",
    tab_notes: "Notebook",
    tab_analytics: "Analytics",
    
    // PDF shortcuts
    shortcut_unit_1: "Unit 1",
    shortcut_unit_2: "Unit 2",
    shortcut_unit_3: "Unit 3",
    shortcut_unit_4: "Unit 4",
    shortcut_unit_5: "Unit 5",
    shortcut_tapescripts: "Tapescripts",
    shortcut_answers: "Answers",
    
    // Playlist filters
    search_placeholder: "Search track name, unit or notes...",
    filter_all: "All Tracks",
    filter_completed: "Completed",
    filter_in_progress: "In Progress",
    filter_unattempted: "Unattempted",
    no_tracks_found: "No tracks found matching criteria.",
    
    // Units translation
    unit_title: "Unit",
    unit_1_name: "Names and Places",
    unit_2_name: "Numbers",
    unit_3_name: "Survival English",
    unit_4_name: "Popular Science",
    unit_5_name: "Academic English",
    track_label: "Track",
    score_label: "Score",
    
    // Dictation
    dictation_pad_title: "Dictation Pad:",
    btn_save_dictation: "Save Dictation",
    btn_clear: "Clear",
    dictation_desc: "Listen to the segment and type what you hear. Use shortcuts to control the audio player directly from the keyboard.",
    dictation_placeholder: "Start typing the transcript here...",
    stats_words: "Words:",
    stats_chars: "Characters:",
    shortcuts_title: "Keyboard Shortcuts:",
    shortcut_play_pause: "Play/Pause",
    shortcut_rewind: "Rewind 5s",
    shortcut_forward: "Fast Forward 5s",
    
    // Notebook
    notebook_title: "Vocab & General Notes",
    btn_export_notes: "Export Notes (.txt)",
    btn_save_notes: "Save Notes",
    notebook_desc: "Keep track of spelling notes, tricky pronunciation patterns, or new vocabulary words you learn from this track.",
    notebook_placeholder: "Write down vocabulary, notes, or tips for the current track...",
    
    // Dashboard
    dashboard_completed_exercises: "Completed Exercises",
    dashboard_practiced_tracks: "Practiced Tracks",
    dashboard_weekly_sessions: "Weekly Listening Sessions",
    dashboard_unit_breakdown: "Unit Progress Breakdown",
    day_mon: "Mon",
    day_tue: "Tue",
    day_wed: "Wed",
    day_thu: "Thu",
    day_fri: "Fri",
    day_sat: "Sat",
    day_sun: "Sun",
    
    // Player
    player_select_track: "Select a track to practice",
    player_default_subtitle: "Basic IELTS Listening",
    btn_ab_loop: "A-B Repeat",
    
    // Settings Modal
    modal_settings_title: "Settings & PDF Calibration",
    setting_offset_title: "PDF Page Offset",
    setting_offset_desc: "Adjust this if the browser page numbers do not align with the physical book pages (typically 0, 1, or 2).",
    setting_reset_title: "Reset Progress & Notes",
    setting_reset_desc: "Permanently delete all saved notes, scores, and track progress history.",
    btn_reset_data: "Reset Data",
    btn_save_close: "Save & Close",
    dev_credit: "Developed by Jakhongir Toshpulatov",
    coffee_desc: "If you find this application helpful, consider supporting the developer!",
    support_modal_title: "Support Developer",
    support_desc: "If you find this application helpful, you can support the developer.",
    support_footer_note: "You can support the developer through this card.",
    btn_copy_card: "Copy Card Number",
    toast_card_copied: "Card number copied to clipboard!",
    btn_close: "Close",
    feedback_btn_text: "Feedback & Bugs",
    
    // Toast messages / Dialogs
    toast_progress_saved: "Progress saved!",
    toast_loop_a_set: "Loop Point A set at ",
    toast_loop_b_error: "Point B must be after Point A!",
    toast_loop_started: "Loop started: ",
    toast_notes_exported: "Notes exported successfully!",
    toast_progress_reset: "All progress history has been reset.",
    toast_settings_applied: "Settings applied & saved!",
    toast_pdf_scrolled: "PDF scrolled to page ",
    toast_dictation_saved: "Dictation text saved!",
    toast_notes_saved: "Vocabulary & Notes saved!",
    toast_theme_switched: "Switched to ",
    toast_playing: "Playing...",
    toast_paused: "Paused",
    toast_track_finished: "Track finished. Moving to next track in 2s...",
    confirm_clear_dictation: "Clear written dictation text?",
    confirm_reset_data: "Are you absolutely sure you want to delete all practice history? This will delete all your written answers, dictation transcriptions, notes, and scores forever."
  },
  uz: {
    logo_title: "Basic IELTS Listening",
    header_progress: "O'zlashtirish:",
    tab_tracks: "Treklar",
    tab_dictation: "Diktant",
    tab_notes: "Daftar",
    tab_analytics: "Analitika",
    
    // PDF shortcuts
    shortcut_unit_1: "1-Bo'lim",
    shortcut_unit_2: "2-Bo'lim",
    shortcut_unit_3: "3-Bo'lim",
    shortcut_unit_4: "4-Bo'lim",
    shortcut_unit_5: "5-Bo'lim",
    shortcut_tapescripts: "Matnlar",
    shortcut_answers: "Javoblar",
    
    // Playlist filters
    search_placeholder: "Trek nomi, bo'lim yoki eslatmalarni qidirish...",
    filter_all: "Barcha Treklar",
    filter_completed: "Tugallangan",
    filter_in_progress: "Bajarilmoqda",
    filter_unattempted: "Boshlanmagan",
    no_tracks_found: "Mos keladigan treklar topilmadi.",
    
    // Units translation
    unit_title: "Bo'lim",
    unit_1_name: "Ismlar va joylar",
    unit_2_name: "Raqamlar",
    unit_3_name: "Kundalik ingliz tili",
    unit_4_name: "Ommabop ilm-fan",
    unit_5_name: "Akademik ingliz tili",
    track_label: "Trek",
    score_label: "Natija",
    
    // Dictation
    dictation_pad_title: "Diktant maydoni:",
    btn_save_dictation: "Diktantni saqlash",
    btn_clear: "Tozalash",
    dictation_desc: "Segmentni tinglang va eshitganingizni yozing. Klaviaturadan audio pleyerni to'g'ridan-to'g'ri boshqarish uchun tezkor tugmalardan foydalaning.",
    dictation_placeholder: "Matnni bu yerga yozishni boshlang...",
    stats_words: "So'zlar soni:",
    stats_chars: "Belgilar soni:",
    shortcuts_title: "Tezkor tugmalar:",
    shortcut_play_pause: "Ijro/Pauza",
    shortcut_rewind: "5s orqaga",
    shortcut_forward: "5s oldinga",
    
    // Notebook
    notebook_title: "Lug'at va umumiy eslatmalar",
    btn_export_notes: "Eslatmalarni yuklab olish (.txt)",
    btn_save_notes: "Saqlash",
    notebook_desc: "Ushbu trekdan o'rgangan yangi so'zlaringiz, to'g'ri yozish qoidalari yoki qiyin talaffuzlarni yozib boring.",
    notebook_placeholder: "Ushbu trek uchun lug'at, qoidalar yoki maslahatlarni yozing...",
    
    // Dashboard
    dashboard_completed_exercises: "Bajarilgan mashqlar",
    dashboard_practiced_tracks: "Tinglangan treklar soni",
    dashboard_weekly_sessions: "Haftalik tinglash faolligi",
    dashboard_unit_breakdown: "Bo'limlar kesimida o'zlashtirish",
    day_mon: "Dush",
    day_tue: "Sesh",
    day_wed: "Chor",
    day_thu: "Pay",
    day_fri: "Jum",
    day_sat: "Shan",
    day_sun: "Yak",
    
    // Player
    player_select_track: "Mashq qilish uchun trek tanlang",
    player_default_subtitle: "Basic IELTS Listening",
    btn_ab_loop: "A-B Takrorlash",
    
    // Settings Modal
    modal_settings_title: "Sozlamalar va PDF kalibrlash",
    setting_offset_title: "PDF sahifa surilishi",
    setting_offset_desc: "Agar brauzer sahifa raqamlari kitob sahifalariga to'g'ri kelmasa, sozlang (odatda 0, 1 yoki 2).",
    setting_reset_title: "O'zlashtirish va eslatmalarni tozalash",
    setting_reset_desc: "Barcha saqlangan eslatmalar, diktantlar va o'zlashtirish tarixini butunlay o'chirib yuborish.",
    btn_reset_data: "Ma'lumotlarni tozalash",
    btn_save_close: "Saqlash va yopish",
    dev_credit: "Jakhongir Toshpulatov tomonidan ishlab chiqilgan",
    coffee_desc: "Agar ushbu ilova sizga yoqqan bo'lsa, dasturchini qo'llab-quvvatlashni o'ylab ko'ring!",
    support_modal_title: "Dasturchini qo'llab-quvvatlash",
    support_desc: "Agar ushbu ilova sizga yoqqan bo'lsa, dasturchini qo'llab-quvvatlashingiz mumkin.",
    support_footer_note: "Karta orqali dasturchini qo'llab-quvvatlashingiz mumkin.",
    btn_copy_card: "Karta raqamini nusxalash",
    toast_card_copied: "Karta raqami nusxalandi!",
    btn_close: "Yopish",
    feedback_btn_text: "Fikr va xatoliklar",
    
    // Toast messages / Dialogs
    toast_progress_saved: "O'zlashtirish saqlandi!",
    toast_loop_a_set: "Takrorlash A nuqtasi o'rnatildi: ",
    toast_loop_b_error: "B nuqtasi A nuqtasidan keyin bo'lishi kerak!",
    toast_loop_started: "Takrorlash boshlandi: ",
    toast_notes_exported: "Eslatmalar muvaffaqiyatli eksport qilindi!",
    toast_progress_reset: "Barcha o'zlashtirish tarixi o'chirildi.",
    toast_settings_applied: "Sozlamalar saqlandi va qo'llanildi!",
    toast_pdf_scrolled: "PDF sahifasi aylantirildi: ",
    toast_dictation_saved: "Diktant matni saqlandi!",
    toast_notes_saved: "Lug'at va eslatmalar saqlandi!",
    toast_theme_switched: "O'tildi: ",
    toast_playing: "Ijro etilmoqda...",
    toast_paused: "To'xtatildi",
    toast_track_finished: "Trek tugadi. 2 soniyadan so'ng keyingi trekka o'tiladi...",
    confirm_clear_dictation: "Yozilgan diktant matnini tozalaysizmi?",
    confirm_reset_data: "Haqiqatan ham barcha o'rganish tarixini o'chirib tashlamoqchimisiz? Bu barcha yozilgan diktantlar, eslatmalar va natijalarni butunlay o'chirib yuboradi."
  }
};

// Application State
let state = {
  tracks: TRACKS,
  currentTrack: null,
  isPlaying: false,
  playbackSpeed: 1.0,
  pdfOffset: 0,
  abLoop: {
    start: null,
    end: null,
    active: false
  },
  progress: {}, // trackNum: { status, score, maxScore, answers: [], dictation: "", notes: "" }
  activeTab: 'tracks',
  volume: 0.8,
  language: 'en'
};

// Firebase Configuration for Streaming Audio & PDF
const USE_FIREBASE_STORAGE = false; // Set to false if you want to use local public/ folder files instead (e.g. on Netlify or Vercel)
const FIREBASE_BUCKET = "basic-ielts.firebasestorage.app";

function getFirebaseStorageUrl(localPath) {
  const cleanPath = localPath.replace(/^\.\//, '');
  const encodedPath = encodeURIComponent(cleanPath);
  return `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_BUCKET}/o/${encodedPath}?alt=media`;
}

// DOM Elements
const audio = document.getElementById('main-audio');
const playPauseBtn = document.getElementById('player-play-pause');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const forwardBtn = document.getElementById('player-forward');
const backwardBtn = document.getElementById('player-backward');
const prevBtn = document.querySelector('[title="Previous Track"]');
const nextBtn = document.querySelector('[title="Next Track"]');
const progressSlider = document.getElementById('progress-slider');
const progressFill = document.getElementById('progress-fill');
const progressThumb = document.getElementById('progress-thumb');
const abIndicator = document.getElementById('ab-indicator');
const currentTimeDisplay = document.getElementById('player-time-current');
const totalTimeDisplay = document.getElementById('player-time-total');
const playerTrackTitle = document.getElementById('player-track-title');
const playerTrackSubtitle = document.getElementById('player-track-subtitle');
const btnSpeedSelect = document.getElementById('btn-speed-select');
const speedDropdown = document.getElementById('speed-dropdown');
const btnAbLoop = document.getElementById('btn-ab-loop');
const abLoopText = document.getElementById('ab-loop-text');
const volumeSlider = document.getElementById('volume-slider');
const pdfFrame = document.getElementById('pdf-frame');
const toastElement = document.getElementById('toast-message');
const toastText = document.getElementById('toast-text');

// Settings Modal
const settingsModal = document.getElementById('settings-modal');
const settingsToggle = document.getElementById('settings-toggle');
const btnCloseSettings = document.getElementById('btn-close-settings');
const settingOffset = document.getElementById('setting-offset');
const btnResetData = document.getElementById('btn-reset-data');

// Support Modal
const supportModal = document.getElementById('support-modal');
const btnCloseSupport = document.getElementById('btn-close-support');

// Themes
const themeToggle = document.getElementById('theme-toggle');

// Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.pane-panel');

// Search and Playlist
const playlistContainer = document.getElementById('playlist-container');
const trackSearch = document.getElementById('track-search');
const trackFilter = document.getElementById('track-filter');

// Language Selector Elements
const langToggle = document.getElementById('lang-toggle');
const langCurrentLabel = document.getElementById('lang-current-label');
const langDropdown = document.getElementById('lang-dropdown');



// Dictation Elements
const dictationTrackTitle = document.getElementById('dictation-track-title');
const dictationText = document.getElementById('dictation-text');
const btnSaveDictation = document.getElementById('btn-save-dictation');
const btnClearDictation = document.getElementById('btn-clear-dictation');
const dictationWordCount = document.getElementById('dictation-word-count');
const dictationCharCount = document.getElementById('dictation-char-count');

// Notebook Elements
const notesText = document.getElementById('notes-text');
const btnSaveNotes = document.getElementById('btn-save-notes');
const btnExportNotes = document.getElementById('btn-export-notes');

// Translation Helpers
function t(key) {
  return TRANSLATIONS[state.language][key] || key;
}

function getLocalizedUnitName(unitNum) {
  return t(`unit_${unitNum}_name`);
}

function updateLanguageUI() {
  langCurrentLabel.textContent = state.language.toUpperCase();
  
  document.querySelectorAll('.lang-option').forEach(opt => {
    if (opt.dataset.lang === state.language) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const translation = t(key);
    if (translation) {
      el.textContent = translation;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const translation = t(key);
    if (translation) {
      el.placeholder = translation;
    }
  });

  if (state.currentTrack) {
    dictationTrackTitle.textContent = `${t('track_label')} ${state.currentTrack.trackNum.toString().padStart(2, '0')} ${t('dictation_pad_title').replace(':', '')}`;
    playerTrackTitle.textContent = `${t('track_label')} ${state.currentTrack.trackNum.toString().padStart(2, '0')}`;
    playerTrackSubtitle.textContent = state.currentTrack.title.split(' - ')[1] || getLocalizedUnitName(state.currentTrack.unit);
  } else {
    playerTrackTitle.textContent = t('player_select_track');
  }

  // Update Loop button state text on language change
  if (abLoopText) {
    if (state.abLoop.active) {
      abLoopText.textContent = t('btn_clear') || "Clear";
    } else if (state.abLoop.start !== null) {
      abLoopText.textContent = state.language === 'en' ? "Point B" : "B Nuqtasi";
    } else {
      abLoopText.textContent = "A-B";
    }
  }
}

// Initialize App
function init() {
  loadLocalStorage();
  setupEventListeners();
  renderPlaylist();
  updateStatsDashboard();
  selectTrack(state.tracks[0], false); // Load first track but don't autoplay
  applyTheme();
}

// Local Storage Handlers
function loadLocalStorage() {
  const savedProgress = localStorage.getItem('ielts_listening_progress');
  if (savedProgress) {
    state.progress = JSON.parse(savedProgress);
  }
  
  const savedOffset = localStorage.getItem('ielts_pdf_offset');
  if (savedOffset) {
    state.pdfOffset = parseInt(savedOffset, 10);
    settingOffset.value = state.pdfOffset;
  }

  const savedTheme = localStorage.getItem('ielts_theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  const savedVolume = localStorage.getItem('ielts_volume');
  if (savedVolume) {
    state.volume = parseFloat(savedVolume);
    volumeSlider.value = state.volume;
    audio.volume = state.volume;
  }

  const savedLang = localStorage.getItem('ielts_lang');
  if (savedLang) {
    state.language = savedLang;
  } else {
    state.language = 'en';
  }
  updateLanguageUI();
}

function saveProgress(reRenderPlaylist = true) {
  localStorage.setItem('ielts_listening_progress', JSON.stringify(state.progress));
  updateStatsDashboard();
  if (reRenderPlaylist) {
    renderPlaylist();
  }
}

// Toast Notifications
function showToast(message, type = 'cyan') {
  toastText.textContent = message;
  toastElement.className = `toast toast-${type} active`;
  
  setTimeout(() => {
    toastElement.classList.remove('active');
  }, 2500);
}

// Render Playlist
function renderPlaylist() {
  playlistContainer.innerHTML = '';
  
  const searchVal = trackSearch.value.toLowerCase();
  const filterVal = trackFilter.value;
  
  // Group tracks by Unit number
  const units = {};
  state.tracks.forEach(track => {
    // Search filter
    const matchesSearch = 
      track.title.toLowerCase().includes(searchVal) || 
      t(`unit_${track.unit}_name`).toLowerCase().includes(searchVal) ||
      (state.progress[track.trackNum]?.notes || "").toLowerCase().includes(searchVal);
      
    // Status filter
    const status = state.progress[track.trackNum]?.status || 'unattempted';
    const matchesFilter = filterVal === 'all' || status === filterVal;
    
    if (matchesSearch && matchesFilter) {
      if (!units[track.unit]) {
        units[track.unit] = [];
      }
      units[track.unit].push(track);
    }
  });

  const unitKeys = Object.keys(units).sort((a, b) => parseInt(a) - parseInt(b));
  if (unitKeys.length === 0) {
    playlistContainer.innerHTML = `<div style="text-align:center; padding:32px; color:var(--text-muted)">${t('no_tracks_found')}</div>`;
    return;
  }

  unitKeys.forEach(unitNum => {
    const unitTracks = units[unitNum];
    const unitDiv = document.createElement('div');
    unitDiv.className = 'unit-group';
    
    const unitTitle = document.createElement('h3');
    unitTitle.className = 'unit-group-title';
    unitTitle.innerHTML = `
      <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:currentColor;"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
      ${t('unit_title')} ${unitNum}: ${getLocalizedUnitName(unitNum)} (${unitTracks.length})
    `;
    unitDiv.appendChild(unitTitle);
    
    const gridDiv = document.createElement('div');
    gridDiv.className = 'tracks-grid';
    
    unitTracks.forEach(track => {
      const trackProgress = state.progress[track.trackNum] || {};
      const status = trackProgress.status || 'unattempted';
      
      const card = document.createElement('div');
      card.className = `track-item-card ${status}`;
      card.setAttribute('data-track-id', track.id);
      const isActive = state.currentTrack && state.currentTrack.id === track.id;
      if (isActive) {
        card.classList.add('active');
      }
      
      const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
      };

      const isCurrentPlaying = isActive && state.isPlaying;
      const badgeSVG = isCurrentPlaying 
        ? `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>` // Pause SVG
        : `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`; // Play SVG

      card.innerHTML = `
        <div class="track-card-left">
          <div class="track-play-badge">
            ${badgeSVG}
          </div>
          <div class="track-info-meta">
            <div class="track-card-title">${t('track_label')} ${track.trackNum.toString().padStart(2, '0')}</div>
            <div class="track-card-sub">
              <span>${track.title.split(' - ')[1] || 'Exercise'}</span>
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span class="track-duration-badge">${formatTime(track.duration)}</span>
          <div class="track-status-indicator"></div>
        </div>
      `;
      
      card.addEventListener('click', () => selectTrack(track));
      gridDiv.appendChild(card);
    });
    
    unitDiv.appendChild(gridDiv);
    playlistContainer.appendChild(unitDiv);
  });
}

// Select Audio Track
function selectTrack(track, autoplay = true) {
  const isSameTrack = state.currentTrack && state.currentTrack.id === track.id;
  if (isSameTrack) {
    if (autoplay) {
      togglePlay();
    }
    return;
  }

  state.currentTrack = track;
  audio.src = USE_FIREBASE_STORAGE ? getFirebaseStorageUrl(track.path) : track.path;
  audio.load();
  
  // Update Player UI info
  playerTrackTitle.textContent = `${t('track_label')} ${track.trackNum.toString().padStart(2, '0')}`;
  playerTrackSubtitle.textContent = track.title.split(' - ')[1] || getLocalizedUnitName(track.unit);
  dictationTrackTitle.textContent = `${t('track_label')} ${track.trackNum.toString().padStart(2, '0')} ${t('dictation_pad_title').replace(':', '')}`;

  // Highlight active card directly in DOM to preserve scroll position
  document.querySelectorAll('.track-item-card').forEach(card => {
    if (parseInt(card.getAttribute('data-track-id'), 10) === track.id) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
  updatePlaylistPlayState();
  
  // Clear A-B Loop
  clearAbLoop();

  // Load saved content for this track
  const trackProgress = state.progress[track.trackNum] || {};
  
  // Load Dictation Text
  dictationText.value = trackProgress.dictation || "";
  updateTextCounts();
  
  // Load Notes
  notesText.value = trackProgress.notes || "";
  
  // Set tab status (in-place status update to avoid scroll jump)
  if (!state.progress[track.trackNum]) {
    state.progress[track.trackNum] = {
      status: 'in-progress',
      dictation: "",
      notes: ""
    };
    localStorage.setItem('ielts_listening_progress', JSON.stringify(state.progress));
    updateStatsDashboard();
    
    const card = document.querySelector(`.track-item-card[data-track-id="${track.id}"]`);
    if (card) {
      card.classList.remove('unattempted');
      card.classList.add('in-progress');
    }
  }

  // Update PDF Viewer to the exercise page
  syncPdfViewer(track.bookPage);

  if (autoplay) {
    playAudio();
  } else {
    pauseAudio();
  }
}

// Sync PDF IFrame
function syncPdfViewer(pageNum) {
  const adjustedPage = pageNum + state.pdfOffset;
  if (USE_FIREBASE_STORAGE) {
    const baseUrl = getFirebaseStorageUrl('basic-ielts-listening.pdf');
    pdfFrame.src = `${baseUrl}&p=${adjustedPage}#page=${adjustedPage}`;
  } else {
    // Append a query param ?p=N to force the iframe to reload and scroll to #page=N
    pdfFrame.src = `./basic-ielts-listening.pdf?p=${adjustedPage}#page=${adjustedPage}`;
  }
}

// Update Play/Pause Icons in Playlist
function updatePlaylistPlayState() {
  document.querySelectorAll('.track-item-card').forEach(card => {
    const isCardActive = card.classList.contains('active');
    const badge = card.querySelector('.track-play-badge');
    if (badge) {
      if (isCardActive && state.isPlaying) {
        badge.innerHTML = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`; // Pause icon
      } else {
        badge.innerHTML = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`; // Play icon
      }
    }
  });
}

// Audio Player Control
function playAudio() {
  audio.playbackRate = state.playbackSpeed;
  audio.play()
    .catch(err => {
      console.log("Audio play error (likely interaction policy):", err);
      pauseAudio();
    });
}

function pauseAudio() {
  audio.pause();
  state.isPlaying = false;
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';
  playPauseBtn.title = "Play Audio";
  updatePlaylistPlayState();
}

function togglePlay() {
  if (state.isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

function seekAudio(seconds) {
  audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
}

// A-B Loop Logic
function handleAbLoop() {
  if (!state.currentTrack) return;
  
  const curTime = audio.currentTime;
  
  // State 1: Nothing set yet
  if (state.abLoop.start === null) {
    state.abLoop.start = curTime;
    abLoopText.textContent = state.language === 'en' ? "Point B" : "B Nuqtasi";
    btnAbLoop.className = "btn-ab-loop active-set";
    showToast(t('toast_loop_a_set') + formatTime(curTime), "violet");
  } 
  // State 2: Point A set, setting Point B
  else if (state.abLoop.end === null) {
    if (curTime <= state.abLoop.start) {
      showToast(t('toast_loop_b_error'), "danger");
      return;
    }
    state.abLoop.end = curTime;
    state.abLoop.active = true;
    abLoopText.textContent = t('btn_clear') || "Clear";
    btnAbLoop.className = "btn-ab-loop active-loop";
    showToast(t('toast_loop_started') + formatTime(state.abLoop.start) + " - " + formatTime(state.abLoop.end), "cyan");
    
    // Position the loop visualizer element on the progress slider
    updateAbLoopIndicator();
  } 
  // State 3: Active loop, clicking clears it
  else {
    clearAbLoop();
  }
}

function clearAbLoop() {
  state.abLoop.start = null;
  state.abLoop.end = null;
  state.abLoop.active = false;
  abLoopText.textContent = "A-B";
  btnAbLoop.className = "btn-ab-loop";
  abIndicator.style.display = 'none';
}

function updateAbLoopIndicator() {
  if (!state.abLoop.active || !audio.duration) {
    abIndicator.style.display = 'none';
    return;
  }
  const pctStart = (state.abLoop.start / audio.duration) * 100;
  const pctEnd = (state.abLoop.end / audio.duration) * 100;
  
  abIndicator.style.left = `${pctStart}%`;
  abIndicator.style.width = `${pctEnd - pctStart}%`;
  abIndicator.style.display = 'block';
}

// Time Formatting
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Update Player UI progress
function updatePlayerProgress() {
  const cur = audio.currentTime;
  const dur = audio.duration || 0;
  
  currentTimeDisplay.textContent = formatTime(cur);
  totalTimeDisplay.textContent = formatTime(dur);
  
  if (dur > 0) {
    const pct = (cur / dur) * 100;
    progressFill.style.width = `${pct}%`;
    progressThumb.style.left = `${pct}%`;
  }
  
  // A-B loop boundary enforcement
  if (state.abLoop.active && cur >= state.abLoop.end) {
    audio.currentTime = state.abLoop.start;
  }
}



// Dictation Word / Char counting
function updateTextCounts() {
  const text = dictationText.value.trim();
  const chars = text.length;
  const words = text ? text.split(/\s+/).length : 0;
  
  dictationWordCount.textContent = words;
  dictationCharCount.textContent = chars;
}

// Export Notes
function exportNotes() {
  let output = `=== ${t('logo_title').toUpperCase()} STUDY NOTES ===\n\n`;
  
  state.tracks.forEach(track => {
    const p = state.progress[track.trackNum];
    if (p && (p.notes || p.dictation)) {
      output += `--------------------------------------------------\n`;
      output += `${t('unit_title').toUpperCase()} ${track.unit}: ${getLocalizedUnitName(track.unit)}\n`;
      output += `${track.title}\n`;
      output += `--------------------------------------------------\n`;
      
      if (p.notes) {
        output += `[${t('notebook_title')}]:\n${p.notes}\n\n`;
      }
      if (p.dictation) {
        output += `[${t('dictation_pad_title').replace(':', '')}]:\n${p.dictation}\n\n`;
      }
      output += `\n`;
    }
  });

  const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${state.language === 'en' ? 'ielts_listening_notes' : 'ielts_tinglash_eslatmalari'}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(t('toast_notes_exported'), "success");
}

// Theme Handling
function applyTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'light') {
    themeToggle.innerHTML = `
      <svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:currentColor">
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.01c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
      </svg>
    `;
  } else {
    themeToggle.innerHTML = `
      <svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:currentColor">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
      </svg>
    `;
  }
}

// Log stats session trigger (for weekly activity tracking)
function logStatsSession() {
  const today = new Date();
  const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday...
  
  let statsWeekly = localStorage.getItem('ielts_weekly_sessions');
  let data = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
  
  if (statsWeekly) {
    data = JSON.parse(statsWeekly);
  }
  
  // Map JS dayIndex (0=Sun, 1=Mon...) to Chart index (0=Mon, 1=Tue... 6=Sun)
  let chartIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  data[chartIndex] = (data[chartIndex] || 0) + 1;
  
  localStorage.setItem('ielts_weekly_sessions', JSON.stringify(data));
  updateStatsDashboard();
}

// Update Stats Dashboard (Header Progress)
function updateStatsDashboard() {
  let completedCount = 0;
  
  state.tracks.forEach(t => {
    const p = state.progress[t.trackNum];
    if (p) {
      if (p.status === 'completed') {
        completedCount++;
      }
    }
  });
  
  const totalTracks = state.tracks.length;
  
  // Header simple tracker
  const headerPct = document.getElementById('header-progress-pct');
  if (headerPct) {
    headerPct.textContent = `${Math.round((completedCount / totalTracks) * 100)}%`;
  }
}

// Reset Local data
function resetLocalData() {
  if (confirm(t('confirm_reset_data'))) {
    localStorage.removeItem('ielts_listening_progress');
    localStorage.removeItem('ielts_weekly_sessions');
    state.progress = {};
    saveProgress();
    selectTrack(state.tracks[0], false);
    showToast(t('toast_progress_reset'), "danger");
    settingsModal.classList.remove('active');
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Play/Pause Audio click
  playPauseBtn.addEventListener('click', togglePlay);
  
  // Jump controls
  forwardBtn.addEventListener('click', () => seekAudio(5));
  backwardBtn.addEventListener('click', () => seekAudio(-5));
  
  prevBtn.addEventListener('click', () => {
    if (!state.currentTrack) return;
    const curIdx = state.tracks.findIndex(t => t.id === state.currentTrack.id);
    if (curIdx > 0) {
      selectTrack(state.tracks[curIdx - 1]);
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (!state.currentTrack) return;
    const curIdx = state.tracks.findIndex(t => t.id === state.currentTrack.id);
    if (curIdx < state.tracks.length - 1) {
      selectTrack(state.tracks[curIdx + 1]);
    }
  });

  // Audio state event listeners (handles play/pause automatically)
  audio.addEventListener('play', () => {
    state.isPlaying = true;
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    playPauseBtn.title = t('toast_paused');
    updatePlaylistPlayState();
    logStatsSession();
  });

  audio.addEventListener('pause', () => {
    state.isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    playPauseBtn.title = t('toast_playing');
    updatePlaylistPlayState();
  });

  // Track progress updating
  audio.addEventListener('timeupdate', updatePlayerProgress);
  audio.addEventListener('ended', () => {
    // Auto mark as completed when ended
    const trackNum = state.currentTrack.trackNum;
    if (state.progress[trackNum].status !== 'completed') {
      state.progress[trackNum].status = 'completed';
      saveProgress();
    }
    showToast(t('toast_track_finished'), "cyan");
    setTimeout(() => {
      nextBtn.click();
    }, 2000);
  });

  // Seek bar scrubber
  progressSlider.addEventListener('mousedown', (e) => {
    const rect = progressSlider.getBoundingClientRect();
    const seekHandler = (moveEvent) => {
      const x = Math.max(0, Math.min(rect.width, moveEvent.clientX - rect.left));
      const pct = x / rect.width;
      audio.currentTime = pct * (audio.duration || 0);
    };
    
    seekHandler(e);
    
    document.addEventListener('mousemove', seekHandler);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', seekHandler);
    }, { once: true });
  });

  // Volume Scrubber
  volumeSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    state.volume = vol;
    audio.volume = vol;
    localStorage.setItem('ielts_volume', vol);
  });

  // Playback Speed Selector
  btnSpeedSelect.addEventListener('click', (e) => {
    e.stopPropagation();
    speedDropdown.classList.toggle('active');
  });

  document.querySelectorAll('.speed-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const speed = parseFloat(opt.dataset.speed);
      state.playbackSpeed = speed;
      audio.playbackRate = speed;
      btnSpeedSelect.textContent = `${speed.toFixed(1)}x`;
      
      document.querySelectorAll('.speed-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      speedDropdown.classList.remove('active');
      
      const speedText = state.language === 'en' ? `Playback speed: ${speed}x` : `Ijro tezligi: ${speed}x`;
      showToast(speedText, "violet");
    });
  });

  document.addEventListener('click', () => {
    speedDropdown.classList.remove('active');
  });

  // A-B repeat toggle
  btnAbLoop.addEventListener('click', handleAbLoop);

  // Tab switching
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      state.activeTab = tab;
      
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`panel-${tab}`).classList.add('active');
      
      // Auto focus dictation area when tab loads
      if (tab === 'dictation') {
        setTimeout(() => dictationText.focus(), 100);
      }
    });
  });

  // Language switcher dropdown toggle
  langToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('active');
  });

  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.dataset.lang;
      state.language = lang;
      localStorage.setItem('ielts_lang', lang);
      updateLanguageUI();
      renderPlaylist();
      updateStatsDashboard();
      langDropdown.classList.remove('active');
      
      const langChangeText = state.language === 'en' ? "Language changed to English!" : "Til o'zbekchaga o'zgartirildi!";
      showToast(langChangeText, "cyan");
    });
  });

  document.addEventListener('click', () => {
    langDropdown.classList.remove('active');
  });

  // Settings Panel Toggles
  settingsToggle.addEventListener('click', () => {
    settingsModal.classList.add('active');
  });

  // Support button opens dedicated support modal
  const btnCoffeeHeader = document.getElementById('btn-coffee-header');
  if (btnCoffeeHeader) {
    btnCoffeeHeader.addEventListener('click', () => {
      supportModal.classList.add('active');
    });
  }

  // Close support modal
  if (btnCloseSupport) {
    btnCloseSupport.addEventListener('click', () => {
      supportModal.classList.remove('active');
    });
  }

  // Copy support card number
  const btnCopyCard = document.getElementById('btn-copy-card');
  if (btnCopyCard) {
    btnCopyCard.addEventListener('click', () => {
      const cardNum = "5614682207589229";
      navigator.clipboard.writeText(cardNum).then(() => {
        showToast(t('toast_card_copied'), "success");
      }).catch(err => {
        console.error("Failed to copy card: ", err);
      });
    });
  }

  btnCloseSettings.addEventListener('click', () => {
    const val = parseInt(settingOffset.value, 10);
    state.pdfOffset = isNaN(val) ? 0 : val;
    localStorage.setItem('ielts_pdf_offset', state.pdfOffset);
    settingsModal.classList.remove('active');
    showToast(t('toast_settings_applied'), "success");
    // Reload PDF with new offset
    if (state.currentTrack) {
      syncPdfViewer(state.currentTrack.bookPage);
    }
  });

  btnResetData.addEventListener('click', resetLocalData);

  // PDF page shortcuts
  document.querySelectorAll('.pdf-shortcut-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pg = parseInt(btn.dataset.page, 10);
      syncPdfViewer(pg);
      showToast(t('toast_pdf_scrolled') + (pg + state.pdfOffset), "cyan");
    });
  });

  // Dictation logic
  dictationText.addEventListener('input', () => {
    updateTextCounts();
    // Auto save text to state
    if (state.currentTrack) {
      state.progress[state.currentTrack.trackNum].dictation = dictationText.value;
      localStorage.setItem('ielts_listening_progress', JSON.stringify(state.progress));
    }
  });

  btnSaveDictation.addEventListener('click', () => {
    if (state.currentTrack) {
      state.progress[state.currentTrack.trackNum].dictation = dictationText.value;
      state.progress[state.currentTrack.trackNum].status = 'in-progress';
      saveProgress(false); // save without re-rendering playlist to preserve scroll
      showToast(t('toast_dictation_saved'), "success");
    }
  });

  btnClearDictation.addEventListener('click', () => {
    if (confirm(t('confirm_clear_dictation'))) {
      dictationText.value = '';
      updateTextCounts();
      if (state.currentTrack) {
        state.progress[state.currentTrack.trackNum].dictation = '';
        saveProgress(false); // save without re-rendering playlist to preserve scroll
      }
    }
  });

  // Notebook saving
  btnSaveNotes.addEventListener('click', () => {
    if (state.currentTrack) {
      state.progress[state.currentTrack.trackNum].notes = notesText.value;
      saveProgress(false); // save without re-rendering playlist to preserve scroll
      showToast(t('toast_notes_saved'), "success");
    }
  });

  btnExportNotes.addEventListener('click', exportNotes);

  // Filters and Search
  trackSearch.addEventListener('input', renderPlaylist);
  trackFilter.addEventListener('change', renderPlaylist);

  // Theme Toggle
  themeToggle.addEventListener('click', () => {
    const curTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = curTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ielts_theme', newTheme);
    applyTheme();
    
    const themeChangeText = state.language === 'en' 
      ? `Switched to ${newTheme} mode!` 
      : `${newTheme === 'dark' ? 'Tungi' : 'Kunduzgi'} rejimga o'tildi!`;
    showToast(themeChangeText, "cyan");
  });

  // Keyboard Shortcuts (Global listener)
  document.addEventListener('keydown', (e) => {
    // Esc play/pause shortcut (works even in textareas!)
    if (e.key === 'Escape') {
      e.preventDefault();
      togglePlay();
      showToast(state.isPlaying ? t('toast_playing') : t('toast_paused'), "cyan");
    }
    
    // In textarea dictation, capture Ctrl + Arrow keys
    if (document.activeElement === dictationText) {
      if (e.ctrlKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        seekAudio(-5);
        showToast(state.language === 'en' ? "Rewind 5s" : "5s orqaga", "violet");
      }
      if (e.ctrlKey && e.key === 'ArrowRight') {
        e.preventDefault();
        seekAudio(5);
        showToast(state.language === 'en' ? "Forward 5s" : "5s oldinga", "violet");
      }
    } else {
      // Global hotkeys when not typing in fields
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        if (e.key === ' ') {
          e.preventDefault();
          togglePlay();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          seekAudio(-5);
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          seekAudio(5);
        }
      }
    }
  });
}

// Run init
init();
