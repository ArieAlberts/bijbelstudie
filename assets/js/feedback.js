(()=>{
  const lang = document.documentElement.lang === 'en' ? 'en' : 'nl';
  const copy = lang === 'en' ? {
    "feedbackPage": "contact.html",
    "yes": "Yes",
    "notYet": "Not yet",
    "readFirst": "Read the corresponding explanation in the handbook and then return to the text.",
    "openManual": "Open the handbook",
    "confirmRead": "I have read the explanation and returned to the text.",
    "afterQuestion": "Were you able to continue after reading the explanation?",
    "nowYes": "Yes, now I am",
    "stillNo": "No, not yet",
    "detail": "What remained unclear?",
    "optional": "optional",
    "send": "Save short feedback",
    "sending": "Sending…",
    "thanks": "Thank you. Your feedback helps us improve the explanation.",
    "resolved": "Great. The handbook helped you move forward.",
    "error": "Sending failed. You can try again later.",
    "contactIntro": "You have worked on this section, read the explanation, and returned to the text. You can now use the contact form for a specific question.",
    "contact": "Use the contact form",
    "stepQuestion": "Were you able to proceed with this section?",
    "chapterQuestion": "Were you able to proceed after this explanation?",
    "chapterNoIntro": "You have read the explanation but cannot move forward yet. You can use the contact form for a specific question.",
    "stepWord": "Section"
  } : {
    "feedbackPage": "contact.html",
    "yes": "Ja",
    "notYet": "Nog niet",
    "readFirst": "Lees de bijbehorende uitleg in de handleiding en keer daarna terug naar de tekst.",
    "openManual": "Open de uitleg",
    "confirmRead": "Ik heb de uitleg gelezen en ben opnieuw naar de tekst teruggegaan.",
    "afterQuestion": "Kon je na het lezen van de uitleg wel verder?",
    "nowYes": "Ja, nu wel",
    "stillNo": "Nee, nog niet",
    "detail": "Wat bleef nog onduidelijk?",
    "optional": "optioneel",
    "send": "Korte feedback bewaren",
    "sending": "Wordt verstuurd…",
    "thanks": "Dank je. Je reactie helpt om de uitleg gerichter te verbeteren.",
    "resolved": "Mooi. De handleiding hielp je om verder te gaan.",
    "error": "Het versturen lukte niet. Je kunt het later opnieuw proberen.",
    "contactIntro": "Je bent met dit onderdeel bezig geweest, hebt de uitleg gelezen en bent opnieuw naar de tekst teruggegaan. Je kunt nu het contactformulier gebruiken voor een concrete vraag.",
    "contact": "Gebruik het contactformulier",
    "stepQuestion": "Kon je met dit onderdeel verder?",
    "chapterQuestion": "Kon je na deze uitleg verder?",
    "chapterNoIntro": "Je hebt de uitleg gelezen maar komt nog niet verder. Je kunt het contactformulier gebruiken voor een concrete vraag.",
    "stepWord": "Onderdeel"
  };

  const version = '1.3';
  const sessionMemory = new Map();
  const safeSession = {
    getItem(key) { try { const value = window.sessionStorage.getItem(key); return value === null && sessionMemory.has(key) ? sessionMemory.get(key) : value; } catch (_) { return sessionMemory.has(key) ? sessionMemory.get(key) : null; } },
    setItem(key, value) { const stringValue = String(value); try { window.sessionStorage.setItem(key, stringValue); sessionMemory.delete(key); } catch (_) { sessionMemory.set(key, stringValue); } },
    removeItem(key) { try { window.sessionStorage.removeItem(key); } catch (_) {} sessionMemory.delete(key); }
  };

  function helpUrl(type, id, title, extra = {}) {
    const params = new URLSearchParams({ context: `${type}-${id}`, title: title || '', from: location.pathname + location.hash, ...extra });
    return `${copy.feedbackPage}?${params.toString()}`;
  }

  async function postQuick(payload) {
    const body = new URLSearchParams({
      'form-name': 'quick-feedback',
      'bot-field': '',
      language: lang,
      source_type: payload.type,
      source_id: String(payload.id),
      source_title: payload.title,
      rating: payload.rating,
      comment: payload.comment || '',
      page_url: location.href,
      version,
      submitted_at: new Date().toISOString()
    });
    const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  }

  function createStepWidget({ type, id, title, manualHref }) {
    const box = document.createElement('div');
    box.className = 'quick-feedback-box';
    box.dataset.feedbackWidget = 'true';
    box.innerHTML = `<div class="quick-feedback-head"><strong>${copy.stepQuestion}</strong><div class="quick-feedback-actions"><button type="button" data-initial="yes">${copy.yes}</button><button type="button" data-initial="no">${copy.notYet}</button></div></div>
    <div class="feedback-manual-stage" hidden><p>${copy.readFirst}</p><a class="step-help feedback-manual-link" href="${manualHref}">${copy.openManual}</a><label class="feedback-read-check"><input type="checkbox"> <span>${copy.confirmRead}</span></label><div class="feedback-after-question" hidden><strong>${copy.afterQuestion}</strong><div class="quick-feedback-actions"><button type="button" data-after="yes">${copy.nowYes}</button><button type="button" data-after="no">${copy.stillNo}</button></div></div></div>
    <div class="quick-feedback-detail" hidden><label>${copy.detail} <span>(${copy.optional})</span><textarea maxlength="1000" rows="3"></textarea></label><button type="button" class="feedback-send">${copy.send}</button></div>
    <div class="feedback-contact-stage" hidden><p>${copy.contactIntro}</p><a class="feedback-contact-link" href="${helpUrl(type, id, title, { manual_read: 'yes', resolved_after_manual: 'no' })}">${copy.contact} →</a></div><div class="feedback-status" role="status" aria-live="polite"></div>`;

    const status = box.querySelector('.feedback-status'), manual = box.querySelector('.feedback-manual-stage'), read = box.querySelector('.feedback-read-check input'), after = box.querySelector('.feedback-after-question'), detail = box.querySelector('.quick-feedback-detail'), contact = box.querySelector('.feedback-contact-stage'), textarea = box.querySelector('textarea');
    const manualKey = `manual-opened-${type}-${id}`;
    let pending = '';

    if (safeSession.getItem(manualKey) === 'yes') {
      box.querySelector('.quick-feedback-head').hidden = true;
      manual.hidden = false;
      read.checked = true;
      after.hidden = false;
    }

    async function submit(rating, comment = '') {
      try {
        status.textContent = copy.sending;
        await postQuick({ type, id, title, rating, comment });
        status.textContent = rating === 'completed_after_manual' ? copy.resolved : copy.thanks;
      } catch (e) {
        status.textContent = copy.error;
        status.classList.add('feedback-error');
      }
    }

    box.querySelector('[data-initial="yes"]').addEventListener('click', () => { submit('completed_without_manual'); box.querySelector('.quick-feedback-head').hidden = true; });
    box.querySelector('[data-initial="no"]').addEventListener('click', () => { submit('not_completed_initially'); manual.hidden = false; box.querySelector('.quick-feedback-head').hidden = true; });
    box.querySelector('.feedback-manual-link').addEventListener('click', () => safeSession.setItem(manualKey, 'yes'));
    read.addEventListener('change', () => { after.hidden = !read.checked; });
    box.querySelector('[data-after="yes"]').addEventListener('click', () => { submit('completed_after_manual'); safeSession.removeItem(manualKey); manual.hidden = true; contact.hidden = true; });
    box.querySelector('[data-after="no"]').addEventListener('click', () => { pending = 'not_completed_after_manual'; detail.hidden = false; contact.hidden = false; after.hidden = true; });
    box.querySelector('.feedback-send').addEventListener('click', () => { submit(pending || 'not_completed_after_manual', textarea.value.trim()); detail.hidden = true; });
    return box;
  }

  function createChapterWidget({ id, title }) {
    const box = document.createElement('div');
    box.className = 'quick-feedback-box';
    box.dataset.feedbackWidget = 'true';
    box.innerHTML = `<div class="quick-feedback-head"><strong>${copy.chapterQuestion}</strong><div class="quick-feedback-actions"><button type="button" data-chapter="yes">${copy.yes}</button><button type="button" data-chapter="no">${copy.stillNo}</button></div></div><div class="quick-feedback-detail" hidden><label>${copy.detail} <span>(${copy.optional})</span><textarea maxlength="1000" rows="3"></textarea></label><button type="button" class="feedback-send">${copy.send}</button></div><div class="feedback-contact-stage" hidden><p>${copy.chapterNoIntro}</p><a class="feedback-contact-link" href="${helpUrl('chapter', id, title, { manual_read: 'yes', resolved_after_manual: 'no' })}">${copy.contact} →</a></div><div class="feedback-status" role="status" aria-live="polite"></div>`;
    const status = box.querySelector('.feedback-status'), detail = box.querySelector('.quick-feedback-detail'), contact = box.querySelector('.feedback-contact-stage'), textarea = box.querySelector('textarea');

    async function submit(rating, comment = '') {
      try {
        status.textContent = copy.sending;
        await postQuick({ type: 'chapter', id, title, rating, comment });
        status.textContent = copy.thanks;
      } catch (e) {
        status.textContent = copy.error;
      }
    }

    box.querySelector('[data-chapter="yes"]').addEventListener('click', () => { submit('manual_helped'); box.querySelector('.quick-feedback-head').hidden = true; });
    box.querySelector('[data-chapter="no"]').addEventListener('click', () => { detail.hidden = false; contact.hidden = false; box.querySelector('.quick-feedback-head').hidden = true; });
    box.querySelector('.feedback-send').addEventListener('click', () => { submit('manual_did_not_help', textarea.value.trim()); detail.hidden = true; });
    return box;
  }

  document.querySelectorAll('.study-card[data-step],.study-card[data-quick-step]').forEach(card => {
    if (card.querySelector('[data-feedback-widget]')) return;
    const id = card.dataset.step || card.dataset.quickStep;
    const title = card.querySelector('.step-title')?.textContent.trim() || `${copy.stepWord} ${id}`;
    const type = card.dataset.quickStep ? 'quick-step' : 'step';
    const manualHref = card.querySelector('.step-help')?.getAttribute('href') || (lang === 'en' ? 'handbook.html' : 'handleiding.html');
    card.append(createStepWidget({ type, id, title, manualHref }));
  });

  const manual = document.querySelector('.manual-content');
  if (manual) {
    const headings = [...manual.querySelectorAll(':scope > h1')], chapters = headings.filter(h => /^hoofdstuk-\d+$/.test(h.id));
    chapters.forEach(h => {
      const id = h.id.replace('hoofdstuk-', ''), title = h.textContent.trim(), pos = headings.indexOf(h), next = headings[pos + 1] || null, widget = createChapterWidget({ id, title });
      if (next) manual.insertBefore(widget, next); else manual.append(widget);
    });
  }

  const form = document.querySelector('.serious-help-form');
  if (form) {
    const params = new URLSearchParams(location.search), context = params.get('context') || '', title = params.get('title') || '', manualRead = params.get('manual_read') || '', resolved = params.get('resolved_after_manual') || '';
    form.querySelector('[name="source_context"]')?.setAttribute('value', [context, title].filter(Boolean).join(' · '));
    form.querySelector('[name="page_url"]')?.setAttribute('value', location.href);
    form.querySelector('[name="manual_read"]')?.setAttribute('value', manualRead);
    form.querySelector('[name="resolved_after_manual"]')?.setAttribute('value', resolved);
    const chip = document.querySelector('[data-context-chip]');
    if (chip && (context || title)) { chip.hidden = false; chip.textContent = title || context; }
    const confirm = form.querySelector('[data-manual-confirm]');
    if (confirm && manualRead === 'yes') confirm.checked = true;
    const kind = form.querySelector('[name="soort"]'), name = form.querySelector('[name="naam"]'), email = form.querySelector('[name="email"]'), tried = form.querySelector('[name="wat_heb_je_al_geprobeerd"]'), req = document.querySelector('[data-help-requirement]');
    function update() {
      const serious = ['persoonlijke-hulp', 'inhoudelijke-vraag', 'personal-help', 'content-question'].includes(kind?.value), contactPage = form.dataset.contactPage === 'true';
      if (name) name.required = contactPage || serious;
      if (email) email.required = contactPage || serious;
      [tried, confirm].forEach(el => { if (el) el.required = serious; });
      if (req) req.hidden = !serious;
    }
    kind?.addEventListener('change', update);
    update();
  }
})();
