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

// js-yaml parses unquoted YYYY-MM-DD values as Date objects; the manifest
// serializes those dates to ISO strings. Handle both representations.
export function toIsoDate(value) {
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value.toISOString().slice(0, 10) : null;
  return String(value ?? '').match(/^\d{4}-\d{2}-\d{2}/)?.[0] || null;
}

export function findScheduledStudy(studies, now = new Date(), getStudy = entry => entry) {
  const shabbat = upcomingShabbatIso(now);
  return (studies || []).find(entry => {
    return toIsoDate(getStudy(entry)?.shabbat_date) === shabbat;
  }) || null;
}
