export type MemberAddress = {
  label: string;
  address: string;
  coordinates?: [number, number];
  coordinatePrecision?: "civic" | "street";
  coordinateSource?: "OpenStreetMap Nominatim";
};

export type MemberDetail = {
  description: string;
  addresses: MemberAddress[];
};

const updating = [{ label: "Sede", address: "Indirizzo in aggiornamento" }];

/**
 * Dati pubblici verificati per le schede Member.
 * Le coordinate sono presenti solo quando la sede è stata verificata anche sulla cartografia.
 */
export const MEMBER_DETAILS: Record<string, MemberDetail> = {
  "Travaini Carpenterie": {
    description: "Carpenteria metallica e lavorazioni industriali su commessa.",
    addresses: [{ label: "Sede", address: "Corso Europa 3, 28010 Fontaneto d’Agogna (NO)", coordinates: [8.4822388, 45.6551397], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Arte Idea — Matteo Libanoro": {
    description: "Studio creativo dedicato ad arte, decorazione e progettazione visiva.",
    addresses: [{ label: "Sede", address: "Corso Vercelli 5, 13045 Gattinara (VC)", coordinates: [8.3710153, 45.6011478], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Cooperativa Alla Fonte": {
    description: "Cooperativa sociale attiva nei servizi alla persona e alla comunità.",
    addresses: [{ label: "Sede verificata", address: "Via Privata La Granda 7, 28077 Prato Sesia (NO)" }],
  },
  "Immobiliare Ponti": {
    description: "Agenzia immobiliare per compravendite, locazioni e consulenza sul territorio.",
    addresses: [{ label: "Sede", address: "Corso Vercelli 1, 13045 Gattinara (VC)", coordinates: [8.37009, 45.5949478], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  Guglielmi: {
    description: "Azienda produttrice di rubinetteria e soluzioni per il bagno.",
    addresses: [{ label: "Sede", address: "Via Arturo Biella 27, 28075 Grignasco (NO)", coordinates: [8.3262122, 45.6857905], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Ali Lavoro": {
    description: "Agenzia per il lavoro, ricerca, selezione e servizi per imprese e candidati.",
    addresses: [{ label: "Filiale di Gattinara", address: "Via Guglielmo Marconi 112/114, 13045 Gattinara (VC)" }],
  },
  "A2G Maglificio": {
    description: "Maglificio specializzato nella produzione tessile e nell’abbigliamento.",
    addresses: [{ label: "Sede", address: "Via Torino 21, 28064 Carpignano Sesia (NO)", coordinates: [8.41219, 45.5323985], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Class Luxury Beauty PMU": { description: "Centro beauty specializzato in trucco permanente e trattamenti estetici.", addresses: updating },
  "Andrea Todaro — Consulente": {
    description: "Consulenza aziendale e supporto allo sviluppo organizzativo delle imprese.",
    addresses: [{ label: "Sede", address: "Via Torino 10, 13868 Villa del Bosco (BI)", coordinates: [8.2848997, 45.6172541], coordinatePrecision: "civic", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Sesia Soft": {
    description: "Soluzioni software e servizi informatici per aziende e professionisti.",
    addresses: [{ label: "Sede", address: "Via Ventiquattro Maggio 16/1, 13019 Varallo (VC)", coordinates: [8.2578615, 45.8164834], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "CSC Infissi": {
    description: "Progettazione e installazione di serramenti, infissi e soluzioni per la casa.",
    addresses: [{ label: "Sede", address: "Via Tosalli 56, 28073 Fara Novarese (NO)", coordinates: [8.4480089, 45.5652668], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Bo.S.Co Gattinara": {
    description: "Attività di ristorazione e ospitalità a Gattinara.",
    addresses: [{ label: "Sede", address: "Via Giuseppe Verdi 17, 13045 Gattinara (VC)", coordinates: [8.3729606, 45.6084852], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Sais Compensati": {
    description: "Produzione e lavorazione di compensati e pannelli in legno.",
    addresses: [{ label: "Sede", address: "Via Dante Alighieri 60, 13045 Gattinara (VC)", coordinates: [8.3758154, 45.6082088], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Barbi Green": {
    description: "Soluzioni e servizi per il verde e la sostenibilità ambientale.",
    addresses: [{ label: "Sede", address: "Via Papa Giovanni XXIII 33, 28074 Ghemme (NO)", coordinates: [8.4137021, 45.6071143], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "BGS Srl": {
    description: "Azienda di servizi per imprese e attività del territorio.",
    addresses: [{ label: "Sede", address: "Via Novara 506, 28078 Romagnano Sesia (NO)", coordinates: [8.3840785, 45.6332859], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Ai 3 Calici": {
    description: "Locale dedicato a ristorazione, vino e convivialità.",
    addresses: [{ label: "Sede", address: "Piazza Italia 1, 13045 Gattinara (VC)", coordinates: [8.3713746, 45.6143209], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Officine Grafiche": {
    description: "Servizi di stampa, grafica e produzione di materiali di comunicazione.",
    addresses: [
      { label: "Sede operativa", address: "Via F. Peretti 71, 28075 Grignasco (NO)" },
      { label: "Sede legale", address: "Viale Carlo Fassò 3, 13011 Borgosesia (VC)", coordinates: [8.2781006, 45.7141404], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" },
    ],
  },
  "L'Orizzo — SOS Genitori": { description: "Progetto educativo e di supporto rivolto a genitori e famiglie.", addresses: updating },
  "Magnolia Ristorante Gattinara": {
    description: "Ristorante a Gattinara dedicato alla cucina e all’ospitalità.",
    addresses: [{ label: "Sede", address: "Corso Valsesia 116, 13045 Gattinara (VC)", coordinates: [8.3709967, 45.6164313], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "SOS Nepal": {
    description: "Associazione non profit impegnata in progetti di solidarietà e cooperazione con il Nepal.",
    addresses: [{ label: "Sede", address: "Via Novara 17, 28074 Ghemme (NO)", coordinates: [8.4236788, 45.5952294], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  Motorhouse: {
    description: "Concessionaria e servizi dedicati al settore automobilistico.",
    addresses: [{ label: "Sede", address: "SS Valsesia/SP594 n. 24, 13035 Lenta (VC)", coordinates: [8.3809812, 45.55223], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Monterosa Immobiliare": {
    description: "Agenzia immobiliare per compravendite, locazioni e consulenza.",
    addresses: [{ label: "Sede", address: "Corso Roma 66, 13019 Varallo (VC)", coordinates: [8.2550098, 45.813911], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Ottica Zonco": {
    description: "Centro ottico per occhiali, lenti e servizi dedicati alla visione.",
    addresses: [
      { label: "Sede di Gattinara", address: "Viale Roma 1, 13045 Gattinara (VC)", coordinates: [8.3653804, 45.6134672], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" },
      { label: "Sede di Ponzone", address: "Frazione Ponzone 136, 13835 Valdilana (BI)", coordinates: [8.1882428, 45.6548666], coordinatePrecision: "civic", coordinateSource: "OpenStreetMap Nominatim" },
    ],
  },
  Cabboi: {
    description: "Azienda di servizi per attività e imprese del territorio.",
    addresses: [{ label: "Sede", address: "Corso Valsesia 280, 13045 Gattinara (VC)", coordinates: [8.3709967, 45.6164313], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Valpil Tetti": {
    description: "Realizzazione e manutenzione di tetti e coperture per l’edilizia.",
    addresses: [{ label: "Sede", address: "Via Galileo Ferraris 11, 13045 Gattinara (VC)", coordinates: [8.3728293, 45.6186124], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "CP Studio Tecnico": { description: "Studio tecnico per progettazione e consulenza professionale.", addresses: updating },
  "Crolla Telecom": {
    description: "Sistemi di telecomunicazione e soluzioni tecnologiche per imprese.",
    addresses: [{ label: "Sede", address: "Via Martiri delle Foibe 27, 28024 Gozzano (NO)", coordinates: [8.4370971, 45.7306222], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Parafarmacia San Rocco": {
    description: "Parafarmacia con prodotti e servizi per salute, benessere e cura della persona.",
    addresses: [{ label: "Sede", address: "Corso Valsesia 95, 13045 Gattinara (VC)", coordinates: [8.3709967, 45.6164313], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  Multone: {
    description: "Attività di servizi per imprese e clienti del territorio.",
    addresses: [{ label: "Sede", address: "Corso Vercelli 197, 13011 Borgosesia (VC)", coordinates: [8.288122, 45.7056248], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "CIS Spare Parts": {
    description: "Fornitura di ricambi e componenti per applicazioni industriali.",
    addresses: [{ label: "Sede", address: "Via Don Signini 27/A, 28010 Briga Novarese (NO)", coordinates: [8.454088, 45.7172684], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  Malama: {
    description: "Attività dedicata al benessere e alla cura della persona.",
    addresses: [{ label: "Sede", address: "Viale Roma 15, 13045 Gattinara (VC)", coordinates: [8.3653804, 45.6134672], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  Modularee: {
    description: "Progettazione di arredi e soluzioni modulari per gli spazi.",
    addresses: [{ label: "Sede", address: "Via Roma 63, 28073 Fara Novarese (NO)", coordinates: [8.4423609, 45.5450378], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  Barberi: {
    description: "Produzione industriale di componenti e sistemi per impianti.",
    addresses: [
      { label: "Sede", address: "Via Monte Fenera 7, 13018 Valduggia (VC)", coordinates: [8.3207195, 45.7215804], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" },
      { label: "Sede logistica", address: "Via Arturo Biella 15, 28075 Grignasco (NO)", coordinates: [8.3262122, 45.6857905], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" },
    ],
  },
  "RS Eventi": { description: "Organizzazione e produzione di eventi.", addresses: updating },
  Immobilsesia: {
    description: "Agenzia immobiliare attiva nella compravendita e locazione di immobili.",
    addresses: [{ label: "Sede", address: "Piazza Martiri 10, 13011 Borgosesia (VC)", coordinates: [8.2772936, 45.7165696], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Motel Piranha": {
    description: "Struttura ricettiva per soggiorni e ospitalità.",
    addresses: [{ label: "Sede", address: "SR11 Novara–Vercelli, 28060 Orfengo di Casalino (NO)", coordinates: [8.5112407, 45.3949541], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Gozzi Arte": {
    description: "Galleria e attività dedicata all’arte.",
    addresses: [{ label: "Sede", address: "Corso Garibaldi 82, 13045 Gattinara (VC)", coordinates: [8.3572837, 45.6138002], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "AG Autotrasporti": {
    description: "Servizi di autotrasporto e logistica.",
    addresses: [{ label: "Sede", address: "Via Barro 31/33, 28045 Invorio (NO)", coordinates: [8.4830381, 45.7605114], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "OSM Partner Novara": {
    description: "Consulenza aziendale, organizzazione e sviluppo delle imprese.",
    addresses: [{ label: "Sede Novara e VCO", address: "Via Milano 84, 28041 Arona (NO)", coordinates: [8.5600511, 45.7517976], coordinatePrecision: "civic", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "MGG — Magrega Padel": {
    description: "Centro sportivo dedicato al padel.",
    addresses: [{ label: "Sede", address: "Piazza Vittime di Bologna, angolo Via San Felice, 13030 Ghislarengo (VC)", coordinates: [8.3845807, 45.5294904], coordinatePrecision: "street", coordinateSource: "OpenStreetMap Nominatim" }],
  },
  "Agricola La Quercia": { description: "Azienda agricola e produzione del territorio.", addresses: updating },
};
