(() => {
  const endpoints = window.IMLAND_FORM_ENDPOINTS || {};
  const setState = (form, message, state = '') => {
    const status = form.querySelector('[role="status"]');
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  };

  const submitJson = async (endpoint, payload) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  };

  document.querySelectorAll('[data-newsletter-form],[data-contact-form]').forEach(form => {
    if (form.querySelector('[name="website"]')) return;
    const trap = document.createElement('input');
    trap.type = 'text';
    trap.name = 'website';
    trap.tabIndex = -1;
    trap.autocomplete = 'off';
    trap.setAttribute('aria-hidden', 'true');
    trap.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;opacity:0;pointer-events:none';
    form.appendChild(trap);
  });

  document.addEventListener('submit', async event => {
    const form = event.target;
    const isNewsletter = form.matches('[data-newsletter-form]');
    const isContact = form.matches('[data-contact-form]');
    if (!isNewsletter && !isContact) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    if (!form.reportValidity()) return;

    const submit = form.querySelector('[type="submit"]');
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    const consent = form.querySelector('input[type="checkbox"][required]');
    if (consent) payload.consent = consent.checked ? 'accepted' : '';
    const endpoint = isNewsletter ? endpoints.newsletter : endpoints.contact;

    if (!endpoint) {
      if (isNewsletter) {
        setState(form, 'Iscrizione non ancora attiva: manca il collegamento al servizio newsletter.', 'unavailable');
        return;
      }
      const subject = `IMLAND — ${payload.topic || 'Contatto dal sito'}`;
      const body = `Nome: ${payload.name || ''}\nEmail: ${payload.email || ''}\nArgomento: ${payload.topic || ''}\n\n${payload.message || ''}`;
      setState(form, 'Invio web non ancora attivo. Apro la tua applicazione email come alternativa.', 'fallback');
      location.href = `mailto:info@imlandradio.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    setState(form, 'Invio in corso…', 'loading');
    try {
      await submitJson(endpoint, { ...payload, form: isNewsletter ? 'newsletter' : 'contact', page: location.href });
      setState(form, isNewsletter ? 'Iscrizione ricevuta. Controlla la tua casella email.' : 'Messaggio inviato. Ti risponderemo appena possibile.', 'success');
      form.reset();
    } catch (error) {
      console.error('Invio modulo fallito:', error);
      setState(form, 'Invio non riuscito. Riprova oppure scrivi a info@imlandradio.com.', 'error');
    } finally {
      submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  }, true);
})();
