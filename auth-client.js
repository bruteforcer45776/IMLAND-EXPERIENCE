(() => {
  const config = window.IMLAND_AUTH_CONFIG;
  if (!config?.url || !config?.publishableKey) return;
  const storageKey = 'imland-auth-session';
  const headers = {'apikey': config.publishableKey, 'Content-Type': 'application/json'};
  const setStatus = (node, message, state = '') => { if (node) { node.textContent = message; node.dataset.state = state; } };
  const request = async (path, options = {}) => {
    const response = await fetch(config.url + path, {...options, headers: {...headers, ...(options.headers || {})}});
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.msg || data.error_description || data.message || 'Operazione non riuscita.');
    return data;
  };
  const saveSession = (data, persistent) => { const target = persistent ? localStorage : sessionStorage; target.setItem(storageKey, JSON.stringify(data)); (persistent ? sessionStorage : localStorage).removeItem(storageKey); };
  const readSession = () => { for (const target of [localStorage, sessionStorage]) { try { const value = JSON.parse(target.getItem(storageKey) || 'null'); if (value?.access_token) return value; } catch {} } return null; };
  const clearSession = () => { localStorage.removeItem(storageKey); sessionStorage.removeItem(storageKey); };
  const initAuth = () => {
    const form = document.querySelector('[data-auth-form]'); if (!form) return;
    const message = form.querySelector('.auth-status'), submit = form.querySelector('.auth-submit'), register = document.querySelector('.auth-register button');
    const heading = document.querySelector('#auth-title'), intro = document.querySelector('.auth-card header > span');
    const session = readSession(); let mode = 'login';
    if (session?.user?.email) {
      heading.textContent = 'Area personale.'; intro.textContent = 'Accesso effettuato come ' + session.user.email;
      form.innerHTML = '<button class="auth-submit" type="button" data-auth-logout>Esci</button><p class="auth-status" role="status" aria-live="polite"></p>';
      document.querySelector('.auth-providers')?.setAttribute('hidden',''); document.querySelector('.auth-divider')?.setAttribute('hidden',''); document.querySelector('.auth-register')?.setAttribute('hidden','');
      form.querySelector('[data-auth-logout]').addEventListener('click', async () => { try { await request('/auth/v1/logout',{method:'POST',headers:{Authorization:'Bearer '+session.access_token}}); } catch {} clearSession(); location.reload(); }); return;
    }
    form.addEventListener('submit', async event => {
      event.preventDefault(); event.stopImmediatePropagation(); if (!form.reportValidity()) return;
      const email=form.elements.email.value.trim(), password=form.elements.password.value; submit.disabled=true; setStatus(message,mode==='login'?'Accesso in corso…':'Creazione account…','loading');
      try {
        if (mode==='register') { const data=await request('/auth/v1/signup',{method:'POST',body:JSON.stringify({email,password,data:{source:'imland-web'},email_redirect_to:location.origin+'/auth'})}); if(data.access_token)saveSession(data,form.elements.remember?.checked!==false); setStatus(message,data.access_token?'Account creato. Accesso effettuato.':'Account creato. Controlla la tua email per confermare l’indirizzo.','success'); }
        else { const data=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})}); saveSession(data,form.elements.remember?.checked!==false); setStatus(message,'Accesso effettuato.','success'); setTimeout(()=>location.reload(),500); }
      } catch(error) { setStatus(message,error.message,'error'); } finally { submit.disabled=false; }
    },true);
    register?.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();mode=mode==='login'?'register':'login';heading.textContent=mode==='login'?'Bentornato.':'Entra nella community.';intro.textContent=mode==='login'?'Accedi allo spazio personale dedicato alla community IMLAND.':'Crea il tuo account con email e password.';submit.textContent=mode==='login'?'Accedi':'Registrati';register.textContent=mode==='login'?'Registrati':'Hai già un account? Accedi';setStatus(message,'');},true);
  };
  const initReset = () => {
    const form=document.querySelector('[data-approved-form="password"]'); if(!form)return; const message=form.querySelector('[role="status"]'); const token=new URLSearchParams(location.hash.slice(1)).get('access_token');
    if(token){form.querySelector('label span').textContent='Nuova password';const input=form.querySelector('input');input.type='password';input.name='password';input.autocomplete='new-password';input.minLength=8;form.querySelector('button').textContent='Aggiorna password';}
    form.addEventListener('submit',async event=>{event.preventDefault();event.stopImmediatePropagation();if(!form.reportValidity())return;const button=form.querySelector('button');button.disabled=true;try{if(token){await request('/auth/v1/user',{method:'PUT',headers:{Authorization:'Bearer '+token},body:JSON.stringify({password:form.elements.password.value})});setStatus(message,'Password aggiornata. Ora puoi accedere.','success');}else{await request('/auth/v1/recover',{method:'POST',body:JSON.stringify({email:form.elements.email.value.trim(),redirect_to:location.origin+'/aggiorna-password'})});setStatus(message,'Controlla la tua email per reimpostare la password.','success');}}catch(error){setStatus(message,error.message,'error');}finally{button.disabled=false;}},true);
  };
  const init=()=>{initAuth();initReset()}; document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
