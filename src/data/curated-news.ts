export type CuratedNewsItem = {
  title: string;
  summary: string;
  source: "ANSA Piemonte" | "L'Opinionista";
  publishedAt: string;
  category: string;
  province: string;
  url: string;
  image: string;
};

/**
 * Rassegna verificata il 18 settembre 2026 sulle pagine originali delle testate.
 * Le immagini sono le anteprime dichiarate dalle fonti e restano remote e attribuite.
 */
export const curatedNews: CuratedNewsItem[] = [
  {
    title: "“Con una penna in mano”, il libro di Nicola Gardini",
    summary:
      "Il nuovo saggio riflette sul valore cognitivo, estetico ed etico della scrittura a mano.",
    source: "L'Opinionista",
    publishedAt: "2026-09-18T12:00:00+02:00",
    category: "Cultura",
    province: "Italia",
    url: "https://www.lopinionista.it/con-una-penna-in-mano-il-libro-di-nicola-gardini-229729.html",
    image:
      "https://www.lopinionista.it/wp-content/uploads/2026/09/con-una-penna-in-mano-4828-e1789728556911.jpg",
  },
  {
    title: "Giornata nazionale Sla, Montecitorio si illumina di verde",
    summary:
      "La Camera aderisce alla Giornata nazionale sulla Sla illuminando la facciata di Montecitorio.",
    source: "L'Opinionista",
    publishedAt: "2026-09-17T18:00:00+02:00",
    category: "Salute",
    province: "Italia",
    url: "https://www.lopinionista.it/giornata-nazionale-sla-montecitorio-si-illumina-di-verde-2-229712.html",
    image:
      "https://www.lopinionista.it/wp-content/uploads/2024/05/Montecitorio-e1716125667121.jpg",
  },
  {
    title: "Artissima, all'Oval Lingotto 183 gallerie da 35 Paesi",
    summary:
      "La fiera internazionale d'arte contemporanea torna a Torino dal 30 ottobre al 1° novembre.",
    source: "ANSA Piemonte",
    publishedAt: "2026-09-17T16:30:00+02:00",
    category: "Cultura",
    province: "Torino",
    url: "https://www.ansa.it/piemonte/notizie/2026/09/17/artissima-alloval-lingotto-dal-30-ottobre-all1-novembre-183-gallerie-da-35-paesi_80604737-142b-415d-8e9e-b616b6e59f99.html",
    image:
      "https://www.ansa.it/webimages/news_base/2026/9/17/91913e1cd69a4bf469215e51a63f9d76.jpg",
  },
  {
    title: "In Piemonte oltre 1,6 milioni di cittadini non pagheranno più il bollo",
    summary:
      "La Regione stima 170 milioni di euro di minori entrate, compensate dallo stanziamento statale.",
    source: "ANSA Piemonte",
    publishedAt: "2026-09-17T16:26:00+02:00",
    category: "Politica",
    province: "Piemonte",
    url: "https://www.ansa.it/piemonte/notizie/2026/09/17/cirio-in-piemonte-non-pagheranno-piu-il-bollo-1.634.491-cittadini_27d58d87-1091-4420-9489-a121e95c4eb0.html",
    image:
      "https://www.ansa.it/webimages/news_base/2026/9/17/af7e4e0793e080fe6cead8446db9f88a.jpg",
  },
  {
    title: "Ex Dana, la nuova proprietà Usa chiude uno stabilimento nel Cuneese",
    summary:
      "Per 180 lavoratori dello stabilimento di Sommariva Perno si prospetta il trasferimento a Rivoli.",
    source: "ANSA Piemonte",
    publishedAt: "2026-09-17T17:24:00+02:00",
    category: "Economia",
    province: "Cuneo",
    url: "https://www.ansa.it/piemonte/notizie/2026/09/17/ex-dana-la-nuova-proprieta-usa-chiude-uno-stabilimento-nel-cuneese_4e422f4b-5c12-4a7c-bb32-f1df868f0338.html",
    image:
      "https://www.ansa.it/webimages/news_base/2026/9/17/bc28f4f7c8a74b382a22e76109ff2774.jpg",
  },
];
