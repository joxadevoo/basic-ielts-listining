export function getTashkentDateString(offsetDays = 0) {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const tzDate = new Date(utc + (3600000 * 5));
  if (offsetDays !== 0) {
    tzDate.setDate(tzDate.getDate() - offsetDays);
  }
  return tzDate.toISOString().split('T')[0];
}

export function recomputeDerivedFields(stats) {
  const uniqueFingerprints = new Set();
  let legacyUniques = 0;
  const activeFingerprints = new Set();
  let legacyActive = 0;

  const thirtyDaysAgoStr = getTashkentDateString(30);
  const deviceTypes = {};
  const osBrowsers = {};

  if (stats.users) {
    for (const uData of Object.values(stats.users)) {
      if (uData.fp || uData.fingerprint) {
        uniqueFingerprints.add(uData.fp || uData.fingerprint);
      } else {
        legacyUniques += 1;
      }

      const lastAct = uData.la || uData.lastActive;
      if (lastAct && lastAct >= thirtyDaysAgoStr) {
        if (uData.fp || uData.fingerprint) {
          activeFingerprints.add(uData.fp || uData.fingerprint);
        } else {
          legacyActive += 1;
        }
      }

      const dt = uData.dt || uData.deviceType || 'Unknown';
      deviceTypes[dt] = (deviceTypes[dt] || 0) + 1;

      const db = uData.d || uData.device || 'Unknown';
      osBrowsers[db] = (osBrowsers[db] || 0) + 1;
    }
  }

  stats.totalUnique = uniqueFingerprints.size + legacyUniques;
  stats.monthlyActive = activeFingerprints.size + legacyActive;
  stats.deviceTypes = deviceTypes;
  stats.osBrowsers = osBrowsers;

  return stats;
}

export function computePublicMetrics(stats) {
  const todayStr = getTashkentDateString(0);
  const sevenDaysAgoStr = getTashkentDateString(7);
  const thirtyDaysAgoStr = getTashkentDateString(30);

  const dailySet = new Set();
  const weeklySet = new Set();
  const monthlySet = new Set();
  const deviceTypes = {};

  if (stats?.users) {
    for (const uData of Object.values(stats.users)) {
      const lastAct = uData.la || uData.lastActive;
      const fp = uData.fp || uData.fingerprint;

      if (lastAct && fp) {
        if (lastAct === todayStr) dailySet.add(fp);
        if (lastAct >= sevenDaysAgoStr) weeklySet.add(fp);
        if (lastAct >= thirtyDaysAgoStr) monthlySet.add(fp);
      }

      const dt = uData.dt || uData.deviceType || 'Unknown';
      deviceTypes[dt] = (deviceTypes[dt] || 0) + 1;
    }
  }

  return {
    totalUnique: stats?.totalUnique || 0,
    totalVisits: stats?.totalVisits || 0,
    dailyActive: dailySet.size,
    weeklyActive: weeklySet.size,
    monthlyActive: monthlySet.size,
    deviceTypes,
  };
}

export function buildPinnedSummaryText(stats) {
  const deviceTypes = stats.deviceTypes || {};
  const osBrowsers = stats.osBrowsers || {};
  const monthlyActive = stats.monthlyActive || 0;

  let deviceBreakdown = '';
  for (const [dt, count] of Object.entries(deviceTypes).sort((a, b) => b[1] - a[1])) {
    const emoji = dt === 'Kompyuter' ? '💻' : dt === 'Telefon' ? '📱' : '📟';
    deviceBreakdown += `  ${emoji} ${dt}: ${count}\n`;
  }

  let browserBreakdown = '';
  for (const [db, count] of Object.entries(osBrowsers).sort((a, b) => b[1] - a[1]).slice(0, 5)) {
    browserBreakdown += `  🌐 ${db}: ${count}\n`;
  }

  let statsText = '📌 <b>FluentEar Statistikasi</b>\n\n'
    + `👥 <b>Unikal foydalanuvchilar:</b> ${stats.totalUnique || 0} ta\n`
    + `📈 <b>Jami kirishlar:</b> ${stats.totalVisits || 0} marta\n`
    + `📅 <b>Oylik faol (MAU):</b> ${monthlyActive} ta\n\n`
    + `📊 <b>Qurilma turlari:</b>\n${deviceBreakdown}\n`
    + `🖥️ <b>Tizimlar:</b>\n${browserBreakdown}`;

  statsText += `\n🕒 <b>Yangilangan:</b> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`;
  return statsText;
}

export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} soat ${m} daqiqa`;
  return `${m} daqiqa`;
}

export function buildStatsReportText(stats) {
  const monthlyActive = stats.monthlyActive || 0;
  return `📊 <b>TinglangApp Foydalanish Statistikasi</b>\n\n`
    + `👥 <b>Jami unikal qurilmalar:</b> <code>${stats.totalUnique || 0}</code> ta\n`
    + `📈 <b>Jami kirishlar soni:</b> <code>${stats.totalVisits || 0}</code> marta\n`
    + `📅 <b>Oylik faol foydalanuvchilar (MAU):</b> <code>${monthlyActive}</code> ta\n`;
}

export function buildUsersReportText(stats) {
  let reportText = '👥 <b>TinglangApp Foydalanuvchilar Ro\'yxati</b>\n\n';
  const sortedUsers = Object.entries(stats.users || {}).sort(
    (a, b) => (b[1].v || b[1].totalVisits || 0) - (a[1].v || a[1].totalVisits || 0),
  );

  sortedUsers.forEach(([name, uData], index) => {
    const deviceStr = uData.dt
      ? `${uData.dt} (${uData.d || "Noma'lum"})`
      : (uData.d || uData.device || "Noma'lum");
    const visits = uData.v || uData.totalVisits || 0;
    const lastActive = uData.la || uData.lastActive || '—';

    reportText += `${index + 1}. 👤 <b>${name}</b>\n`
      + `   • Qurilma: <code>${deviceStr}</code>\n`
      + `   • Jami kirishlar: <b>${visits}</b> marta\n`
      + `   • Oxirgi faollik: <code>${lastActive}</code>\n\n`;
  });

  if (sortedUsers.length === 0) {
    reportText += '<i>Hozircha foydalanuvchilar faolligi qayd etilmagan.</i>';
  }

  return reportText;
}