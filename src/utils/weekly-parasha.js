// One calendar rule for the static SEO pages and the interactive reader.
// The weekly reading is editorially assigned to its actual Shabbat date
// (diaspora reading cycle), never inferred from when the article was published.
export function upcomingShabbatIso(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now).filter(p => p.type !== 'literal').map(p => [p.type, Number(p.value)]));
  const day = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12));
  day.setUTCDate(day.getUTCDate() + ((6 - day.getUTCDay() + 7) % 7));
  return day.toISOString().slice(0, 10);
}

export function findScheduledStudy(studies, now = new Date(), getStudy = entry => entry) {
  const shabbat = upcomingShabbatIso(now);
  return (studies || []).find(entry => {
    const date = getStudy(entry)?.shabbat_date;
    return date && String(date).slice(0, 10) === shabbat;
  }) || null;
}
