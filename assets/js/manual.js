(()=>{
 const sessionMemory = new Map();
 const safeSession = {
  setItem(key, value) {
   const stringValue = String(value);
   try {
    window.sessionStorage.setItem(key, stringValue);
    sessionMemory.delete(key);
   } catch (_) {
    sessionMemory.set(key, stringValue);
   }
  }
 };
 const isEn = document.documentElement.lang === 'en';
 const p = new URLSearchParams(location.search), step = p.get('stap'), route = p.get('route') || 'week', back = document.getElementById('context-back');
 if (step && back) {
  back.hidden = false;
  back.href = route === 'quick' ? `index.html#snel-${step}` : `index.html#stap-${step}`;
  back.textContent = isEn ?
   (route === 'quick' ? `Back to quick step ${step}` : `Back to step ${step}`) :
   (route === 'quick' ? `Terug naar snelle stap ${step}` : `Terug naar stap ${step}`);
 }
 document.querySelectorAll('.manual-actions a').forEach(a => a.addEventListener('click', () => safeSession.setItem('lastManual', location.pathname + location.search + location.hash)));
})();
