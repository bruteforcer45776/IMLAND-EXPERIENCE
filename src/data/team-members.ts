const teamPhoto = (slug: string) => `/assets/team/${slug}.webp`;

export type TimelineEntry = {
  year: string;
  title: string;
  detail?: string;
};

export type TeamMember = {
  slug: string;
  photo: string;
  firstName: string;
  lastName: string;
  nickname: string;
  role: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  /** Chi sono — racconto della persona */
  bio: string;
  /** Background professionale */
  background: string;
  /** Mission personale */
  mission: string;
  /** Competenze principali (chip / lista) */
  keySkills: string[];
  /** Timeline esperienze e formazione */
  timeline: TimelineEntry[];
  /** Ruolo in Homeland Experience */
  homelandRole: {
    responsibilities: string;
    areas: string[];
    projects: string[];
  };
  /** Card competenze (icona = emoji o simbolo) */
  skills: { icon: string; title: string; desc: string }[];
  /** CTA contatti */
  contactEmail?: string;
  bookingUrl?: string;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const defaultProfile = (
  firstName: string,
  lastName: string,
  role: string,
): Pick<
  TeamMember,
  "bio" | "background" | "mission" | "keySkills" | "timeline" | "homelandRole" | "skills"
> => ({
  bio: `${firstName} ${lastName} è parte del team IMLAND.\nRacconta il territorio con curiosità e ascolto.`,
  background: "Un percorso costruito tra progetti locali, produzione culturale e comunicazione.",
  mission:
    "Dare voce alle comunità e trasformare le storie del territorio in racconto sonoro condiviso.",
  keySkills: ["Storytelling", "Community", "Produzione"],
  timeline: [
    {
      year: "Oggi",
      title: `${role || "Team"} — IMLAND EXPERIENCE`,
      detail: "Progetti, produzione e community.",
    },
    {
      year: "Prima",
      title: "Esperienze sul territorio",
      detail: "Collaborazioni con realtà locali e progetti culturali.",
    },
    {
      year: "Formazione",
      title: "Percorso multidisciplinare",
      detail: "Comunicazione, media e cultura.",
    },
  ],
  homelandRole: {
    responsibilities:
      "Contribuisce alla produzione dei contenuti IMLAND, cura relazioni con la community e segue progetti dedicati al territorio.",
    areas: ["Contenuti", "Community", "Territorio"],
    projects: ["Radio in diretta", "Podcast IMLAND", "Eventi Member"],
  },
  skills: [
    { icon: "🎙️", title: "Voce & Racconto", desc: "Conduzione, interviste e storytelling audio." },
    { icon: "🤝", title: "Relazioni", desc: "Cura della community e delle realtà del territorio." },
    { icon: "🛠️", title: "Produzione", desc: "Pianificazione, editing e messa in onda." },
  ],
});

const build = (
  photo: string,
  firstName: string,
  lastName: string,
  nickname: string,
  role: string,
): TeamMember => ({
  slug:
    slugify(`${firstName}-${lastName}`) ||
    slugify(nickname) ||
    slugify(`membro-${photo.slice(-8)}`),
  photo,
  firstName,
  lastName,
  nickname,
  role,
  description: "",
  ctaLabel: "",
  ctaHref: "",
  ...defaultProfile(firstName, lastName, role),
});

const descriptions: Record<string, string> = {
  "davide-de-lisa":
    "Ciao, sono Davide De Lisa in arte David Deluxe e sono uno degli ideatori di Imland Radio.\nIn questa avventura mi occupo della direzione artistica oltre ad essere lo speaker principale del programma Stuzzicaziende, che racconta lo ieri, l'oggi e il domani delle aziende della zona.\nHo sempre lavorato nell'ambito commerciale e marketing per importanti aziende del territorio.\nSono da sempre appassionato di musica e sin da ragazzino mi sono avvicinato al mondo di dj e vocalist, esercitando nei migliori locali della zona.\nIl mio sogno è sempre stato quello di lavorare in una radio che trasmettesse musica: quel collante meraviglioso che unisce gli esseri viventi.\nLa radio nasce per dare voce a chi voce ne ha avuta poca in questi anni, valorizzando il territorio a 360°.",
  "davide-maiorano":
    "Mi chiamo Davide Maiorano, ho 43 anni, sono originario di Cossato (Biella) e dal 2013 vivo a Gattinara, in provincia di Vercelli.\nSono felicemente sposato e papà di una splendida bambina di 7 anni.\nDal 2008 lavoro nel settore della comunicazione e del marketing, una passione che si è trasformata in professione.\nHo iniziato collaborando con giornali locali e successivamente con una testata nazionale.\nNel 2017 ho scelto di specializzarmi nel web marketing, con l'obiettivo di aiutare aziende, professionisti e attività locali a comunicare in modo efficace online.\nCon la mia trasmissione Bar in Onda voglio creare uno spazio leggero e coinvolgente, dove parlare di notizie locali e non, con un linguaggio semplice e diretto.",
  "davide-negro":
    "Ciao, sono Davide Negro, ma tutti mi chiamano Niger.\nSono ingegnere e mi occupo di miglioramento continuo in un'azienda.\nUn lontano 2001 nacque la passione del djing, tuttora continuo a svilupparla in un mix tra hobby e lavoro.\nL'approdo in radio è l'ultima evoluzione.\nMassima aspirazione? Vedere una persona annoiata che grazie alla musica inizia a far andare il piedino.\nMi occupo della parte tecnica di messa in onda: se la radio è muta o passa 12 volte in fila la stessa canzone, citofonatemi!",
  "matteo-sella":
    "Nasco a Gattinara nel 1984 sapendo che nella vita avrei fatto cose.\nEspressione strana che però descrive perfettamente quello che sono: facendo cose!\nEccomi qua nell'avventura di IMLAND RADIO, la piattaforma che mi aiuterà a raccontarmi e a raccontare alcune delle mie passioni: manifestazioni, sagre, band e musicisti, teatro, arte e cultura.\nPerché IMLAND RADIO? Perché spero che un giorno possano nascere qui ragazze e ragazzi con le mie stesse passioni e la voglia di raccontare queste meravigliose cose da protagonisti.",
  "massimo-biasini":
    "Ciao ragazzi, sono Massimo Biasini, per tutti Max Biasu.\nCo-fondatore di Imland Radio assieme a questo pazzo gruppo.\nNella vita lavoro nel mondo del vino, dalle vigne alla cantina.\nQuando abbiamo iniziato a pensare a questo progetto mi sono lanciato immediatamente, perché adoro la radio e la ascolto da sempre.\nIn Imland Radio sono il conduttore e autore del programma ASSAGGI, che vuole far conoscere le produzioni agricole ed enogastronomiche del nostro territorio.\nSono anche co-conduttore del programma BAR IN ONDA assieme a Maio e Sellino.",
  "alberto-colpo":
    "Ciao, mi chiamo Alberto Colpo e all'interno di ImLand Radio ho ideato e conduco il programma Istruzioni per l'uso.\nHo passato tutta la mia carriera lavorativa nell'ambito delle vendite, sia come dipendente che come libero professionista.\nLa burocrazia è sempre stata una compagna di viaggio, a volte amica e a volte meno.\nIstruzioni per l'uso nasce per chiedere ai professionisti dei più svariati settori il dietro le quinte del loro lavoro, i concetti semplici e quelli meno, per aiutare le persone ad affrontare le proprie giornate con più consapevolezza.\nNon conosceremo dei professionisti qualunque, ma i migliori del nostro territorio.",
  "paolo-paracchini":
    "Ciao a tutti, mi chiamo Paolo: musicista, compositore e produttore.\nDopo quasi 10 anni tra studio e lavoro a Milano la vita mi ha riportato qui, nella mia dolce casa, Gattinara.\nLe mie giornate sono trascorse tra grandi e piccoli palchi, studi di registrazione e sale prove, collaborando a centinaia di progetti come produttore, compositore o turnista.\nHo lavorato come music coach in ambito cinematografico e inciso decine di pubblicità televisive e spot radiofonici come bassista.\nIMLAND Radio rappresenta per me l'ennesima sfida e opportunità di imparare e crescere, mettendo a disposizione tutte le mie esperienze al gruppo e al progetto.",
  "alessandra-campaci":
    "Ciao, sono Alessandra.\nHo 24 anni e sono Responsabile Member e Assistente Direzione: mi occupo della gestione dei Member della radio a 360 gradi, seguendo l'organizzazione, il coordinamento e la cura delle relazioni all'interno della community e della rete d'impresa.\nSono laureata in Arti, Musica e Spettacolo e sto concludendo una laurea magistrale in Comunicazione.\nDopo aver studiato a Torino ho scelto di tornare a vivere nel paese in cui sono cresciuta, spinta dal forte legame con il territorio e dalla volontà di valorizzarne le potenzialità.",
  "andrea-libero":
    'Ciao, io sono Andrea, Andrea chi? Il Pibe, quello che faceva il portiere.\nMa soprattutto quello che ci prova ad alleggerirvi oggi, sorridere di ieri e proiettarci verso il futuro con il gioco della musica e delle parole.\nIl mio motto è "sii il cambiamento che vuoi vedere negli altri", perché dobbiamo essere noi il primo passo verso ciò che vogliamo vedere nel mondo.\nCompagna inseparabile? La musica, perché la musica non ci compra. Ci emoziona!',
  "simone-abondio":
    "Mi chiamo Simone, ho trent'anni e vivo la mia quotidianità sospesa tra famiglia, passioni e lavoro.\nHo frequentato l'alberghiero di Gattinara e, subito dopo la scuola, ho avuto la fortuna di lanciarmi in un'esperienza lavorativa unica in una cucina di Kilkenny, in Irlanda.\nPer anni ho lavorato come cuoco, imparando il valore della precisione, della creatività e del lavoro di squadra.\nNel 2018 ho ampliato il mio percorso diventando sommelier.\nOra insegno e lavoro ogni giorno a stretto contatto con ragazzi con disabilità, un compito che richiede empatia, ascolto e dedizione.",
  "sonia-ferraiuolo":
    "Sono Sonya Ferraiuolo e sono una docente.\nDa anni mi occupo di insegnamento in un istituto di Gattinara.\nOgni giorno in classe mi confronto con ragazzi di diverse età che vivono in una società complessa e in rapido cambiamento.\nCredo che la chiave sia fornire strumenti per navigare in questo contesto, come uno spazio per esprimersi e crescere.\nQuesto è anche lo scopo del mio programma in radio, Carta Canta: un'opportunità per conoscere, sapere e confrontarsi con le vite di altre persone, attraverso libri e storie che trattano tematiche sempre attuali.",
  "roberto-lisi":
    "Mi chiamo Roberto, lavoro da molti anni nel settore della consulenza e dell'ambito assicurativo, dove ho maturato esperienza nella gestione amministrativa e nell'organizzazione dei processi.\nSono una persona precisa, affidabile e appassionata di numeri e organizzazione.\nIl progetto Web Radio mi ha colpito fin da subito per la sua energia e il suo potenziale innovativo.\nMi piace ascoltare, confrontarmi con gli altri e affrontare ogni giorno con curiosità e voglia di imparare qualcosa di nuovo, mettendo sempre le mie competenze a disposizione del team.",
  "celeste-miolo":
    "Ciao, sono Celeste e sono una persona curiosa per natura: di quelle che fanno domande, ascoltano e parlano tanto.\nOggi lavoro come consulente aziendale in ambito sostenibilità: aiuto le aziende a fare scelte più responsabili e a comunicarle nel miglior modo possibile.\nHo due lauree in comunicazione: spiegare, raccontare e condividere è qualcosa che mi accompagna da sempre.\nNon sono un'esperta di musica, ma la musica fa parte della mia vita in modo inequivocabile.\nTra una canzone e l'altra cercherò di raccontarvi il mondo (e il territorio) con entusiasmo ed energia.",
  "mattia-tassar":
    "Mi chiamo Mattia Tassar, in arte TASH, e lavoro nel mondo della comunicazione digitale, della musica e dell'intrattenimento.\nSono frontman dei progetti musicali Domani Smetto, tributo ufficiale ad Articolo 31 e J-Ax, e No Cap, live band dedicata a mashup e hit pop/rap reinterpretate dal vivo.\nHo fondato Casual Nerd, progetto editoriale dedicato a gaming e cultura pop con focus sulla scena indie italiana.\nDal 2025 collaboro con aziende e realtà dell'intrattenimento creando strategie comunicative, contenuti digitali e attività di storytelling e branding.",
  "luana-spinella":
    "Sono Luana Spinella, cantante, con un amore profondo e viscerale per la musica e per tutto ciò che riesce a raccontare emozioni, sfumature e bellezza attraverso l'arte.\nNata a Vercelli da famiglia siciliana, porto con me un legame profondo con una terra intensa, ricca di cultura e sensibilità artistica.\nMi sono formata in canto jazz presso il Conservatorio A. Vivaldi di Alessandria e nel doppiaggio presso la scuola ODS di Torino.\nCollaboro con diverse realtà e musicisti dell'ambiente jazzistico e non solo, spaziando tra jazz, pop e cantautorato italiano.\nIn radio mi piacerebbe portare uno spazio ispirato a tutto questo: musica, arte, emozioni, parole e riflessioni.",
  "luca-golzio":
    "Ciao, mi chiamo Luca Golzio.\nSono una persona positiva, solare e curiosa di conoscere nuove realtà e soprattutto nuove persone.\nCredo molto nelle relazioni umane, nell'ascolto e nel creare connessioni vere: è anche per questo che mi occupo della parte commerciale della radio, un ruolo che mi permette ogni giorno di confrontarmi con gli altri e costruire collaborazioni solide e stimolanti.\nLo sport è una parte importante della mia vita: mi aiuta a ricaricarmi e a dare il meglio di me.\nLa radio è uno spazio dove posso esprimermi, condividere idee e far sentire la mia voce, non solo nel senso tecnico ma anche come presenza, energia e personalità.",
  "alessia-pezzimenti":
    "Mi chiamo Alessia e mi occupo di tutto ciò che è creativo.\nParto da qui perché è la base del mio lavoro, il cuore di quello che faccio ogni giorno.\nLavoro come graphic designer e social media manager: mi occupo di creare contenuti visivi e testuali per aiutare aziende e professionisti a comunicare meglio online.\nProgetto grafiche, gestisco profili social e curo l'immagine digitale delle realtà della mia zona.\nQuesto lavoro mi dà l'opportunità di conoscere tante persone, ascoltare le loro storie e trasformarle in progetti che parlano davvero di chi sono.",
  "tommaso-segato":
    "Ciao, sono Tommaso Segatto, per tutti Tommy, e sono uno dei responsabili degli eventi di Imland Radio.\nMi occupo di portare la radio fuori dallo studio, organizzando serate ed eventi sul territorio.\nSono appassionato di musica e di nightlife, e cerco di unire queste passioni per creare esperienze coinvolgenti per chi ci ascolta.\nIl mio legame con la nostra terra mi ha portato ad entrare nella grande famiglia di Imland Experience.",
};

// Ordine e ruoli aggiornati: prima i ruoli direttivi, poi il resto nell'ordine precedente.
export const teamMembers: TeamMember[] = [
  build(teamPhoto("davide-de-lisa"), "Davide", "De Lisa", "", "Direzione artistica e speaker"),

  build(
    teamPhoto("massimo-biasini"),
    "Massimo",
    "Biasini",
    "",
    "Direzione eventi e logistica e speaker",
  ),

  build(teamPhoto("matteo-sella"), "Matteo", "Sella", "", "Direzione radio e speaker"),

  build(teamPhoto("davide-negro"), "Davide", "Negro", "", "Tecnico"),

  build(teamPhoto("alberto-colpo"), "Alberto", "Colpo", "", "Direzione commerciale e speaker"),

  build(
    teamPhoto("alessandra-campaci"),
    "Alessandra",
    "Campaci",
    "",
    "Responsabile marketing e member",
  ),

  build("", "Bixont", "", "Bixont", "Content Creation, SMM, Web Development"),

  build(teamPhoto("paolo-paracchini"), "Paolo", "Paracchini", "", "Direzione di produzione"),

  build(teamPhoto("davide-maiorano"), "Davide", "Maiorano", "", "Speaker"),

  build(teamPhoto("andrea-libero"), "Andrea", "Libero", "", "Speaker"),

  build(teamPhoto("simone-abondio"), "Simone", "Abondio", "", "Speaker"),

  build(teamPhoto("sonia-ferraiuolo"), "Sonia", "Ferraiuolo", "", "Speaker"),

  build(teamPhoto("roberto-lisi"), "Roberto", "Lisi", "", "Speaker"),

  build(teamPhoto("celeste-miolo"), "Celeste", "Miolo", "", "Speaker"),

  build(teamPhoto("mattia-tassar"), "Mattia", "Tassar", "", "Speaker"),

  build(teamPhoto("luana-spinella"), "Luana", "Spinella", "", "Speaker"),

  build(teamPhoto("luca-golzio"), "Luca", "Golzio", "", "Commerciale"),

  build(teamPhoto("matteo-pedrina"), "Matteo", "Pedrina", "", "Commerciale"),

  build(teamPhoto("alessia-pezzimenti"), "Alessia", "Pezzimenti", "", "Grafica"),

  build(teamPhoto("roberto-filiberti"), "Roberto", "Filiberti", "", "Amministrazione"),

  build(teamPhoto("tommaso-segato"), "Tommaso", "Segatto", "", "Eventi"),
].map((m, i) => ({
  ...m,
  description: descriptions[m.slug === "tommaso-segatto" ? "tommaso-segato" : m.slug] ?? m.description,
  slug: m.slug === "tommaso-segatto" ? "tommaso-segato" : m.slug || `membro-${i + 1}`,
}));

export function getTeamMember(slug: string): TeamMember | undefined {
  return teamMembers.find((m) => m.slug === slug);
}
