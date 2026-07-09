import { TRACKS } from './tracks.js';
import { logSessionStart, logTrackPlay, logNoteSave, logDictationSave } from './system.js';

const BOOKS = [
  {
    id: "basic-ielts",
    title: "Basic IELTS Listening",
    author: "Book by Li Ya Bin",
    pdfFile: "basic-ielts-listening.pdf",
    units: {
      1: "Names and Places",
      2: "Numbers",
      3: "Survival English",
      4: "Popular Science",
      5: "Academic English"
    },
    shortcuts: [
      { name: "Unit 1", page: 5 },
      { name: "Unit 2", page: 21 },
      { name: "Unit 3", page: 47 },
      { name: "Unit 4", page: 67 },
      { name: "Unit 5", page: 87 },
      { name: "Tapescripts", page: 115 },
      { name: "Answers", page: 175 }
    ]
  },
  {
    id: "listening-strategies",
    title: "Listening Strategies for the IELTS Test",
    author: "Book by Wang Chao Zhou & Li Ya Bin",
    pdfFile: "Listening Strategies for the IELTS Test.pdf",
    units: {
      1: "Letters and Numbers",
      2: "Form Filling & Table Completion",
      3: "Multiple Choice & Matching",
      4: "Note Completion & Diagrams",
      5: "Map & Flow Charts",
      6: "Summary Completion",
      7: "Practice Tests",
      8: "Simulated Tests"
    },
    shortcuts: [
      { name: "Unit 1", page: 11 },
      { name: "Unit 2", page: 29 },
      { name: "Unit 3", page: 43 },
      { name: "Unit 4", page: 63 },
      { name: "Unit 5", page: 85 },
      { name: "Unit 6", page: 101 },
      { name: "Unit 7", page: 115 },
      { name: "Tapescripts", page: 136 },
      { name: "Answers", page: 268 }
    ]
  },
  {
    id: "dracula",
    type: "audiobook",
    title: "Dracula",
    author: "Book by Bram Stoker",
    pdfFile: "",
    units: {
      1: "Dracula"
    },
    shortcuts: [],
    chapters: [
      { chapterNum: 1, title: "Chapter 1: Jonathan Harker's Journal", start: 0.0, end: 761.85 },
      { chapterNum: 2, title: "Chapter 2: Castle Dracula", start: 761.85, end: 1691.98 },
      { chapterNum: 3, title: "Chapter 3: The Three Sisters", start: 1691.98, end: 2294.74 },
      { chapterNum: 4, title: "Chapter 4: The Escape Attempt", start: 2294.74, end: 3328.85 },
      { chapterNum: 5, title: "Chapter 5: Mina Murray's Journal", start: 3328.85, end: 4399.36 }
    ]
  }
];

const TRANSLATIONS = {
  en: {
    logo_title: "FluentEar",
    logo_subtitle: "IELTS listening practice",
    landing_kicker: "IELTS listening practice suite",
    landing_title: "Basic IELTS Listening",
    landing_author: "Book by Li Ya Bin",
    landing_subtitle: "Study with the book, stream every track, write dictation, and save your progress in one focused workspace.",
    landing_disclaimer: "Attention: For statistical purposes, your entry data is collected, including your device name and type.",
    landing_start: "Start practice",
    landing_preview: "View workspace",
    install_app: "Install app",
    install_ready: "FluentEar is ready to install on this device.",
    install_unavailable: "Use your browser menu and choose Install or Add to Home Screen.",
    install_done: "FluentEar installed.",
    install_dismissed: "Install was cancelled.",
    landing_stat_tracks: "audio tracks",
    landing_stat_units: "study units",
    landing_stat_loop: "repeat loop",
    tutorial_title: "How to use this app",
    tutorial_step_1_title: "Choose a track",
    tutorial_step_1_desc: "Open the Tracks tab and click any audio. The PDF will stay where you scroll it.",
    tutorial_step_2_title: "Control listening",
    tutorial_step_2_desc: "Use play, previous, next, 5-second rewind, speed, volume, and A-B repeat from the bottom player.",
    tutorial_step_3_title: "Use the book freely",
    tutorial_step_3_desc: "Scroll the PDF by yourself. Unit and answer buttons above the PDF are optional shortcuts.",
    tutorial_step_4_title: "Practice actively",
    tutorial_step_4_desc: "Write what you hear in Dictation, save vocabulary in Notebook, and your progress will be remembered.",
    tutorial_shortcut_seek: "Seek 5s",
    tutorial_got_it: "Got it",
    tutorial_back: "Back",
    tutorial_next: "Next",
    tutorial_finish: "Finish",
    header_progress: "Progress:",
    tab_tracks: "Tracks",
    tab_dictation: "Dictation",
    tab_notes: "Notebook",
    tab_analytics: "Analytics",
    workspace_ielts: "IELTS Practice",
    workspace_audiobooks: "Audiobooks",
    ab_now_playing: "Now Playing",
    ab_study_fab: "Dictation / Notes",
    ab_chapters_title: "Chapters",
    menu_language: "Language",
    menu_stats: "Usage Statistics",
    menu_tutorial: "Guide",
    menu_install: "Install App",
    menu_support: "Support Developer",
    menu_settings: "Settings & Calibration",
    
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

    // Book translations
    book_basic_ielts: "Basic IELTS Listening",
    book_listening_strategies: "Listening Strategies",
    book_dracula: "Dracula (Audiobook)",
    strategies_unit_1_name: "Letters and Numbers",
    strategies_unit_2_name: "Form Filling & Table Completion",
    strategies_unit_3_name: "Multiple Choice & Matching",
    strategies_unit_4_name: "Note Completion & Diagrams",
    strategies_unit_5_name: "Map & Flow Charts",
    strategies_unit_6_name: "Summary Completion",
    strategies_unit_7_name: "Practice Tests",
    strategies_unit_8_name: "Simulated Tests",
    
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
    setting_nickname_title: "Device Nickname",
    setting_nickname_desc: "Automatically generated unique nickname for this device (Read-only).",
    setting_visits_title: "Visit Count",
    setting_visits_desc: "Total number of times this device accessed the app.",
    setting_offset_title: "PDF Page Offset",
    setting_offset_desc: "Adjust this if the browser page numbers do not align with the physical book pages (typically 0, 1, or 2).",
    setting_reset_title: "Reset Progress & Notes",
    setting_reset_desc: "Permanently delete all saved notes, scores, and track progress history.",
    btn_reset_data: "Reset Data",
    btn_save_close: "Save & Close",
    dev_credit: "Created by Jaxongir Toshpo'latov",
    coffee_desc: "If you find this application helpful, consider supporting the developer!",
    support_modal_title: "Support Developer",
    support_desc: "If you find this application helpful, you can support the developer.",
    support_footer_note: "You can support the developer through this card.",
    modal_public_stats_title: "Usage Statistics",
    stats_unique_devices: "Unique Devices",
    stats_total_visits: "Total Visits",
    stats_monthly_active: "Monthly Active Users",
    about_app_title: "About FluentEar",
    about_app_desc: "FluentEar is a focused practice tool for IELTS Listening. It combines the PDF book, audio tracks, audiobooks, dictation, notes, progress saving, and a guided tour in one browser app.",
    about_app_book_label: "Book",
    about_app_dev_label: "Developer",
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
    logo_title: "FluentEar",
    logo_subtitle: "IELTS listening mashq ilovasi",
    landing_kicker: "IELTS listening mashq to'plami",
    landing_title: "Basic IELTS Listening",
    landing_author: "Kitob muallifi: Li Ya Bin",
    landing_subtitle: "Kitob bilan ishlang, barcha treklarni tinglang, diktant yozing va natijangizni bitta qulay oynada saqlang.",
    landing_disclaimer: "Diqqat: Statistik tahlil maqsadida sizning kirish ma'lumotlaringiz yig'iladi (shu jumladan qurilma nomi va turi).",
    landing_start: "Mashqni boshlash",
    landing_preview: "Ish oynasini ko'rish",
    landing_install: "Ilovani o'rnatish",
    install_app: "Ilovani o'rnatish",
    install_ready: "FluentEar'ni qurilmangizga o'rnatishingiz mumkin.",
    install_unavailable: "Brauzer menyusidan Install yoki Add to Home Screen ni tanlang.",
    install_done: "FluentEar o'rnatildi.",
    install_dismissed: "O'rnatish bekor qilindi.",
    landing_stat_tracks: "audio trek",
    landing_stat_units: "o'quv bo'lim",
    landing_stat_loop: "takrorlash",
    tutorial_title: "Ilovadan qanday foydalaniladi",
    tutorial_step_1_title: "Trek tanlang",
    tutorial_step_1_desc: "Treklar bo'limidan istalgan audioni bosing. PDF esa siz scroll qilgan joyida qoladi.",
    tutorial_step_2_title: "Tinglashni boshqaring",
    tutorial_step_2_desc: "Pastdagi pleyerdan play, oldingi/keyingi trek, 5 soniya orqaga, tezlik, ovoz va A-B takrorlashni ishlating.",
    tutorial_step_3_title: "Kitobdan erkin foydalaning",
    tutorial_step_3_desc: "PDFni o'zingiz scroll qiling. Yuqoridagi bo'lim va javob tugmalari faqat tez o'tish uchun.",
    tutorial_step_4_title: "Faol mashq qiling",
    tutorial_step_4_desc: "Eshitganingizni Diktantga yozing, so'zlarni Daftarga saqlang va progress eslab qolinadi.",
    tutorial_shortcut_seek: "5s surish",
    tutorial_got_it: "Tushunarli",
    tutorial_back: "Orqaga",
    tutorial_next: "Keyingi",
    tutorial_finish: "Tugatish",
    header_progress: "O'zlashtirish:",
    tab_tracks: "Treklar",
    tab_dictation: "Diktant",
    tab_notes: "Daftar",
    tab_analytics: "Analitika",
    workspace_ielts: "IELTS Amaliyot",
    workspace_audiobooks: "Audiokitoblar",
    ab_now_playing: "Hozir ijro etilmoqda",
    ab_study_fab: "Diktant / Daftar",
    ab_chapters_title: "Boblar",
    menu_language: "Til",
    menu_stats: "Foydalanish statistikasi",
    menu_tutorial: "Qo'llanma",
    menu_install: "Ilovani o'rnatish",
    menu_support: "Dasturchi qo'llab-quvvatlash",
    menu_settings: "Sozlamalar va kalibrlash",
    
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

    // Book translations
    book_basic_ielts: "Basic IELTS Listening",
    book_listening_strategies: "Listening Strategies",
    book_dracula: "Dracula (Audiokitob)",
    strategies_unit_1_name: "Harflar va sonlar",
    strategies_unit_2_name: "Shakllarni to'ldirish va jadval to'ldirish",
    strategies_unit_3_name: "Ko'p tanlovli savollar va moslashtirish",
    strategies_unit_4_name: "Konspekt to'ldirish va diagrammalar",
    strategies_unit_5_name: "Xarita va jarayon sxemalari",
    strategies_unit_6_name: "Xulosa to'ldirish",
    strategies_unit_7_name: "Amaliy testlar",
    strategies_unit_8_name: "Imtihon simulyatsiyasi",
    
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
    setting_nickname_title: "Qurilma laqabi",
    setting_nickname_desc: "Ushbu qurilma uchun avtomatik tayinlangan unikal laqab (Faqat o'qish uchun).",
    setting_visits_title: "Kirishlar soni",
    setting_visits_desc: "Ushbu qurilmadan ilovaga kirishlar umumiy soni.",
    setting_offset_title: "PDF sahifa surilishi",
    setting_offset_desc: "Agar brauzer sahifa raqamlari kitob sahifalariga to'g'ri kelmasa, sozlang (odatda 0, 1 yoki 2).",
    setting_reset_title: "O'zlashtirish va eslatmalarni tozalash",
    setting_reset_desc: "Barcha saqlangan eslatmalar, diktantlar va o'zlashtirish tarixini butunlay o'chirib yuborish.",
    btn_reset_data: "Ma'lumotlarni tozalash",
    btn_save_close: "Saqlash va yopish",
    dev_credit: "Jaxongir Toshpo'latov tomonidan yaratilgan",
    coffee_desc: "Agar ushbu ilova sizga yoqqan bo'lsa, dasturchini qo'llab-quvvatlashni o'ylab ko'ring!",
    support_modal_title: "Dasturchini qo'llab-quvvatlash",
    support_desc: "Agar ushbu ilova sizga yoqqan bo'lsa, dasturchini qo'llab-quvvatlashingiz mumkin.",
    support_footer_note: "Karta orqali dasturchini qo'llab-quvvatlashingiz mumkin.",
    modal_public_stats_title: "Foydalanish statistikasi",
    stats_unique_devices: "Unikal qurilmalar",
    stats_total_visits: "Umumiy kirishlar",
    stats_monthly_active: "Oylik faol foydalanuvchilar",
    about_app_title: "FluentEar haqida",
    about_app_desc: "FluentEar IELTS Listening uchun yaratilgan qulay mashq vositasi. Unda PDF kitob, audio treklar, audiokitoblar, diktant, eslatmalar va progress saqlash bir brauzer ilovasida jamlangan.",
    about_app_book_label: "Kitob",
    about_app_dev_label: "Dasturchi",
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
  activeBookId: "basic-ielts",
  activeBook: null,
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
  language: 'uz',
  
  // Dedicated Audiobook Workspace State
  activeWorkspace: "ielts", // "ielts" or "audiobooks"
  audiobookState: {
    isPlaying: false,
    playbackSpeed: 1.0,
    abLoop: {
      start: null,
      end: null,
      active: false
    },
    progress: {} // chapterProgress: { 'chapter_1': { status, dictation, notes } }
  }
};

let activeTourStep = 0;
let highlightedTourElement = null;
let deferredInstallPrompt = null;
let lastLoggedTrackNum = null;

// Media files are served from the public Vercel Blob store.
const DEFAULT_MEDIA_BASE_URL = 'https://3rdqnprfkrc5djuh.public.blob.vercel-storage.com';
const MEDIA_BASE_URL = (
  import.meta.env.VITE_MEDIA_BASE_URL || DEFAULT_MEDIA_BASE_URL
).replace(/\/$/, '');
const AB_AUDIO_URL = `${DEFAULT_MEDIA_BASE_URL}/audio-books/Dracula%20-%20Bram%20Stoker.mp3`;

function encodeMediaFilename(localPath) {
  const parts = localPath.split('/');
  const file = parts.pop();
  const folder = parts.join('/');
  const encodedFile = encodeURIComponent(file);
  return folder ? `${folder}/${encodedFile}` : encodedFile;
}

function getMediaUrl(localPath) {
  const cleanPath = localPath.replace(/^\.\//, '');
  if (!MEDIA_BASE_URL) {
    return `./${encodeMediaFilename(cleanPath)}`;
  }

  const encodedPath = encodeMediaFilename(cleanPath);
  const filename = encodedPath.split('/').pop();

  if (cleanPath.includes('audio-strategies') || (state.activeBookId === 'listening-strategies')) {
    return `${MEDIA_BASE_URL}/audio-strategies/${filename}`;
  }

  if (cleanPath.includes('audio-books') || (state.activeBookId === 'dracula')) {
    return `${MEDIA_BASE_URL}/audio-books/${filename}`;
  }

  return `${MEDIA_BASE_URL}/audio/${filename}`;
}

function withQueryParam(url, key, value) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
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
const pdfPane = document.getElementById('pdf-pane');
const controlPane = document.querySelector('.control-pane');
// Workspace Switching selectors
const workspaceSwitcher = document.getElementById('workspace-switcher');
const mainWorkspace = document.querySelector('.main-workspace');
const audiobookWorkspace = document.getElementById('audiobook-workspace');
const ieltsBookSelectWrapper = document.getElementById('ielts-book-select-wrapper');
const audiobookSelectWrapper = document.getElementById('audiobook-select-wrapper');

// Dedicated Audiobook player elements
const abAudio = document.getElementById('audiobook-audio');
const abTimeCurrent = document.getElementById('ab-time-current');
const abTimeTotal = document.getElementById('ab-time-total');
const abProgressSlider = document.getElementById('ab-progress-slider');
const abProgressFill = document.getElementById('ab-progress-fill');
const abProgressThumb = document.getElementById('ab-progress-thumb');
const abLoopIndicator = document.getElementById('ab-loop-indicator');
const abMinuteJumpsRow = document.getElementById('ab-minute-jumps-row');
const abBtnPlayPause = document.getElementById('ab-btn-play-pause');
const abPlayIcon = document.getElementById('ab-play-icon');
const abPauseIcon = document.getElementById('ab-pause-icon');
const abBtnBackward15s = document.getElementById('ab-btn-backward-15s');
const abBtnForward15s = document.getElementById('ab-btn-forward-15s');
const abBtnPrevChapter = document.getElementById('ab-btn-prev-chapter');
const abBtnNextChapter = document.getElementById('ab-btn-next-chapter');
const abBtnLoop = document.getElementById('ab-btn-loop');
const abLoopLabel = document.getElementById('ab-loop-label');
const abBtnSpeed = document.getElementById('ab-btn-speed');
const abSpeedDropdown = document.getElementById('ab-speed-dropdown');
const abChaptersList = document.getElementById('audiobook-chapters-list');
const abNowTitle = document.getElementById('ab-now-title');
const abNowChapter = document.getElementById('ab-now-chapter');
const abNowAuthor = document.getElementById('ab-now-author');
const abSegmentNav = document.getElementById('ab-segmented-nav');
const abSegmentIndicator = document.getElementById('ab-segment-indicator');
const abMusicShell = document.getElementById('ab-music-shell');
const abStudyPanel = document.getElementById('ab-study-panel');
const abPlayerStack = document.getElementById('ab-player-stack');
const abStudyFab = document.getElementById('ab-study-fab');
const abStudyClose = document.getElementById('ab-study-close');

// Audiobook study tool elements
const abDictationText = document.getElementById('ab-dictation-text');
const abNotesText = document.getElementById('ab-notes-text');
const abDictWords = document.getElementById('ab-dict-words');
const abDictChars = document.getElementById('ab-dict-chars');
const abBtnSaveDictation = document.getElementById('ab-btn-save-dictation');
const abBtnSaveNotes = document.getElementById('ab-btn-save-notes');
const abBtnExportNotes = document.getElementById('ab-btn-export-notes');

function isAbMobileStudyLayout() {
  return window.matchMedia('(max-width: 768px)').matches;
}

function updateAbSegmentIndicator(activeBtn) {
  if (!abSegmentIndicator || !activeBtn || !abSegmentNav) return;
  const navRect = abSegmentNav.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  abSegmentIndicator.style.width = `${btnRect.width}px`;
  abSegmentIndicator.style.transform = `translateX(${btnRect.left - navRect.left - 4}px)`;
}

function syncAbStudyOverlayBounds() {
  if (!abMusicShell || !abPlayerStack || !isAbMobileStudyLayout()) return;
  abMusicShell.style.setProperty('--ab-player-stack-h', `${abPlayerStack.offsetHeight}px`);
}

function openAbStudyOverlay() {
  if (!isAbMobileStudyLayout() || !abStudyPanel || !abMusicShell) return;
  syncAbStudyOverlayBounds();
  abStudyPanel.classList.add('open');
  abStudyPanel.setAttribute('aria-hidden', 'false');
  abMusicShell.classList.add('study-open');
  if (abStudyFab) abStudyFab.setAttribute('aria-expanded', 'true');
  const activeSegment = document.querySelector('.ab-segment-btn.active');
  requestAnimationFrame(() => {
    if (activeSegment) updateAbSegmentIndicator(activeSegment);
    const activePanel = document.querySelector('.ab-tool-panel.active textarea');
    if (activePanel) activePanel.focus();
  });
}

function closeAbStudyOverlay() {
  if (!abStudyPanel || !abMusicShell) return;
  abStudyPanel.classList.remove('open');
  if (isAbMobileStudyLayout()) {
    abStudyPanel.setAttribute('aria-hidden', 'true');
  }
  abMusicShell.classList.remove('study-open');
  if (abStudyFab) abStudyFab.setAttribute('aria-expanded', 'false');
}

function toggleAbStudyOverlay() {
  if (!isAbMobileStudyLayout()) return;
  if (abStudyPanel && abStudyPanel.classList.contains('open')) {
    closeAbStudyOverlay();
  } else {
    openAbStudyOverlay();
  }
}

function resetAbStudyLayout() {
  if (isAbMobileStudyLayout()) {
    closeAbStudyOverlay();
  } else if (abStudyPanel) {
    abStudyPanel.classList.remove('open');
    abStudyPanel.setAttribute('aria-hidden', 'false');
    abMusicShell?.classList.remove('study-open');
    if (abStudyFab) abStudyFab.setAttribute('aria-expanded', 'false');
    requestAnimationFrame(() => {
      const activeSegment = document.querySelector('.ab-segment-btn.active');
      if (activeSegment) updateAbSegmentIndicator(activeSegment);
    });
  }
}

const toastElement = document.getElementById('toast-message');
const toastText = document.getElementById('toast-text');
const appContainer = document.querySelector('.app-container');
const landingStartBtn = document.getElementById('landing-start');
const landingPreviewBtn = document.getElementById('landing-preview');
const landingInstallBtn = document.getElementById('landing-install');

// Settings Modal
const settingsModal = document.getElementById('settings-modal');
const settingsToggle = document.getElementById('settings-toggle');
const btnCloseSettings = document.getElementById('btn-close-settings');
const settingOffset = document.getElementById('setting-offset');
const btnResetData = document.getElementById('btn-reset-data');
const settingNickname = document.getElementById('setting-nickname');
const settingVisitCount = document.getElementById('setting-visit-count');
const btnStatsToggle = document.getElementById('btn-stats-toggle');
const publicStatsModal = document.getElementById('public-stats-modal');
const btnClosePublicStats = document.getElementById('btn-close-public-stats');
const pubStatsUnique = document.getElementById('pub-stats-unique');
const pubStatsVisits = document.getElementById('pub-stats-visits');
const pubStatsMonthly = document.getElementById('pub-stats-monthly');

// Guided Tutorial Tour
const tutorialToggle = document.getElementById('tutorial-toggle');
const installToggle = document.getElementById('install-toggle');
const tourShade = document.getElementById('tour-shade');
const tourPopover = document.getElementById('tour-popover');
const tourClose = document.getElementById('tour-close');
const tourCount = document.getElementById('tour-count');
const tourTitle = document.getElementById('tour-title');
const tourDesc = document.getElementById('tour-desc');
const tourPrev = document.getElementById('tour-prev');
const tourNext = document.getElementById('tour-next');

// Support Modal
const supportModal = document.getElementById('support-modal');
const btnCloseSupport = document.getElementById('btn-close-support');

// About App Modal
const aboutAppModal = document.getElementById('about-app-modal');
const floatingCodeBtn = document.getElementById('floating-code-btn');
const btnCloseAboutApp = document.getElementById('btn-close-about-app');

// Themes
const themeToggle = document.getElementById('theme-toggle');

// Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.pane-panel');

// Search and Playlist
const playlistContainer = document.getElementById('playlist-container');
const trackSearch = document.getElementById('track-search');
const trackFilter = document.getElementById('track-filter');

// Menu Dropdown Elements
const menuToggle = document.getElementById('menu-toggle');
const menuDropdownContent = document.getElementById('menu-dropdown-content');
const menuBackdrop = document.getElementById('menu-backdrop');
const speedMenuBackdrop = document.getElementById('speed-menu-backdrop');



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
  if (state.activeBookId === 'listening-strategies') {
    return t(`strategies_unit_${unitNum}_name`);
  }
  return t(`unit_${unitNum}_name`);
}

const pdfShortcutsContainer = document.getElementById('pdf-shortcuts');

function renderPdfShortcuts() {
  if (!pdfShortcutsContainer || !state.activeBook) return;
  pdfShortcutsContainer.innerHTML = '';
  
  state.activeBook.shortcuts.forEach(shortcut => {
    const btn = document.createElement('button');
    btn.className = 'pdf-shortcut-btn';
    btn.dataset.page = shortcut.page;
    
    let localizedName = shortcut.name;
    if (state.language === 'uz') {
      if (shortcut.name.startsWith('Unit ')) {
        localizedName = `${shortcut.name.replace('Unit ', '')}-Bo'lim`;
      } else if (shortcut.name === 'Tapescripts') {
        localizedName = 'Matnlar';
      } else if (shortcut.name === 'Answers') {
        localizedName = 'Javoblar';
      }
    }
    
    btn.textContent = localizedName;
    btn.addEventListener('click', () => {
      syncPdfViewer(shortcut.page);
      showToast(t('toast_pdf_scrolled') + (shortcut.page + state.pdfOffset), "cyan");
    });
    pdfShortcutsContainer.appendChild(btn);
  });
}

function updateLandingScreenUI() {
  const landingKicker = document.querySelector('.landing-kicker');
  const landingTitle = document.getElementById('landing-title');
  const landingAuthor = document.querySelector('.landing-author');
  const landingSubtitle = document.querySelector('.landing-subtitle');
  const landingStats = document.querySelector('.landing-stats');
  const ieltsProductPreview = document.querySelector('.landing-product.ielts-only');
  const abProductPreview = document.querySelector('.landing-product.audiobooks-only');
  const landingBookTitle = document.querySelector('.landing-book-title');

  if (state.activeWorkspace === 'ielts') {
    if (landingKicker) landingKicker.textContent = state.language === 'en' ? "IELTS listening practice suite" : "IELTS listening mashq to'plami";
    if (landingTitle) landingTitle.textContent = state.activeBook ? state.activeBook.title : "Basic IELTS Listening";
    if (landingAuthor) landingAuthor.textContent = state.language === 'uz' && state.activeBookId === 'basic-ielts' ? "Kitob muallifi: Li Ya Bin" : (state.activeBook ? state.activeBook.author : "Book by Li Ya Bin");
    if (landingSubtitle) landingSubtitle.textContent = state.language === 'en' ? "Study with the book, stream every track, write dictation, and save your progress in one focused workspace." : "Kitob bilan ishlab, barcha treklarni tinglang, diktant yozing va natijangizni bitta qulay oynada saqlang.";
    
    if (landingBookTitle && state.activeBook) {
      landingBookTitle.textContent = state.activeBook.title;
    }

    if (landingStats) {
      landingStats.innerHTML = `
        <div class="landing-stat">
          <strong>97</strong>
          <span>${state.language === 'en' ? 'audio tracks' : 'audio treklar'}</span>
        </div>
        <div class="landing-stat">
          <strong>5</strong>
          <span>${state.language === 'en' ? 'study units' : 'o\'quv bo\'limlari'}</span>
        </div>
        <div class="landing-stat">
          <strong>A-B</strong>
          <span>${state.language === 'en' ? 'repeat loop' : 'takrorlash tsikli'}</span>
        </div>
      `;
    }

    if (ieltsProductPreview) ieltsProductPreview.style.display = '';
    if (abProductPreview) abProductPreview.style.display = 'none';
  } else {
    // Audiobook Workspace Landing Page Content
    if (landingKicker) landingKicker.textContent = state.language === 'en' ? "Classic Literature Study Suite" : "Mumtoz adabiyotlar to'plami";
    if (landingTitle) landingTitle.textContent = "Dracula";
    if (landingAuthor) landingAuthor.textContent = state.language === 'en' ? "by Bram Stoker" : "Bram Stoker qalamiga mansub";
    if (landingSubtitle) landingSubtitle.textContent = state.language === 'en' ? "Listen to Bram Stoker's gothic masterpiece, transcribe chapters, log vocabulary, and learn dynamically." : "Bram Stokerning mashhur gotik asarini tinglang, boblar bo'yicha diktant yozing va o'zlashtirish qaydlarini yuriting.";
    
    if (landingStats) {
      landingStats.innerHTML = `
        <div class="landing-stat">
          <strong>5</strong>
          <span>${state.language === 'en' ? 'chapters' : 'boblar'}</span>
        </div>
        <div class="landing-stat">
          <strong>73</strong>
          <span>${state.language === 'en' ? 'minutes audio' : 'daqiqa tinglash'}</span>
        </div>
        <div class="landing-stat">
          <strong>A-B</strong>
          <span>${state.language === 'en' ? 'repeat loop' : 'takrorlash tsikli'}</span>
        </div>
      `;
    }

    if (ieltsProductPreview) ieltsProductPreview.style.display = 'none';
    if (abProductPreview) abProductPreview.style.display = 'block';
  }
}

function syncBookSelects(bookId) {
  const bookSelect = document.getElementById('book-select');
  const mobileBookSelect = document.getElementById('mobile-book-select');
  if (bookSelect) bookSelect.value = bookId;
  if (mobileBookSelect) mobileBookSelect.value = bookId;
}

function switchBook(bookId) {
  if (state.activeBookId === bookId) return;
  
  // Pause current audio
  pauseAudio();
  
  // Save progress & offset of current book
  localStorage.setItem(`ielts_listening_progress_${state.activeBookId}`, JSON.stringify(state.progress));
  localStorage.setItem(`ielts_pdf_offset_${state.activeBookId}`, state.pdfOffset);
  
  // Update active book in state
  state.activeBookId = bookId;
  state.activeBook = BOOKS.find(b => b.id === bookId);
  syncBookSelects(bookId);
  localStorage.setItem('ielts_active_book_id', bookId);
  if (bookId !== 'dracula') {
    localStorage.setItem('ielts_last_active_book_id', bookId);
  }
  
  // Load progress & offset of new book
  const savedOffset = localStorage.getItem(`ielts_pdf_offset_${bookId}`) || (bookId === 'basic-ielts' ? localStorage.getItem('ielts_pdf_offset') : null);
  state.pdfOffset = savedOffset ? parseInt(savedOffset, 10) : 0;
  settingOffset.value = state.pdfOffset;
  
  const savedProgress = localStorage.getItem(`ielts_listening_progress_${bookId}`) || (bookId === 'basic-ielts' ? localStorage.getItem('ielts_listening_progress') : null);
  if (savedProgress) {
    state.progress = JSON.parse(savedProgress);
  } else {
    state.progress = {};
  }
  
  // Update tracks list for active book
  state.tracks = TRACKS.filter(t => t.bookId === bookId);
  
  // Sync PDF view page
  if (state.activeBook.shortcuts && state.activeBook.shortcuts.length > 0) {
    syncPdfViewer(state.activeBook.shortcuts[0].page);
  }

  // Update UI components
  updateLandingScreenUI();
  renderPdfShortcuts();
  renderPlaylist();
  updateStatsDashboard();
  
  // Select first track and sync PDF
  if (state.tracks.length > 0) {
    selectTrack(state.tracks[0], false);
    if (state.activeBook.type !== 'audiobook' && state.activeBook.shortcuts.length > 0) {
      syncPdfViewer(state.activeBook.shortcuts[0].page);
    }
  }
  
  // Update header PDF title filename display
  const pdfTitleSpan = document.querySelector('.pdf-title span');
  if (pdfTitleSpan) {
    pdfTitleSpan.textContent = state.activeBook.type === 'audiobook' ? (state.language === 'en' ? "Audiobook Mode" : "Audiokitob rejimi") : state.activeBook.pdfFile;
  }
  
  showToast(state.language === 'en' ? "Switched book successfully!" : "Kitob muvaffaqiyatli almashtirildi!", "success");
}

function updateLanguageUI() {
  document.querySelectorAll('.lang-btn-inline').forEach(opt => {
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
  
  updateLandingScreenUI();
  renderPdfShortcuts();

  if (state.activeWorkspace === 'audiobooks') {
    renderAudiobookWorkspaceChapters();
    updateAbNowPlaying(getAbActiveChapter());
  }
}

function openPracticeWorkspace() {
  appContainer.classList.add('landing-dismissed');
  window.location.hash = 'app';

  // After dismissing landing, show the correct workspace
  if (state.activeWorkspace === 'audiobooks') {
    if (mainWorkspace) mainWorkspace.style.display = 'none';
    if (ieltsBookSelectWrapper) ieltsBookSelectWrapper.style.display = 'none';
    if (audiobookSelectWrapper) audiobookSelectWrapper.style.display = '';
    if (audiobookWorkspace) audiobookWorkspace.style.display = 'flex';
    ensureAbAudioSource();
    renderAudiobookWorkspaceChapters();
    loadAbChapterWorkspaceData();
    syncAbStudyOverlayBounds();
    resetAbStudyLayout();
  } else {
    if (mainWorkspace) mainWorkspace.style.display = 'flex';
    if (pdfPane) pdfPane.style.display = 'flex';
    if (controlPane) controlPane.style.display = 'flex';
    if (ieltsBookSelectWrapper) ieltsBookSelectWrapper.style.display = 'flex';
    if (audiobookSelectWrapper) audiobookSelectWrapper.style.display = 'none';
    if (audiobookWorkspace) audiobookWorkspace.style.display = 'none';
    // Reload PDF for active book
    if (state.activeBook && state.activeBook.shortcuts && state.activeBook.shortcuts.length > 0) {
      syncPdfViewer(state.activeBook.shortcuts[0].page);
    }
  }
}

function getTourSteps() {
  return [
    {
      selector: '.pane-tabs-nav',
      title: t('tutorial_step_1_title'),
      desc: t('tutorial_step_1_desc')
    },
    {
      selector: '#playlist-container',
      title: t('tutorial_step_1_title'),
      desc: state.language === 'en'
        ? 'Pick any track from this list. Audio starts independently from the book.'
        : "Ushbu ro'yxatdan trek tanlang. Audio kitobdan alohida ishlaydi."
    },
    {
      selector: '.pdf-pane',
      title: t('tutorial_step_3_title'),
      desc: t('tutorial_step_3_desc')
    },
    {
      selector: '.audio-player-footer',
      title: t('tutorial_step_2_title'),
      desc: t('tutorial_step_2_desc')
    },
    {
      selector: '#panel-dictation',
      title: t('tutorial_step_4_title'),
      desc: t('tutorial_step_4_desc')
    }
  ];
}

function clearTourHighlight() {
  if (highlightedTourElement) {
    highlightedTourElement.classList.remove('tour-highlight');
    highlightedTourElement = null;
  }
}

function positionTourPopover(target) {
  if (window.innerWidth <= 768) {
    tourPopover.style.left = '16px';
    tourPopover.style.right = '16px';
    tourPopover.style.top = 'auto';
    tourPopover.style.bottom = '16px';
    return;
  }

  tourPopover.style.right = 'auto';
  tourPopover.style.bottom = 'auto';

  const rect = target.getBoundingClientRect();
  const popoverRect = tourPopover.getBoundingClientRect();
  const margin = 16;

  let left = rect.right + margin;
  let top = rect.top + Math.min(24, Math.max(0, rect.height / 4));

  if (left + popoverRect.width + margin > window.innerWidth) {
    left = rect.left - popoverRect.width - margin;
  }

  if (left < margin) {
    left = Math.min(window.innerWidth - popoverRect.width - margin, margin);
    top = rect.bottom + margin;
  }

  if (top + popoverRect.height + margin > window.innerHeight) {
    top = window.innerHeight - popoverRect.height - margin;
  }

  tourPopover.style.left = `${Math.max(margin, left)}px`;
  tourPopover.style.top = `${Math.max(margin, top)}px`;
}

function renderTourStep() {
  const steps = getTourSteps();
  const step = steps[activeTourStep];
  const target = document.querySelector(step.selector);

  if (!target) {
    endTour();
    return;
  }

  clearTourHighlight();
  highlightedTourElement = target;
  highlightedTourElement.classList.add('tour-highlight');
  highlightedTourElement.scrollIntoView({
    behavior: 'smooth',
    block: window.innerWidth <= 768 ? 'start' : 'center',
    inline: 'center'
  });

  tourCount.textContent = `${activeTourStep + 1} / ${steps.length}`;
  tourTitle.textContent = step.title;
  tourDesc.textContent = step.desc;
  tourPrev.disabled = activeTourStep === 0;
  tourNext.textContent = activeTourStep === steps.length - 1 ? t('tutorial_finish') : t('tutorial_next');

  setTimeout(() => positionTourPopover(target), 180);
}

function startTour() {
  openPracticeWorkspace();
  activeTourStep = 0;
  tourShade.classList.add('active');
  tourPopover.classList.add('active');
  renderTourStep();
}

function endTour() {
  clearTourHighlight();
  tourShade.classList.remove('active');
  tourPopover.classList.remove('active');
}

function nextTourStep() {
  const steps = getTourSteps();
  if (activeTourStep >= steps.length - 1) {
    endTour();
    return;
  }
  activeTourStep += 1;
  renderTourStep();
}

function previousTourStep() {
  if (activeTourStep === 0) return;
  activeTourStep -= 1;
  renderTourStep();
}

function generateRandomNickname() {
  const adjectives = [
    'Sleek', 'Golden', 'Cyber', 'Bright', 'Calm', 'Brave', 'Gentle', 'Swift', 'Quick', 'Happy',
    'Smart', 'Cool', 'Noble', 'Loyal', 'Mystic', 'Fancy', 'Sharp', 'Vibrant', 'Silent', 'Bold'
  ];
  const animals = [
    'Eagle', 'Dolphin', 'Panther', 'Koala', 'Fox', 'Wolf', 'Panda', 'Tiger', 'Lion', 'Falcon',
    'Owl', 'Bear', 'Rabbit', 'Deer', 'Otter', 'Cheetah', 'Leopard', 'Phoenix', 'Lynx', 'Hawk'
  ];
  const randAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randAnim = animals[Math.floor(Math.random() * animals.length)];
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `${randAdj} ${randAnim} #${randNum}`;
}

function initDeviceTracking() {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = 'tinglang-' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('device_id', deviceId);
  }

  let nickname = localStorage.getItem('device_nickname');
  if (!nickname) {
    nickname = generateRandomNickname();
    localStorage.setItem('device_nickname', nickname);
  }

  let visitCount = parseInt(localStorage.getItem('device_visit_count') || '0', 10);
  if (!sessionStorage.getItem('device_session_counted')) {
    visitCount += 1;
    localStorage.setItem('device_visit_count', visitCount);
    sessionStorage.setItem('device_session_counted', 'true');
  }

  if (settingNickname) {
    settingNickname.value = nickname;
  }
  if (settingVisitCount) {
    settingVisitCount.textContent = visitCount;
  }
}

// Initialize App
function init() {
  loadLocalStorage();
  setupEventListeners();
  renderPdfShortcuts();
  renderPlaylist();
  updateStatsDashboard();
  if (state.tracks.length > 0) {
    selectTrack(state.tracks[0], false); // Load first track but don't autoplay
  }
  
  setupAudiobookEventListeners();
  applyTheme();
  
  // Set header PDF title text
  const pdfTitleSpan = document.querySelector('.pdf-title span');
  if (pdfTitleSpan) {
    pdfTitleSpan.textContent = state.activeBook.type === 'audiobook' ? (state.language === 'en' ? "Audiobook Mode" : "Audiokitob rejimi") : state.activeBook.pdfFile;
  }
  
  updateLandingScreenUI();
  
  // Ensure correct workspace visibility at startup (landing page is open at this point)
  // Always show/hide the correct book selector in header
  if (state.activeWorkspace === 'audiobooks') {
    if (ieltsBookSelectWrapper) ieltsBookSelectWrapper.style.display = 'none';
    if (audiobookSelectWrapper) audiobookSelectWrapper.style.display = '';
  } else {
    if (ieltsBookSelectWrapper) ieltsBookSelectWrapper.style.display = '';
    if (audiobookSelectWrapper) audiobookSelectWrapper.style.display = 'none';
  }

  // Workspace switcher active state
  switchWorkspace(state.activeWorkspace);

  if (window.location.hash === '#app') {
    openPracticeWorkspace();
  }
  initDeviceTracking();
  logSessionStart();
}

// Local Storage Handlers
function loadLocalStorage() {
  // Load active book first
  const savedBookId = localStorage.getItem('ielts_active_book_id');
  if (savedBookId && savedBookId !== 'dracula' && BOOKS.some(b => b.id === savedBookId)) {
    state.activeBookId = savedBookId;
  } else {
    state.activeBookId = 'basic-ielts';
  }
  state.activeBook = BOOKS.find(b => b.id === state.activeBookId);

  // Filter tracks
  state.tracks = TRACKS.filter(t => t.bookId === state.activeBookId);

  const savedProgress = localStorage.getItem(`ielts_listening_progress_${state.activeBookId}`) || (state.activeBookId === 'basic-ielts' ? localStorage.getItem('ielts_listening_progress') : null);
  if (savedProgress) {
    state.progress = JSON.parse(savedProgress);
  } else {
    state.progress = {};
  }
  
  const savedOffset = localStorage.getItem(`ielts_pdf_offset_${state.activeBookId}`) || (state.activeBookId === 'basic-ielts' ? localStorage.getItem('ielts_pdf_offset') : null);
  if (savedOffset) {
    state.pdfOffset = parseInt(savedOffset, 10);
    settingOffset.value = state.pdfOffset;
  } else {
    state.pdfOffset = 0;
    settingOffset.value = 0;
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
    state.language = 'uz';
  }
  updateLanguageUI();

  // Load cached public stats
  const cachedPublicStats = localStorage.getItem('ielts_public_stats');
  if (cachedPublicStats) {
    try {
      const stats = JSON.parse(cachedPublicStats);
      if (pubStatsUnique) pubStatsUnique.textContent = stats.totalUnique || 0;
      if (pubStatsVisits) pubStatsVisits.textContent = stats.totalVisits || 0;
      if (pubStatsMonthly) pubStatsMonthly.textContent = stats.monthlyActive || 0;
    } catch (e) {
      // Ignore
    }
  }

  // Load active workspace
  const savedWorkspace = localStorage.getItem('ielts_active_workspace');
  if (savedWorkspace) {
    state.activeWorkspace = savedWorkspace;
  } else {
    state.activeWorkspace = 'ielts';
  }

  // Load audiobook progress
  const savedAbProgress = localStorage.getItem('ielts_audiobook_progress');
  if (savedAbProgress) {
    state.audiobookState.progress = JSON.parse(savedAbProgress);
  } else {
    state.audiobookState.progress = {};
  }
  
  if (abAudio) {
    abAudio.volume = state.volume;
  }
}

function saveProgress(reRenderPlaylist = true) {
  localStorage.setItem(`ielts_listening_progress_${state.activeBookId}`, JSON.stringify(state.progress));
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

function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function updateInstallButtons() {
  const shouldHide = isAppInstalled();
  [installToggle, landingInstallBtn].forEach((button) => {
    if (!button) return;
    button.style.display = shouldHide ? 'none' : '';
  });
}

async function handleInstallClick() {
  if (isAppInstalled()) {
    showToast(t('install_done'), "success");
    updateInstallButtons();
    return;
  }

  if (!deferredInstallPrompt) {
    showToast(t('install_unavailable'), "violet");
    return;
  }

  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;

  showToast(
    choice.outcome === 'accepted' ? t('install_done') : t('install_dismissed'),
    choice.outcome === 'accepted' ? "success" : "violet"
  );
  updateInstallButtons();
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

// Workspace switching engine
function switchWorkspace(workspace) {

  state.activeWorkspace = workspace;
  localStorage.setItem('ielts_active_workspace', workspace);
  if (appContainer) appContainer.dataset.workspace = workspace;

  if (workspaceSwitcher) {
    const btns = workspaceSwitcher.querySelectorAll('.switcher-btn');
    btns.forEach(btn => {
      if (btn.dataset.workspace === workspace) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  const landingDismissed = appContainer && appContainer.classList.contains('landing-dismissed');

  if (workspace === 'ielts') {
    if (audiobookSelectWrapper) audiobookSelectWrapper.style.display = 'none';
    if (ieltsBookSelectWrapper) ieltsBookSelectWrapper.style.display = '';
    if (landingDismissed) {
      if (mainWorkspace) mainWorkspace.style.display = '';
      if (pdfPane) pdfPane.style.display = '';
      if (controlPane) controlPane.style.display = '';
      if (audiobookWorkspace) audiobookWorkspace.style.display = 'none';
    }
    
    // Pause audiobook player
    if (abAudio && !abAudio.paused) {
      abAudio.pause();
    }

    // Force switch back to an IELTS book if currently set to dracula
    if (state.activeBookId === 'dracula') {
      const lastIeltsBookId = localStorage.getItem('ielts_last_active_book_id') || 'basic-ielts';
      state.activeBookId = lastIeltsBookId;
      state.activeBook = BOOKS.find(b => b.id === lastIeltsBookId);
      localStorage.setItem('ielts_active_book_id', lastIeltsBookId);
      syncBookSelects(lastIeltsBookId);
      
      // Reload tracks and progress
      state.tracks = TRACKS.filter(t => t.bookId === lastIeltsBookId);
      const savedProgress = localStorage.getItem(`ielts_listening_progress_${lastIeltsBookId}`) || (lastIeltsBookId === 'basic-ielts' ? localStorage.getItem('ielts_listening_progress') : null);
      state.progress = savedProgress ? JSON.parse(savedProgress) : {};
      
      renderPlaylist();
      updateStatsDashboard();
      if (state.tracks.length > 0) {
        selectTrack(state.tracks[0], false);
      }
      
      // Sync PDF
      if (state.activeBook.shortcuts && state.activeBook.shortcuts.length > 0) {
        syncPdfViewer(state.activeBook.shortcuts[0].page);
      }
    }
  } else {
    if (ieltsBookSelectWrapper) ieltsBookSelectWrapper.style.display = 'none';
    if (audiobookSelectWrapper) audiobookSelectWrapper.style.display = '';
    if (landingDismissed) {
      if (mainWorkspace) mainWorkspace.style.display = 'none';
      if (audiobookWorkspace) audiobookWorkspace.style.display = 'flex';
    }
    
    // Pause IELTS player
    pauseAudio();

    ensureAbAudioSource();

    if (landingDismissed) {
      renderAudiobookWorkspaceChapters();
      loadAbChapterWorkspaceData();
    }

    syncAbStudyOverlayBounds();
    resetAbStudyLayout();
  }

  // Always update landing page content to reflect active workspace
  updateLandingScreenUI();
}

function setMenuOpen(isOpen) {
  if (isOpen) setSpeedMenuOpen(false);
  if (menuDropdownContent) menuDropdownContent.classList.toggle('active', isOpen);
  if (menuBackdrop) {
    menuBackdrop.classList.toggle('active', isOpen);
    menuBackdrop.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  }
  document.body.classList.toggle('menu-open', isOpen);
}

function setSpeedMenuOpen(isOpen, target = null) {
  if (!isOpen) {
    if (speedDropdown) speedDropdown.classList.remove('active');
    if (abSpeedDropdown) abSpeedDropdown.classList.remove('active');
  } else if (target === 'ielts') {
    if (abSpeedDropdown) abSpeedDropdown.classList.remove('active');
    if (speedDropdown) speedDropdown.classList.add('active');
  } else if (target === 'ab') {
    if (speedDropdown) speedDropdown.classList.remove('active');
    if (abSpeedDropdown) abSpeedDropdown.classList.add('active');
  }

  const anyOpen = Boolean(
    speedDropdown?.classList.contains('active') || abSpeedDropdown?.classList.contains('active')
  );

  if (speedMenuBackdrop) {
    speedMenuBackdrop.classList.toggle('active', anyOpen);
    speedMenuBackdrop.setAttribute('aria-hidden', anyOpen ? 'false' : 'true');
  }
  document.body.classList.toggle('speed-menu-open', anyOpen);
}

function ensureAbAudioSource() {
  if (!abAudio) return false;
  if (abAudio.getAttribute('src') !== AB_AUDIO_URL) {
    abAudio.src = AB_AUDIO_URL;
    abAudio.load();
    resetAbMinuteJumps();
  }
  return true;
}

function getAbActiveChapter() {
  const dracula = BOOKS.find(b => b.id === 'dracula');
  if (!dracula || !dracula.chapters || !abAudio) return dracula?.chapters?.[0] || null;
  const t = abAudio.currentTime;
  return dracula.chapters.find(ch => t >= ch.start && t < ch.end) || dracula.chapters[0];
}

function getAbChapterShortTitle(ch) {
  if (!ch) return '';
  return ch.title.split(': ')[1] || ch.title;
}

function updateAbNowPlaying(chapter) {
  const dracula = BOOKS.find(b => b.id === 'dracula');
  if (!dracula) return;
  const ch = chapter || getAbActiveChapter();
  if (abNowTitle) abNowTitle.textContent = dracula.title;
  if (abNowAuthor) abNowAuthor.textContent = dracula.author.replace(/^Book by /, '').replace(/^by /, '');
  if (abNowChapter && ch) {
    const label = state.language === 'en' ? 'Chapter' : 'Bob';
    abNowChapter.textContent = `${label} ${ch.chapterNum}: ${getAbChapterShortTitle(ch)}`;
  }
}

function jumpToAbChapter(chapterNum, autoplay = true) {
  const dracula = BOOKS.find(b => b.id === 'dracula');
  if (!dracula || !abAudio || !ensureAbAudioSource()) return;
  const ch = dracula.chapters.find(c => c.chapterNum === chapterNum);
  if (!ch) return;

  abAudio.currentTime = ch.start;
  if (autoplay && abAudio.paused) {
    abAudio.play().catch(() => showAbPlayError());
  }
  updateAbNowPlaying(ch);
  loadAbChapterWorkspaceData(true);
  scrollAbChapterPillIntoView(chapterNum);
}

function formatAbChapterTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function scrollAbChapterPillIntoView(chapterNum) {
  const card = document.querySelector(`.ab-chapter-card[data-chapter-num="${chapterNum}"]`);
  if (!card) return;
  const isMobile = isAbMobileStudyLayout();
  card.scrollIntoView({
    behavior: 'smooth',
    inline: isMobile ? 'center' : 'nearest',
    block: isMobile ? 'nearest' : 'center'
  });
}

function renderAudiobookWorkspaceChapters() {
  if (!abChaptersList) return;
  abChaptersList.innerHTML = '';

  const dracula = BOOKS.find(b => b.id === 'dracula');
  if (!dracula || !dracula.chapters) return;

  const activeCh = getAbActiveChapter();
  const chLabel = state.language === 'en' ? 'Chapter' : 'Bob';

  dracula.chapters.forEach(ch => {
    const progressKey = `chapter_${ch.chapterNum}`;
    const progress = state.audiobookState.progress[progressKey] || { status: 'unattempted' };

    const statusText = progress.status === 'completed'
      ? (state.language === 'en' ? 'Done' : 'Tugallangan')
      : progress.status === 'in-progress'
        ? (state.language === 'en' ? 'Listening' : 'Eshitilmoqda')
        : (state.language === 'en' ? 'New' : 'Yangi');

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'ab-chapter-card';
    card.setAttribute('data-chapter-num', ch.chapterNum);
    card.setAttribute('role', 'tab');
    card.setAttribute('aria-selected', activeCh && activeCh.chapterNum === ch.chapterNum ? 'true' : 'false');

    if (activeCh && activeCh.chapterNum === ch.chapterNum) {
      card.classList.add('active');
    }

    const shortTitle = getAbChapterShortTitle(ch);

    card.innerHTML = `
      <span class="ab-chapter-card-num">${String(ch.chapterNum).padStart(2, '0')}</span>
      <span class="ab-chapter-card-body">
        <span class="ab-chapter-card-title">${chLabel} ${ch.chapterNum}: ${shortTitle}</span>
        <span class="ab-chapter-card-time">${formatAbChapterTime(ch.start)} – ${formatAbChapterTime(ch.end)}</span>
      </span>
      <span class="ab-chapter-card-mobile-label">${state.language === 'en' ? 'Ch' : 'Bob'} ${ch.chapterNum}</span>
      <span class="ab-chapter-card-dot ${progress.status}"></span>
      <span class="chapter-status-badge ab-chapter-card-badge ${progress.status}">${statusText}</span>
    `;
    card.title = shortTitle;

    card.addEventListener('click', () => {
      jumpToAbChapter(ch.chapterNum);
    });

    abChaptersList.appendChild(card);
  });

  updateAbNowPlaying(activeCh);
}

// Load chapter dictation & notes workspace data
let currentLoadedAbChapter = null;

function loadAbChapterWorkspaceData(force = false) {
  const dracula = BOOKS.find(b => b.id === 'dracula');
  if (!dracula || !dracula.chapters) return;
  
  const activeCh = getAbActiveChapter();
  if (!activeCh) return;
  
  if (!force && currentLoadedAbChapter === activeCh.chapterNum) return;
  
  // Save previous chapter content first
  if (currentLoadedAbChapter !== null) {
    const prevKey = `chapter_${currentLoadedAbChapter}`;
    if (!state.audiobookState.progress[prevKey]) {
      state.audiobookState.progress[prevKey] = { status: 'unattempted' };
    }
    state.audiobookState.progress[prevKey].dictation = abDictationText ? abDictationText.value : "";
    state.audiobookState.progress[prevKey].notes = abNotesText ? abNotesText.value : "";
    
    localStorage.setItem('ielts_audiobook_progress', JSON.stringify(state.audiobookState.progress));
  }
  
  currentLoadedAbChapter = activeCh.chapterNum;
  
  const progressKey = `chapter_${activeCh.chapterNum}`;
  const chProgress = state.audiobookState.progress[progressKey] || {};
  
  if (abDictationText) {
    abDictationText.value = chProgress.dictation || "";
    updateAbDictStats();
  }
  if (abNotesText) {
    abNotesText.value = chProgress.notes || "";
  }

  updateAbNowPlaying(activeCh);
}

// Save audiobook chapter-level dictation
function saveAbDictation() {
  if (currentLoadedAbChapter === null) return;
  const key = `chapter_${currentLoadedAbChapter}`;
  if (!state.audiobookState.progress[key]) {
    state.audiobookState.progress[key] = { status: 'unattempted' };
  }
  state.audiobookState.progress[key].dictation = abDictationText ? abDictationText.value : "";
  
  if (state.audiobookState.progress[key].status === 'unattempted') {
    state.audiobookState.progress[key].status = 'in-progress';
  }
  
  localStorage.setItem('ielts_audiobook_progress', JSON.stringify(state.audiobookState.progress));
  renderAudiobookWorkspaceChapters();
  showToast(state.language === 'en' ? "Chapter dictation saved!" : "Bob diktanti saqlandi!", "success");
}

// Save audiobook chapter-level notes
function saveAbNotes() {
  if (currentLoadedAbChapter === null) return;
  const key = `chapter_${currentLoadedAbChapter}`;
  if (!state.audiobookState.progress[key]) {
    state.audiobookState.progress[key] = { status: 'unattempted' };
  }
  state.audiobookState.progress[key].notes = abNotesText ? abNotesText.value : "";
  
  localStorage.setItem('ielts_audiobook_progress', JSON.stringify(state.audiobookState.progress));
  showToast(state.language === 'en' ? "Chapter notes saved!" : "Bob eslatmalari saqlandi!", "success");
}

// Export all notes to a text file
function exportAbNotes() {
  let output = `FLUENTEAR AUDIOBOOK NOTES: DRACULA\n`;
  output += `========================================\n\n`;
  
  const dracula = BOOKS.find(b => b.id === 'dracula');
  if (dracula && dracula.chapters) {
    dracula.chapters.forEach(ch => {
      const key = `chapter_${ch.chapterNum}`;
      const progress = state.audiobookState.progress[key] || {};
      output += `[Chapter ${ch.chapterNum}: ${ch.title}]\n`;
      output += `Dictation written: ${progress.dictation ? progress.dictation.length : 0} chars\n`;
      output += `Notes:\n${progress.notes || "(empty)"}\n`;
      output += `----------------------------------------\n\n`;
    });
  }
  
  const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dracula_audiobook_notes.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(state.language === 'en' ? "Notes exported!" : "Eslatmalar eksport qilindi!", "success");
}

// Update dictation stats
function updateAbDictStats() {
  if (!abDictationText) return;
  const text = abDictationText.value.trim();
  const chars = text.length;
  const words = text ? text.split(/\s+/).length : 0;
  
  if (abDictWords) abDictWords.textContent = words;
  if (abDictChars) abDictChars.textContent = chars;
}

function showAbPlayError() {
  showToast(
    state.language === 'en'
      ? 'Could not play audiobook. Check your internet connection.'
      : "Audiokitobni ijro etib bo'lmadi. Internet aloqasini tekshiring.",
    'warning'
  );
}

// Toggle Play/Pause on audiobook player
function toggleAbPlay() {
  if (!abAudio || !ensureAbAudioSource()) return;
  if (abAudio.paused) {
    abAudio.play().catch(() => showAbPlayError());
  } else {
    abAudio.pause();
  }
}

// Seek relative seconds on audiobook player
function seekAbAudio(secs) {
  if (!abAudio) return;
  abAudio.currentTime = Math.max(0, Math.min(abAudio.duration || 0, abAudio.currentTime + secs));
}

// Set playback speed
function setAbSpeed(speed) {
  if (!abAudio) return;
  abAudio.playbackRate = speed;
  state.audiobookState.playbackSpeed = speed;
  if (abBtnSpeed) abBtnSpeed.textContent = `${speed.toFixed(2)}x`;
}

// Drag & Seek progress bar
function seekAbToPosition(e) {
  if (!abProgressSlider || !abAudio) return;
  const rect = abProgressSlider.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  abAudio.currentTime = Math.max(0, Math.min(1, pct)) * (abAudio.duration || 0);
}

// Update Audiobook Player GUI
function updateAbPlayerProgress() {
  const cur = abAudio.currentTime;
  const dur = abAudio.duration || 0;
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (abTimeCurrent) abTimeCurrent.textContent = formatTime(cur);
  if (abTimeTotal) abTimeTotal.textContent = formatTime(dur);
  
  if (dur > 0) {
    const pct = (cur / dur) * 100;
    if (abProgressFill) abProgressFill.style.width = `${pct}%`;
    if (abProgressThumb) abProgressThumb.style.left = `${pct}%`;
  }
  
  // A-B loop boundary enforcement
  if (state.audiobookState.abLoop.active && cur >= state.audiobookState.abLoop.end) {
    abAudio.currentTime = state.audiobookState.abLoop.start;
  }
  
  // Chapter progress update
  updateAbWorkspaceChaptersState();
  
  // Minute recommendations / suggestions jumps (e.g. -3m, -2m, -1m, +1m, +2m, +3m)
  updateAbMinuteJumps();
}

// Highlight and update chapters status
function updateAbWorkspaceChaptersState() {
  const dracula = BOOKS.find(b => b.id === 'dracula');
  if (!dracula || !dracula.chapters) return;
  
  const t = abAudio.currentTime;
  
  dracula.chapters.forEach(ch => {
    const card = document.querySelector(`.ab-chapter-card[data-chapter-num="${ch.chapterNum}"]`);
    const progressKey = `chapter_${ch.chapterNum}`;
    
    const isActive = t >= ch.start && t < ch.end;
    if (isActive) {
      if (card && !card.classList.contains('active')) {
        card.classList.add('active');
        card.setAttribute('aria-selected', 'true');
        scrollAbChapterPillIntoView(ch.chapterNum);
        loadAbChapterWorkspaceData();
        updateAbNowPlaying(ch);
      }
      
      // Mark as in-progress if currently unattempted
      if (!state.audiobookState.progress[progressKey] || state.audiobookState.progress[progressKey].status === 'unattempted') {
        state.audiobookState.progress[progressKey] = state.audiobookState.progress[progressKey] || {};
        state.audiobookState.progress[progressKey].status = 'in-progress';
        localStorage.setItem('ielts_audiobook_progress', JSON.stringify(state.audiobookState.progress));
        renderAudiobookWorkspaceChapters();
      }
    } else {
      if (card) {
        card.classList.remove('active');
        card.setAttribute('aria-selected', 'false');
      }
      
      // Mark as completed if they've listened to more than 98% of this chapter
      const chDuration = ch.end - ch.start;
      if (t >= ch.end - (chDuration * 0.02)) {
        if (!state.audiobookState.progress[progressKey] || state.audiobookState.progress[progressKey].status !== 'completed') {
          state.audiobookState.progress[progressKey] = state.audiobookState.progress[progressKey] || {};
          state.audiobookState.progress[progressKey].status = 'completed';
          localStorage.setItem('ielts_audiobook_progress', JSON.stringify(state.audiobookState.progress));
          renderAudiobookWorkspaceChapters();
        }
      }
    }
  });
}

let lastAbMinuteJumpSec = -1;
let lastAbMinuteJumpDuration = 0;

function resetAbMinuteJumps() {
  lastAbMinuteJumpSec = -1;
  lastAbMinuteJumpDuration = 0;
}

// Dynamic minute jump pills — doim 5 ta: -2m, -1m, hozir, +1m, +2m
function updateAbMinuteJumps(force = false) {
  if (!abMinuteJumpsRow || !abAudio) return;

  const t = abAudio.currentTime;
  const duration = abAudio.duration || 0;
  if (duration === 0) return;

  const sec = Math.floor(t);
  if (!force && sec === lastAbMinuteJumpSec && duration === lastAbMinuteJumpDuration) return;
  lastAbMinuteJumpSec = sec;
  lastAbMinuteJumpDuration = duration;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const jumpConfigs = [
    { label: '-2m', diff: -120 },
    { label: '-1m', diff: -60 },
    { label: formatTime(t), diff: 0, isNow: true },
    { label: '+1m', diff: 60 },
    { label: '+2m', diff: 120 },
  ];

  abMinuteJumpsRow.innerHTML = '';

  jumpConfigs.forEach((cfg) => {
    const targetTime = cfg.isNow ? t : Math.max(0, Math.min(duration, t + cfg.diff));
    const btn = document.createElement('button');
    btn.className = `ab-jump-pill-btn${cfg.isNow ? ' ab-jump-pill-now' : ''}`;
    btn.type = 'button';
    btn.textContent = cfg.isNow ? cfg.label : `${cfg.label} (${formatTime(targetTime)})`;
    btn.disabled = cfg.isNow;

    if (!cfg.isNow) {
      const outOfRange = t + cfg.diff < 0 || t + cfg.diff > duration;
      const clamped = Math.max(0, Math.min(duration, t + cfg.diff));
      if (outOfRange) {
        btn.disabled = true;
        btn.classList.add('disabled');
        btn.textContent = cfg.label;
      } else {
        btn.addEventListener('click', () => {
          abAudio.currentTime = clamped;
          resetAbMinuteJumps();
          updateAbMinuteJumps(true);
        });
      }
    }

    abMinuteJumpsRow.appendChild(btn);
  });
}

// Toggle A-B Repeat Loop on audiobook player
function toggleAbLoop() {
  const loopState = state.audiobookState.abLoop;
  const t = abAudio.currentTime;
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!loopState.start && !loopState.end) {
    loopState.start = t;
    if (abLoopLabel) abLoopLabel.textContent = 'A•';
    if (abBtnLoop) {
      abBtnLoop.classList.add('active-set');
      abBtnLoop.title = `${state.language === 'en' ? 'Point A set at' : 'A nuqta'} ${formatTime(t)}`;
    }
  } else if (loopState.start && !loopState.end) {
    if (t <= loopState.start) {
      showToast(state.language === 'en' ? "End point must be after start point!" : "Oxirgi nuqta boshlang'ich nuqtadan keyin bo'lishi kerak!", "warning");
      return;
    }
    loopState.end = t;
    loopState.active = true;
    if (abLoopLabel) abLoopLabel.textContent = '⟳';
    if (abBtnLoop) {
      abBtnLoop.title = `${formatTime(loopState.start)} – ${formatTime(t)}`;
    }
    
    // Draw visual loop segment on progress bar
    if (abLoopIndicator) {
      const pctStart = (loopState.start / abAudio.duration) * 100;
      const pctEnd = (loopState.end / abAudio.duration) * 100;
      abLoopIndicator.style.left = `${pctStart}%`;
      abLoopIndicator.style.width = `${pctEnd - pctStart}%`;
      abLoopIndicator.style.display = 'block';
    }
    
    abAudio.currentTime = loopState.start;
  } else {
    loopState.start = null;
    loopState.end = null;
    loopState.active = false;
    if (abLoopLabel) abLoopLabel.textContent = "A-B";
    if (abBtnLoop) {
      abBtnLoop.classList.remove('active-set');
      abBtnLoop.title = state.language === 'en' ? 'A-B Repeat' : 'A-B takrorlash';
    }
    if (abLoopIndicator) abLoopIndicator.style.display = 'none';
  }
}

// Bind all Audiobook workspace event listeners
function setupAudiobookEventListeners() {
  // Workspace Switcher tabs
  if (workspaceSwitcher) {
    workspaceSwitcher.querySelectorAll('.switcher-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const workspace = btn.dataset.workspace;
        switchWorkspace(workspace);
      });
    });
  }

  // Play/Pause button
  if (abBtnPlayPause) {
    abBtnPlayPause.addEventListener('click', toggleAbPlay);
  }

  // Audio events
  if (abAudio) {
    abAudio.addEventListener('error', () => {
      if (!abAudio.error) return;
      ensureAbAudioSource();
    });
    abAudio.addEventListener('loadedmetadata', () => {
      resetAbMinuteJumps();
      updateAbMinuteJumps(true);
    });
    abAudio.addEventListener('seeked', () => {
      resetAbMinuteJumps();
      updateAbMinuteJumps(true);
    });
    abAudio.addEventListener('timeupdate', updateAbPlayerProgress);
    abAudio.addEventListener('play', () => {
      state.audiobookState.isPlaying = true;
      if (abPlayIcon) abPlayIcon.style.display = 'none';
      if (abPauseIcon) abPauseIcon.style.display = 'block';
    });
    abAudio.addEventListener('pause', () => {
      state.audiobookState.isPlaying = false;
      if (abPlayIcon) abPlayIcon.style.display = 'block';
      if (abPauseIcon) abPauseIcon.style.display = 'none';
    });
    abAudio.addEventListener('ended', () => {
      state.audiobookState.isPlaying = false;
      if (abPlayIcon) abPlayIcon.style.display = 'block';
      if (abPauseIcon) abPauseIcon.style.display = 'none';
      showToast(state.language === 'en' ? "Audiobook finished." : "Audiokitob yakunlandi.", "info");
    });
  }

  // Seek & chapter skip buttons
  if (abBtnBackward15s) {
    abBtnBackward15s.addEventListener('click', () => seekAbAudio(-15));
  }
  if (abBtnForward15s) {
    abBtnForward15s.addEventListener('click', () => seekAbAudio(15));
  }
  if (abBtnPrevChapter) {
    abBtnPrevChapter.addEventListener('click', () => {
      const dracula = BOOKS.find(b => b.id === 'dracula');
      if (!dracula || !dracula.chapters) return;
      const active = getAbActiveChapter();
      if (!active) return;
      const prev = dracula.chapters.find(ch => ch.chapterNum === active.chapterNum - 1);
      if (prev) jumpToAbChapter(prev.chapterNum);
    });
  }
  if (abBtnNextChapter) {
    abBtnNextChapter.addEventListener('click', () => {
      const dracula = BOOKS.find(b => b.id === 'dracula');
      if (!dracula || !dracula.chapters) return;
      const active = getAbActiveChapter();
      if (!active) return;
      const next = dracula.chapters.find(ch => ch.chapterNum === active.chapterNum + 1);
      if (next) jumpToAbChapter(next.chapterNum);
    });
  }

  // A-B Repeat Loop button
  if (abBtnLoop) {
    abBtnLoop.addEventListener('click', toggleAbLoop);
  }

  // Playback Speed button & options
  if (abBtnSpeed) {
    abBtnSpeed.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !abSpeedDropdown?.classList.contains('active');
      setSpeedMenuOpen(willOpen, 'ab');
    });
  }

  if (speedMenuBackdrop) {
    speedMenuBackdrop.addEventListener('click', () => setSpeedMenuOpen(false));
  }

  const btnToggleCover = document.getElementById('ab-btn-toggle-cover');
  if (btnToggleCover) {
    btnToggleCover.addEventListener('click', () => {
      const shell = document.getElementById('ab-music-shell');
      if (!shell) return;
      const isCollapsed = shell.classList.toggle('ab-cover-collapsed');
      localStorage.setItem('ab_cover_collapsed', isCollapsed ? 'true' : 'false');
      updateAbToggleCoverUI(isCollapsed);
    });
  }

  const abSpeedOpts = document.querySelectorAll('.ab-speed-opt');
  abSpeedOpts.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const speed = parseFloat(opt.dataset.speed);
      setAbSpeed(speed);
      abSpeedOpts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      setSpeedMenuOpen(false);
    });
  });

  // Pointer drag events for advanced Audiobook seek slider
  if (abProgressSlider) {
    abProgressSlider.addEventListener('pointerdown', (e) => {
      abProgressSlider.setPointerCapture(e.pointerId);
      seekAbToPosition(e);
      
      const onPointerMove = (moveEvent) => {
        seekAbToPosition(moveEvent);
      };
      
      const onPointerUp = () => {
        abProgressSlider.releasePointerCapture(e.pointerId);
        abProgressSlider.removeEventListener('pointermove', onPointerMove);
        abProgressSlider.removeEventListener('pointerup', onPointerUp);
        abProgressSlider.removeEventListener('pointercancel', onPointerUp);
      };
      
      abProgressSlider.addEventListener('pointermove', onPointerMove);
      abProgressSlider.addEventListener('pointerup', onPointerUp);
      abProgressSlider.addEventListener('pointercancel', onPointerUp);
    });
  }

  if (abStudyFab) {
    abStudyFab.addEventListener('click', openAbStudyOverlay);
  }
  if (abStudyClose) {
    abStudyClose.addEventListener('click', closeAbStudyOverlay);
  }

  window.addEventListener('resize', () => {
    syncAbStudyOverlayBounds();
    resetAbStudyLayout();
  });
  syncAbStudyOverlayBounds();
  resetAbStudyLayout();

  const abSegmentBtns = document.querySelectorAll('.ab-segment-btn');
  abSegmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      abSegmentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateAbSegmentIndicator(btn);

      const tab = btn.dataset.abTab;
      document.querySelectorAll('.ab-tool-panel').forEach(panel => {
        panel.classList.remove('active');
      });
      const targetPanel = document.getElementById(`ab-panel-${tab}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  const initialSegment = document.querySelector('.ab-segment-btn.active');
  if (initialSegment) {
    requestAnimationFrame(() => updateAbSegmentIndicator(initialSegment));
  }
  window.addEventListener('resize', () => {
    if (!abStudyPanel || !abStudyPanel.classList.contains('open')) return;
    const activeSegment = document.querySelector('.ab-segment-btn.active');
    if (activeSegment) updateAbSegmentIndicator(activeSegment);
  });

  // Save Dictation Pad
  if (abBtnSaveDictation) {
    abBtnSaveDictation.addEventListener('click', saveAbDictation);
  }

  // Save Notebook Notes
  if (abBtnSaveNotes) {
    abBtnSaveNotes.addEventListener('click', saveAbNotes);
  }

  // Export Notebook Notes
  if (abBtnExportNotes) {
    abBtnExportNotes.addEventListener('click', exportAbNotes);
  }

  // Live count words/chars in dictation
  if (abDictationText) {
    abDictationText.addEventListener('input', updateAbDictStats);
  }
  initAbCoverCollapseState();
}

function initAbCoverCollapseState() {
  const shell = document.getElementById('ab-music-shell');
  const blurBg = document.getElementById('ab-blur-bg');
  if (blurBg) {
    blurBg.style.backgroundImage = "url('/dracula_cover.jpg')";
  }
  const isCollapsed = localStorage.getItem('ab_cover_collapsed') === 'true';
  if (shell) {
    shell.classList.toggle('ab-cover-collapsed', isCollapsed);
  }
  updateAbToggleCoverUI(isCollapsed);
}

function updateAbToggleCoverUI(isCollapsed) {
  const btn = document.getElementById('ab-btn-toggle-cover');
  if (!btn) return;
  const eyeIcon = btn.querySelector('.ab-toggle-cover-icon-eye');
  const eyeSlashIcon = btn.querySelector('.ab-toggle-cover-icon-eye-slash');
  if (eyeIcon && eyeSlashIcon) {
    if (isCollapsed) {
      eyeIcon.style.display = 'block';
      eyeSlashIcon.style.display = 'none';
    } else {
      eyeIcon.style.display = 'none';
      eyeSlashIcon.style.display = 'block';
    }
  }
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
  audio.src = getMediaUrl(track.path);
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
    localStorage.setItem(`ielts_listening_progress_${state.activeBookId}`, JSON.stringify(state.progress));
    updateStatsDashboard();
    
    const card = document.querySelector(`.track-item-card[data-track-id="${track.id}"]`);
    if (card) {
      card.classList.remove('unattempted');
      card.classList.add('in-progress');
    }
  }

  if (autoplay) {
    playAudio();
  } else {
    pauseAudio();
  }
}

// Sync PDF IFrame
function syncPdfViewer(pageNum) {
  const adjustedPage = pageNum + state.pdfOffset;
  // Append a query param ?p=N to force the iframe to reload and scroll to #page=N
  pdfFrame.src = `${withQueryParam(getMediaUrl(state.activeBook.pdfFile), 'p', adjustedPage)}#page=${adjustedPage}`;
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
    localStorage.removeItem(`ielts_listening_progress_${state.activeBookId}`);
    if (state.activeBookId === 'basic-ielts') {
      localStorage.removeItem('ielts_listening_progress');
    }
    state.progress = {};
    saveProgress();
    if (state.tracks.length > 0) {
      selectTrack(state.tracks[0], false);
    }
    showToast(t('toast_progress_reset'), "danger");
    settingsModal.classList.remove('active');
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Nickname restoration from server
  window.addEventListener('nickname-restored', (e) => {
    if (settingNickname) {
      settingNickname.value = e.detail;
    }
  });

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
    if (state.currentTrack && state.currentTrack.trackNum !== lastLoggedTrackNum) {
      logTrackPlay(state.currentTrack.trackNum, state.currentTrack.title);
      lastLoggedTrackNum = state.currentTrack.trackNum;
    }
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
  progressSlider.addEventListener('pointerdown', (e) => {
    progressSlider.setPointerCapture(e.pointerId);
    
    const rect = progressSlider.getBoundingClientRect();
    const seekHandler = (moveEvent) => {
      const x = Math.max(0, Math.min(rect.width, moveEvent.clientX - rect.left));
      const pct = x / rect.width;
      audio.currentTime = pct * (audio.duration || 0);
    };
    
    seekHandler(e);
    
    const onPointerMove = (moveEvent) => {
      seekHandler(moveEvent);
    };
    
    const onPointerUp = () => {
      progressSlider.releasePointerCapture(e.pointerId);
      progressSlider.removeEventListener('pointermove', onPointerMove);
      progressSlider.removeEventListener('pointerup', onPointerUp);
      progressSlider.removeEventListener('pointercancel', onPointerUp);
    };
    
    progressSlider.addEventListener('pointermove', onPointerMove);
    progressSlider.addEventListener('pointerup', onPointerUp);
    progressSlider.addEventListener('pointercancel', onPointerUp);
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
    const willOpen = !speedDropdown?.classList.contains('active');
    setSpeedMenuOpen(willOpen, 'ielts');
  });

  document.querySelectorAll('.speed-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const speed = parseFloat(opt.dataset.speed);
      state.playbackSpeed = speed;
      audio.playbackRate = speed;
      btnSpeedSelect.textContent = `${speed.toFixed(1)}x`;
      
      document.querySelectorAll('.speed-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      setSpeedMenuOpen(false);
      
      const speedText = state.language === 'en' ? `Playback speed: ${speed}x` : `Ijro tezligi: ${speed}x`;
      showToast(speedText, "violet");
    });
  });

  document.addEventListener('click', () => {
    setSpeedMenuOpen(false);
  });

  // A-B repeat toggle
  btnAbLoop.addEventListener('click', handleAbLoop);

  if (landingStartBtn) {
    landingStartBtn.addEventListener('click', openPracticeWorkspace);
  }

  if (landingPreviewBtn) {
    landingPreviewBtn.addEventListener('click', openPracticeWorkspace);
  }

  if (installToggle) {
    installToggle.addEventListener('click', handleInstallClick);
  }

  if (landingInstallBtn) {
    landingInstallBtn.addEventListener('click', handleInstallClick);
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallButtons();
    showToast(t('install_ready'), "cyan");
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    updateInstallButtons();
    showToast(t('install_done'), "success");
  });

  updateInstallButtons();

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

  // Menu dropdown toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      setSpeedMenuOpen(false);
      const willOpen = !menuDropdownContent?.classList.contains('active');
      setMenuOpen(willOpen);
    });
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', () => setMenuOpen(false));
  }

  // Inline Language Selector inside menu
  document.querySelectorAll('.lang-btn-inline').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent closing the menu immediately when selecting language
      const lang = btn.dataset.lang;
      state.language = lang;
      localStorage.setItem('ielts_lang', lang);
      updateLanguageUI();
      renderPlaylist();
      updateStatsDashboard();
      
      const langChangeText = state.language === 'en' ? "Language changed to English!" : "Til o'zbekchaga o'zgartirildi!";
      showToast(langChangeText, "cyan");
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      menuDropdownContent?.classList.contains('active') &&
      !menuDropdownContent.contains(e.target) &&
      e.target !== menuBackdrop &&
      e.target !== menuToggle &&
      !menuToggle?.contains(e.target)
    ) {
      setMenuOpen(false);
    }
  });

  // Close menu when an action button inside the menu is clicked
  document.querySelectorAll('.menu-item-btn').forEach(btn => {
    btn.addEventListener('click', () => setMenuOpen(false));
  });

  // Settings Panel Toggles
  settingsToggle.addEventListener('click', () => {
    settingsModal.classList.add('active');
  });

  if (tutorialToggle) {
    tutorialToggle.addEventListener('click', startTour);
  }

  tourClose.addEventListener('click', endTour);
  tourShade.addEventListener('click', endTour);

  tourPrev.addEventListener('click', previousTourStep);
  tourNext.addEventListener('click', nextTourStep);
  window.addEventListener('resize', () => {
    if (tourPopover.classList.contains('active') && highlightedTourElement) {
      positionTourPopover(highlightedTourElement);
    }
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

  if (floatingCodeBtn) {
    floatingCodeBtn.addEventListener('click', () => {
      aboutAppModal.classList.add('active');
    });
  }

  if (btnCloseAboutApp) {
    btnCloseAboutApp.addEventListener('click', () => {
      aboutAppModal.classList.remove('active');
    });
  }

  // Stats button opens dedicated stats page
  if (btnStatsToggle) {
    btnStatsToggle.addEventListener('click', () => {
      window.open('/stats.html', '_blank');
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
    localStorage.setItem(`ielts_pdf_offset_${state.activeBookId}`, state.pdfOffset);
    if (state.activeBookId === 'basic-ielts') {
      localStorage.setItem('ielts_pdf_offset', state.pdfOffset);
    }
    
    settingsModal.classList.remove('active');
    showToast(t('toast_settings_applied'), "success");
  });

  btnResetData.addEventListener('click', resetLocalData);

  // Book Selection dropdown event listeners (header + mobile)
  syncBookSelects(state.activeBookId);
  const bookSelect = document.getElementById('book-select');
  if (bookSelect) {
    bookSelect.addEventListener('change', (e) => {
      switchBook(e.target.value);
    });
  }
  const mobileBookSelect = document.getElementById('mobile-book-select');
  if (mobileBookSelect) {
    mobileBookSelect.addEventListener('change', (e) => {
      switchBook(e.target.value);
    });
  }

  // Dictation logic
  dictationText.addEventListener('input', () => {
    updateTextCounts();
    // Auto save text to state
    if (state.currentTrack) {
      state.progress[state.currentTrack.trackNum].dictation = dictationText.value;
      localStorage.setItem(`ielts_listening_progress_${state.activeBookId}`, JSON.stringify(state.progress));
    }
  });

  btnSaveDictation.addEventListener('click', () => {
    if (state.currentTrack) {
      state.progress[state.currentTrack.trackNum].dictation = dictationText.value;
      state.progress[state.currentTrack.trackNum].status = 'in-progress';
      saveProgress(false); // save without re-rendering playlist to preserve scroll
      showToast(t('toast_dictation_saved'), "success");
      logDictationSave(state.currentTrack.trackNum);
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
      logNoteSave(state.currentTrack.trackNum);
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
    if (tourPopover.classList.contains('active')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        endTour();
      }
      return;
    }

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
