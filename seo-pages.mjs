import { readFile, writeFile } from 'node:fs/promises';

const pages = {
  'index.html': ['/', 'IMLAND Experience — Radio, podcast, eventi e territorio', 'IMLAND Experience dà voce a imprese, persone ed eccellenze del territorio attraverso radio, podcast, eventi, news e una rete di Member.'],
  'il-progetto.html': ['/il-progetto', 'Il Progetto — IMLAND Experience', 'Scopri il progetto IMLAND Experience: radio, contenuti, eventi e relazioni per valorizzare il Piemonte nord-orientale.'],
  'radio.html': ['/radio', 'IMLAND Radio — La radio del territorio', 'Ascolta IMLAND Radio in diretta e scopri programmi, speaker, musica, interviste e storie del territorio.'],
  'podcast.html': ['/podcast', 'Podcast — IMLAND Experience', 'Ascolta i podcast originali IMLAND e tutti gli episodi aggiornati dai feed ufficiali.'],
  'my-podcast.html': ['/my-podcast', 'My Podcast — IMLAND Experience', 'Scopri i progetti My Podcast realizzati da IMLAND per aziende, eventi e realtà del territorio.'],
  'eventi.html': ['/eventi', 'Eventi — IMLAND Experience', 'Eventi, dirette radio, conduzione, DJ set e format IMLAND per aziende, enti e comunità del territorio.'],
  'member.html': ['/member', 'Member — La rete IMLAND Experience', 'Scopri la rete dei Member IMLAND: imprese e professionisti che creano connessioni e valore nel territorio.'],
  'news.html': ['/news', 'News del territorio — IMLAND Experience', 'Notizie, persone, imprese ed eventi dal Piemonte nord-orientale, con fonti sempre visibili.'],
  'news-member.html': ['/news-member', 'News dei Member — IMLAND Experience', 'Approfondimenti e aggiornamenti dalle imprese e dai professionisti della rete Member IMLAND.'],
  'contatti.html': ['/contatti', 'Contatti — IMLAND Experience', 'Contatta IMLAND per proporre una storia, un podcast, un evento, una partnership o entrare nella rete Member.'],
  'faq.html': ['/faq', 'Domande frequenti — IMLAND Experience', 'Risposte alle domande frequenti su IMLAND Radio, podcast, eventi, Member, news e collaborazioni.'],
  'download.html': ['/download', 'Scarica la Web App — IMLAND Experience', 'Installa la Web App IMLAND per ascoltare radio e podcast e seguire il territorio anche in mobilità.'],
  'brand.html': ['/brand', 'Brand IMLAND — Identità e valori', 'Scopri l’identità, i valori e il linguaggio visivo di IMLAND Experience.'],
  'partners.html': ['/partners', 'Partner — IMLAND Experience', 'Scopri le realtà che collaborano con IMLAND e sostengono le iniziative dedicate al territorio.'],
  'per-le-aziende.html': ['/per-le-aziende', 'Per le aziende — IMLAND Experience', 'Radio, podcast, eventi, contenuti e rete Member: scopri le opportunità IMLAND dedicate ad aziende e professionisti.'],
  'cerca.html': ['/cerca', 'Cerca — IMLAND Experience', 'Cerca pagine e contenuti nel sito IMLAND Experience.'],
  'auth.html': ['/auth', 'Area personale — IMLAND Experience', 'Accedi all’area personale della community IMLAND Experience.'],
  'aggiorna-password.html': ['/aggiorna-password', 'Reimposta password — IMLAND Experience', 'Imposta una nuova password per il tuo account IMLAND Experience.'],
  'privacy.html': ['/privacy', 'Privacy Policy — IMLAND Experience', 'Informativa sul trattamento dei dati personali del sito IMLAND Experience.'],
  'cookie.html': ['/cookie', 'Cookie Policy — IMLAND Experience', 'Informazioni sui cookie utilizzati dal sito IMLAND Experience.'],
  'termini.html': ['/termini', 'Termini e condizioni — IMLAND Experience', 'Termini e condizioni di utilizzo del sito IMLAND Experience.'],
  '404.html': ['/404', 'Pagina non trovata — IMLAND Experience', 'La pagina richiesta non è disponibile. Torna alla Home o visita le sezioni IMLAND.']
};

const origin = 'https://www.imlandradio.it';
const image = `${origin}/assets/logos/imland-experience.png`;
const escapeJson = value => JSON.stringify(value).replace(/</g, '\\u003c');

for (const [file, [path, title, description]] of Object.entries(pages)) {
  let html = await readFile(file, 'utf8');
  html = html.replace(/<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/g, '');
  html = html.replace(/<meta\s+name=["']robots["'][^>]*>/gi, '');
  html = html.replace(/<link\s+rel=["']manifest["'][^>]*>/gi, '');
  html = html.replace(/<script\s+src=["'](?:form-config\.js|forms\.js|pwa\.js)["']><\/script>/gi, '');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${description}">`);
  } else {
    html = html.replace('</title>', `</title><meta name="description" content="${description}">`);
  }
  const canonical = `${origin}${path}`;
  const structured = {
    '@context': 'https://schema.org',
    '@type': path === '/' ? 'WebSite' : 'WebPage',
    name: title,
    description,
    url: canonical,
    inLanguage: 'it-IT',
    publisher: {
      '@type': 'Organization',
      name: 'IMLAND Experience',
      url: origin,
      logo: { '@type': 'ImageObject', url: image }
    }
  };
  const noindex = ['404.html', 'auth.html', 'aggiorna-password.html', 'cerca.html', 'news-member.html'].includes(file);
  const seo = `<!-- SEO:START -->\n<link rel="canonical" href="${canonical}">\n<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">\n<meta property="og:type" content="website">\n<meta property="og:locale" content="it_IT">\n<meta property="og:site_name" content="IMLAND Experience">\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${description}">\n<meta property="og:url" content="${canonical}">\n<meta property="og:image" content="${image}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${title}">\n<meta name="twitter:description" content="${description}">\n<meta name="twitter:image" content="${image}">\n<meta name="theme-color" content="#ffffff">\n<link rel="manifest" href="/manifest.webmanifest">\n<script type="application/ld+json">${escapeJson(structured)}</script>\n<!-- SEO:END -->`;
  html = html.replace('</head>', `${seo}\n</head>`);
  const supportScripts = [
    ['form-config.js', '<script src="form-config.js"></script>'],
    ['forms.js', '<script src="forms.js"></script>'],
    ['pwa.js', '<script src="pwa.js"></script>']
  ];
  for (const [name, tag] of supportScripts) {
    if (!html.includes(`src="${name}"`)) html = html.replace('</body>', `${tag}\n</body>`);
  }
  await writeFile(file, html, 'utf8');
}

console.log(`SEO/PWA applicati a ${Object.keys(pages).length} pagine.`);
