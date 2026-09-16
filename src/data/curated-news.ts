export type CuratedNewsItem = {
  title: string;
  summary: string;
  source: "ANSA Piemonte" | "NewsBiella" | "La Stampa";
  publishedAt: string;
  category: string;
  province: string;
  url: string;
  image: string;
};

/**
 * Rassegna verificata il 16 settembre 2026 sulle pagine originali delle testate.
 * Gli URL immagine sono le anteprime Open Graph dichiarate dalle rispettive pagine:
 * restano remote, attribuite e collegate all'articolo originale; nessun asset editoriale
 * viene copiato o presentato come proprietà di IMLAND.
 */
export const curatedNews: CuratedNewsItem[] = [
  {
    title: "Raddoppio del Tunnel del Monte Bianco, Cirio incontra la presidente Rini",
    summary: "Aggiornamento istituzionale sul dossier del raddoppio del collegamento italo-francese.",
    source: "NewsBiella",
    publishedAt: "2026-09-16T07:50:00+02:00",
    category: "Territorio",
    province: "Piemonte",
    url: "https://www.newsbiella.it/2026/09/16/leggi-notizia/argomenti/attualita-1/articolo/raddoppio-tunnel-del-monte-bianco-cirio-incontra-la-presidente-rini.html",
    image: "https://www.newsbiella.it/fileadmin/archivio/newsbiella/2025/04/cirio_rep_2025_aprile.png",
  },
  {
    title: "Ozono, il 16 settembre è dedicato alla salvaguardia dello scudo della Terra",
    summary: "Un approfondimento ambientale ripercorre l’evoluzione del fenomeno e la sua importanza.",
    source: "NewsBiella",
    publishedAt: "2026-09-16T06:50:00+02:00",
    category: "Ambiente",
    province: "Biella",
    url: "https://www.newsbiella.it/2026/09/16/leggi-notizia/argomenti/attualita-1/articolo/ozono-lo-scudo-invisibile-che-protegge-la-terra-il-16-settembre-e-dedicato-alla-sua-salvaguardia.html",
    image: "https://www.newsbiella.it/fileadmin/archivio/valsesianotizie/2026/09/Newsbiella.it___80__ozono_2026_strato_16_settembre_erg324w.png",
  },
  {
    title: "‘Convivium. Dal ferro al cibo’, la mostra arriva in Consiglio regionale",
    summary: "Tecniche agricole tradizionali, lavoro e saperi artigianali al centro dell’esposizione.",
    source: "ANSA Piemonte",
    publishedAt: "2026-09-15T20:56:00+02:00",
    category: "Cultura",
    province: "Torino",
    url: "https://www.ansa.it/piemonte/notizie/2026/09/15/convivium.-dal-ferro-al-cibo-mostra-al-via-in-consiglio-regionale_ca924101-a8c5-4acd-b3a1-b496dbf210f6.html",
    image: "https://www.ansa.it/webimages/img_1280x720/2026/7/21/dca491a7b5551be2a29555bd26409463.jpg",
  },
  {
    title: "Orso Blu di Valdengo, la Regione al lavoro per tutelare 137 dipendenti",
    summary: "La situazione occupazionale dell’azienda biellese arriva nuovamente all’attenzione regionale.",
    source: "NewsBiella",
    publishedAt: "2026-09-15T18:15:13+02:00",
    category: "Economia",
    province: "Biella",
    url: "https://www.newsbiella.it/2026/09/15/leggi-notizia/argomenti/politica-5/articolo/orso-blu-di-valdengo-la-regione-al-lavoro-per-tutelare-i-137-dipendenti.html",
    image: "https://www.newsbiella.it/fileadmin/archivio/newsbiella/2026/09/orso_blu_servizi_870.jpeg",
  },
  {
    title: "Alessandria torna capitale della chitarra classica",
    summary: "Al via la 58ª edizione del Concorso Internazionale Michele Pittaluga.",
    source: "ANSA Piemonte",
    publishedAt: "2026-09-15T18:36:00+02:00",
    category: "Cultura",
    province: "Alessandria",
    url: "https://www.ansa.it/piemonte/notizie/2026/09/15/alessandria-torna-capitale-della-chitarra-classica_a7cbb84d-b423-45e0-bf9e-636c4abcb9fa.html",
    image: "https://www.ansa.it/webimages/img_1280x720/2026/9/15/270df732c178ffc831c46aa8beb1624d.jpg",
  },
  {
    title: "Verbania, Loris Baldassarre è il nuovo comandante provinciale dei Carabinieri",
    summary: "Il colonnello, 53 anni, assume il comando provinciale dopo una lunga carriera nell’Arma.",
    source: "ANSA Piemonte",
    publishedAt: "2026-09-15T16:56:00+02:00",
    category: "Territorio",
    province: "VCO",
    url: "https://www.ansa.it/piemonte/notizie/2026/09/15/verbania-loris-baldassarre-e-il-nuovo-comandante-provinciale-dei-carabinieri_d432f5f1-2bda-4aa9-927e-447fed3380ae.html",
    image: "https://www.ansa.it/webimages/img_1280x720/2026/9/15/4a09373b8412a1e5a33dc730efc89213.jpg",
  },
  {
    title: "Chivasso celebra i Nocciolini tra gusto, cultura e tradizione",
    summary: "Dal 22 al 27 settembre torna la festa dedicata a una delle eccellenze della città.",
    source: "ANSA Piemonte",
    publishedAt: "2026-09-15T14:15:00+02:00",
    category: "Eventi",
    province: "Torino",
    url: "https://www.ansa.it/piemonte/notizie/2026/09/15/chivasso-celebra-i-nocciolini-una-festa-tra-gusto-cultura-e-tradizione_e39469aa-6222-46a1-ba5a-2ccd0a3d0b12.html",
    image: "https://www.ansa.it/webimages/img_1280x720/2026/9/15/28b45947e62ca98a801439ba400eb50a.jpg",
  },
  {
    title: "In Piemonte 7.259 studenti in meno: Vercelli è l’unica provincia in crescita",
    summary: "L’anno scolastico parte con 478.571 allievi, l’1,5% in meno rispetto al 2025.",
    source: "La Stampa",
    publishedAt: "2026-09-14T07:34:29Z",
    category: "Scuola",
    province: "Piemonte",
    url: "https://www.lastampa.it/vercelli/2026/09/14/news/scuola_piemonte_calo_studenti_dati_province-15738627/",
    image: "https://www.gedistatic.it/content/gnn/img/lastampa/2026/09/14/093425117-56cb47d8-e60f-41f4-858f-f227eb25c5c8.jpg",
  },
  {
    title: "La scommessa del solare: GreenIT accende i parchi a Vercelli e Alessandria",
    summary: "L’operazione della joint venture Plenitude–Cdp Equity rafforza la produzione energetica locale.",
    source: "La Stampa",
    publishedAt: "2026-09-14T03:00:00Z",
    category: "Economia",
    province: "Vercelli",
    url: "https://www.lastampa.it/speciale/economia/nordovest-economia/2026/09/14/news/la_scommessa_del_solare_greenit_accende_i_parchi_a_vercelli_e_alessandria-15735998/",
    image: "https://www.gedistatic.it/content/gnn/img/lastampa/2026/09/10/215956700-c916c4df-a8f2-4090-bf55-ccb76af278c9.jpg",
  },
  {
    title: "Mattarella inaugura Terra Madre: Torino capitale del gusto per i 40 anni di Slow Food",
    summary: "L’edizione dedicata alla biodiversità si terrà dal 24 al 27 settembre.",
    source: "La Stampa",
    publishedAt: "2026-09-14T10:24:53Z",
    category: "Eventi",
    province: "Torino",
    url: "https://www.lastampa.it/torino/2026/09/14/news/sergio_mattarella_inaugura_terra_madre_slow_food_torino-15738761/",
    image: "https://www.gedistatic.it/content/gnn/img/lastampa/2026/09/14/131957649-f4cab728-b3ff-4412-8f67-7d6a838a6095.jpg",
  },
];
