// Inserire esclusivamente endpoint HTTPS che accettano POST JSON.
window.IMLAND_FORM_ENDPOINTS = Object.assign({
  newsletter: 'https://wfevttxbbhihapgmcbgh.supabase.co/functions/v1/subscribe-newsletter',
  contact: 'https://wfevttxbbhihapgmcbgh.supabase.co/functions/v1/submit-contact'
}, window.IMLAND_FORM_ENDPOINTS || {});
