// Notify IndexNow (Bing, and through it ChatGPT search; also Yandex, Seznam, Naver)
// of every URL in the live sitemap. Runs after deploy; never fails the workflow.
const site = 'https://www.parasja.nl';
const key = 'e0995e195501bfb5d3b5908638a230f0';

try {
  const sitemap = await (await fetch(site + '/sitemap.xml')).text();
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  if (!urlList.length) throw new Error('no URLs in live sitemap');
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList })
  });
  console.log(`IndexNow: submitted ${urlList.length} URLs, HTTP ${res.status}`);
} catch (err) {
  console.warn('IndexNow submission skipped:', err.message);
}
