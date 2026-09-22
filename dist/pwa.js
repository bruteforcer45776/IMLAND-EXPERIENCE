if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.warn('Service worker IMLAND non registrato:', error);
    });
  });
}

let deferredInstallPrompt=null;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;document.querySelectorAll('[data-pwa-install]').forEach(button=>button.disabled=false)});
document.addEventListener('click',async event=>{const button=event.target.closest('[data-pwa-install]');if(!button)return;const status=document.querySelector('.download-status');if(!deferredInstallPrompt){if(status)status.textContent='Dal menu del browser scegli “Installa app” o “Aggiungi alla schermata Home”.';return}await deferredInstallPrompt.prompt();const choice=await deferredInstallPrompt.userChoice;if(status)status.textContent=choice.outcome==='accepted'?'Installazione avviata.':'Installazione non completata.';deferredInstallPrompt=null});
