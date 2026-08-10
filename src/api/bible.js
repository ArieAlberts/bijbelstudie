/**
 * Bible Passage API Client Module
 * Provides API calls for fetching Bible passages and lexicon entries.
 */

export async function fetchBiblePassage(studyId, section) {
  const basePrefix = (typeof window !== 'undefined' && (window.location.pathname.includes('/nl/') || window.location.pathname.includes('/en/'))) ? '../' : './';

  const candidateUrls = [
    `${basePrefix}data/bible/${studyId}-${section}.json`,
    `/data/bible/${studyId}-${section}.json`,
    `./data/bible/${studyId}-${section}.json`,
    `../data/bible/${studyId}-${section}.json`
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
  }

  throw new Error(`Bible passage API call failed for study '${studyId}', section '${section}'.`);
}

export async function fetchPassagesIndex() {
  const basePrefix = (typeof window !== 'undefined' && (window.location.pathname.includes('/nl/') || window.location.pathname.includes('/en/'))) ? '../' : './';

  const candidateUrls = [
    `${basePrefix}data/passages.json`,
    `/data/passages.json`,
    `./data/passages.json`,
    `../data/passages.json`
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
  }

  throw new Error('Passages index API call failed.');
}
