import coverPlaceholder from "@/assets/cover-placeholder.webp.asset.json";
import coverAssaggi from "@/assets/cover-assaggi.webp.asset.json";
import coverCartaCanta from "@/assets/cover-carta-canta.webp.asset.json";
import coverStuzzicaziende from "@/assets/cover-stuzzicaziende.webp.asset.json";
import coverTerraDiamanti from "@/assets/cover-terra-di-diamanti.webp.asset.json";
import coverIstruzioni from "@/assets/cover-istruzioni-per-luso.webp.asset.json";
import coverImweekend from "@/assets/cover-imweekend.webp.asset.json";
import coverGrigliata from "@/assets/cover-grigliata-mista.webp.asset.json";


export type PodcastEpisode = { slug: string; title: string; subtitle: string | null; audio: string; cover: string; date: string | null; duration?: string };
export type PodcastProgram = { slug: string; name: string; tagline: string; cat: string; cover: string; episodes: PodcastEpisode[] };

export const podcastPrograms: Record<string, PodcastProgram> = {
  "assaggi": {
    "slug": "assaggi",
    "name": "Assaggi",
    "tagline": "Sapori, mercati, cucine di casa: il territorio si racconta a tavola.",
    "cat": "Cibo",
    "cover": coverPlaceholder.url,
    "episodes": [
      {
        "slug": "da-dove-nasce-un-assaggio",
        "title": "Da dove nasce un assaggio",
        "subtitle": "La storia dell'evoluzione del vino, della birra e dei distillati in una versione molto semplice.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-assaggi/imland-assaggi_27-07-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "26-07-2026"
      },
      {
        "slug": "il-primo-assaggio",
        "title": "Il Primo Assaggio",
        "subtitle": "In questa introduzione ti spiegherò il percorso che ci accompagnerà in questi mesi, girando intorno alla figura dell'assaggiatore professionista e alle competenze che si possono costruire con il tempo.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-assaggi/imland-assaggi_13-07-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "12-07-2026"
      },
      {
        "slug": "azienda-vitivinicola-barbaglia-2",
        "title": "Azienda Vitivinicola Barbaglia",
        "subtitle": "Assaggi ha il piacere di dare voce all'Azienda Vitivinicola Barbaglia di Cavallirio (NO). Grazie all'esperienza e alla motivazione di Silvia sapremo tuffarci nel suo mondo fra vigneti e soddisfazioni.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-assaggi/imland-assaggi_26-08-2025_18-06.mp3",
        "cover": coverPlaceholder.url,
        "date": "26-08-2025"
      },
      {
        "slug": "azienda-vitivinicola-barbaglia",
        "title": "Assaggi - Azienda Vitivinicola Barbaglia",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "27-07-2025"
      },
      {
        "slug": "assaggi-pasticceria-da-monica",
        "title": "Assaggi - Pasticceria \"Da Monica\"",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "28-05-2025"
      }
    ]
  },
  "carta-canta": {
    "slug": "carta-canta",
    "name": "Carta Canta",
    "tagline": "Libri, autori e librerie indipendenti: la carta che ancora fa rumore.",
    "cat": "Cultura",
    "cover": coverPlaceholder.url,
    "episodes": [
      {
        "slug": "uno-nessuno-eroe-la-verita-sotto-la-maschera",
        "title": "Uno, Nessuno, Eroe: La Verità sotto la Maschera",
        "subtitle": "Dal laboratorio di Jekyll ai grattacieli di Gotham, l'uomo ha sempre sentito il bisogno di nascondersi per rivelarsi. In questa puntata esploriamo il confine tra volto e maschera: un viaggio che parte dal doppio letterar",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_23-07-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "22-07-2026"
      },
      {
        "slug": "i-consigli-di-leonardo-tre-libri-bianchi",
        "title": "I consigli di Leonardo - Tre libri bianchi",
        "subtitle": "In questa puntata presentiamo tre libri bianchi. Lasciamo a voi scoprire il perché!",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_09-07-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "08-07-2026"
      },
      {
        "slug": "la-storia-infinita",
        "title": "La storia infinita",
        "subtitle": "Un ragazzino solitario si rifugia in un libro magico e diventa l’eroe chiamato a salvare il regno di Fantàsia dall’avanzata del Nulla. Un viaggio straordinario sul potere dell’immaginazione e sul rischio di perdersi nei ",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_02-07-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "01-07-2026"
      },
      {
        "slug": "cuochi-dartificio-ricette-dal-mondo",
        "title": "Cuochi d'Artificio - Ricette dal mondo",
        "subtitle": "Quattro chiacchiere sulla presentazione del libro realizzato dall'Istituto Alberghiero di Gattinara",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_25-06-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "24-06-2026"
      },
      {
        "slug": "i-consigli-di-leonardo-tre-libri-sellerio",
        "title": "I consigli di Leonardo - Tre libri Sellerio",
        "subtitle": "Tre libri diversi ma pubblicati dalla stessa collana",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_11-06-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "10-06-2026"
      },
      {
        "slug": "lessenziale-e-invisibile",
        "title": "L'essenziale è invisibile",
        "subtitle": "Con il Piccolo Principe entriamo nel tema della libertà perduta, ovvero quel senso di smarrimento che proviamo quando ci accorgiamo di aver sacrificato la nostra parte bambina sull'altare dell'efficienza e della serietà",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_04-06-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "03-06-2026"
      },
      {
        "slug": "la-poetica-dellattenzione",
        "title": "La Poetica dell'Attenzione",
        "subtitle": "In un’epoca di distrazione cronica, riscoprire l’attenzione consapevole è un atto rivoluzionario per tornare a vivere con autenticità. Questo libro insegna a governare il proprio sguardo interiore per trasformare radical",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_28-05-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "27-05-2026"
      },
      {
        "slug": "i-consigli-di-leonardo-tre-raccolte-di-racconti",
        "title": "I consigli di Leonardo - Tre raccolte di racconti",
        "subtitle": "Tre libri distinti, ma accomunati da un'idea centrale: esplorare la complessità e la stranezza del mondo contemporaneo. Un percorso attraverso riflessioni profonde e narrazioni non convenzionali, mirato a una migliore co",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_14-05-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "13-05-2026"
      },
      {
        "slug": "la-prigione-invisibile",
        "title": "La Prigione Invisibile",
        "subtitle": "Esiste una gabbia che non ha mura, eppure sembra stringersi ogni giorno di più. In questa puntata esploriamo il legame profondo tra la distopia di 1984 di George Orwell e il senso di soffocamento che molti di noi provano",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_07-05-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "06-05-2026"
      },
      {
        "slug": "carta-canta-lo-specchio-di-dorian",
        "title": "Carta Canta - Lo Specchio di Dorian",
        "subtitle": "Il prezzo della perfezione: il volto è ancora lo specchio dell'anima o è diventato una maschera immutabile? Riflettiamo sul paradosso di Dorian Gray applicato al presente; la ricerca di una bellezza senza tempo, che, nel",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_09-02-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "08-02-2026"
      },
      {
        "slug": "carta-canta-alice-e-il-tempo",
        "title": "Carta Canta - Alice e il tempo",
        "subtitle": "In questa puntata, Alice ci accompagna in un viaggio attraverso la nostra percezione dei minuti e delle ore. Perché quando siamo felici il tempo vola, mentre un’attesa sembra infinita? Esploriamo il concetto di \"tempo in",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_22-12-2025_18-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "22-12-2025"
      },
      {
        "slug": "carta-canta-natascia-sgarbossa",
        "title": "Carta Canta - Natascia Sgarbossa",
        "subtitle": "La Ferra intervista Natascia Sgarbossa che ci accompagna nel viaggio della vita attraverso i personaggi del suo romanzo \"Sfatti\".",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta-1_27-10-2025_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "26-10-2025"
      },
      {
        "slug": "cera-una-volta-oggi-il-lupo-e-lagnello",
        "title": "C'era Una Volta Oggi - Il Lupo e l'Agnello",
        "subtitle": "Un agnellino pacifico e un lupo prepotente: chi ha ragione davvero? Una storia per riflettere su giustizia, abuso di potere e rispetto. A volte, il più forte non è il più giusto.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_01-10-2025_17-33.mp3",
        "cover": coverPlaceholder.url,
        "date": "01-10-2025"
      },
      {
        "slug": "cera-una-volta-oggi-il-lupo-e-lagnello-2",
        "title": "C'era Una Volta Oggi - Il Lupo e l'Agnello",
        "subtitle": "Un agnellino pacifico e un lupo prepotente: chi ha ragione davvero? Una storia per riflettere su giustizia, abuso di potere e rispetto. A volte, il più forte non è il più giusto.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_01-10-2025_17-33.mp3",
        "cover": coverPlaceholder.url,
        "date": "01-10-2025"
      },
      {
        "slug": "cera-una-volta-oggi-il-brutto-anatroccolo",
        "title": "C'era Una Volta Oggi - Il Brutto Anatroccolo",
        "subtitle": "Un anatroccolo diverso dagli altri scopre il suo vero valore. Una fiaba dolce per parlare di diversità, autostima e bellezza interiore. Ideale per chi si è sentito almeno una volta fuori posto.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_01-10-2025_17-31.mp3",
        "cover": coverPlaceholder.url,
        "date": "01-10-2025"
      },
      {
        "slug": "cera-una-volta-oggi-il-brutto-anatroccolo-2",
        "title": "C'era Una Volta Oggi - Il Brutto Anatroccolo",
        "subtitle": "Un anatroccolo diverso dagli altri scopre il suo vero valore. Una fiaba dolce per parlare di diversità, autostima e bellezza interiore. Ideale per chi si è sentito almeno una volta fuori posto.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_01-10-2025_17-31.mp3",
        "cover": coverPlaceholder.url,
        "date": "01-10-2025"
      },
      {
        "slug": "carta-canta-i-consigli-di-leonardo",
        "title": "Carta Canta - I consigli di Leonardo",
        "subtitle": "In questa puntata dialoghiamo su tre libri scritti da giovani donne, tre scrittrici forse poco conosciute, ma dal grandissimo talento!",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta_17-09-2025_18-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "17-09-2025"
      },
      {
        "slug": "carta-canta-le-dipendenze",
        "title": "Carta Canta - Le dipendenze",
        "subtitle": "La Ferra esplode un argomento delicato come quello delle dipendenze. lo fa attraverso un viaggio nella coscienza di Zeno, noto romanzo di Italo Svevo.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta-2_17-09-2025_18-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "17-09-2025"
      },
      {
        "slug": "carta-canta-giorgia-genatiempo",
        "title": "Carta Canta - Giorgia Genatiempo",
        "subtitle": "La Ferra intervista Giorgia Genatiempo per fare un viaggio con il personaggio di Diletta e i suoi 66 gradini.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-cartacanta/imland-cartacanta-3_17-09-2025_18-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "17-09-2025"
      }
    ]
  },
  "stuzzicaziende": {
    "slug": "stuzzicaziende",
    "name": "Stuzzicaziende",
    "tagline": "Imprese del territorio raccontate senza filtri: filiere, clienti, citta.",
    "cat": "Business",
    "cover": coverPlaceholder.url,
    "episodes": [
      {
        "slug": "osm-no-vc",
        "title": "Osm NO VC",
        "subtitle": "Barbara e Antonello ci portano alla scoperta di OSM Novara. Un'azienda che aiuta imprenditori a migliorare il proprio operato e rendere più proficuo il loro tempo e la loro marginalità conduce David Deluxe uno Stuzzicazi",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_29-04-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "28-04-2026"
      },
      {
        "slug": "gozzi-arte",
        "title": "Gozzi Arte",
        "subtitle": "Stuzzicaziende oggi parla di un’azienda centenaria. Un’azienda che ha fatto la storia dell’arte legata ai gioielli e agli orologi. Martina e Matteo Gozzi, quarta generazione attiva in azienda, ci guidano verso il domani ",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_16-03-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "15-03-2026"
      },
      {
        "slug": "ag-autotrasporti",
        "title": "AG Autotrasporti",
        "subtitle": "Il mondo dei trasporti raccontato da un'azienda alla terza generazione. Giuseppe e Giorgia di AG Trasporti accompagnati da David Deluxe ci guidano, nel vero senso della parola, nel percorso storico della loro società.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_05-02-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "04-02-2026"
      },
      {
        "slug": "cis",
        "title": "CIS",
        "subtitle": "Antonello e Mattia sono i protagonisti di questo podcast targato David Deluxe e ci raccontano di CIS, azienda che commercializza spillatori artigianali, tra lo ieri, l'oggi e il domani!",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_29-12-2025_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "28-12-2025"
      },
      {
        "slug": "barbigreen",
        "title": "Barbigreen",
        "subtitle": "Marco e Davide Barbi ci raccontano la storia dell'azienda Barbigreen, che tratta soluzioni in erba sintetica. Tra mercato e futuro ci portano alla scoperta del nuovo Green!",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_14-12-2025_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "13-12-2025"
      },
      {
        "slug": "guglielmi-rubinetterie",
        "title": "Guglielmi Rubinetterie",
        "subtitle": "Deluxe ci conduce nel viaggio di un'azienda del nostro territorio alla terza generazione. Giulia, Serena e Umberto Guglielmi ci raccontano lo ieri, l'oggi e il domani della Rubinetteria Guglielmi.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_08-12-2025_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "07-12-2025"
      },
      {
        "slug": "a2g-maglificio",
        "title": "A2G Maglificio",
        "subtitle": "A2G maglificio dal 2008 è un’azienda che lavora il cachemire e altri tessuti preziosi per i migliori brand al mondo. In questo podcast ospite Anna Goglio, titolare dell’azienda.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_09-10-2025_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "08-10-2025"
      },
      {
        "slug": "barberi-rubinetterie",
        "title": "Barberi Rubinetterie",
        "subtitle": "Marco e Francesco Barberi raccontano la loro storia fatta di passione, soddisfazioni e voglia di fare, tutto contornato da un sanno innamoramento del proprio territorio.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_30-09-2025_16-20.mp3",
        "cover": coverPlaceholder.url,
        "date": "30-09-2025"
      },
      {
        "slug": "csc-infissi",
        "title": "CSC Infissi",
        "subtitle": "Stuzzicaziende presenta CSC Infissi, azienda di Fara Novarese. Artigiani che lavorano la qualità per porte finestre e vetri. Una storia di persone che hanno fatto del loro lavoro il loro fiore all'occhiello!",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_26-08-2025_18-27.mp3",
        "cover": coverPlaceholder.url,
        "date": "26-08-2025"
      },
      {
        "slug": "stuzzicaziende-csc-infissi",
        "title": "Stuzzicaziende - CSC Infissi",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "14-08-2025"
      },
      {
        "slug": "modularee-s-r-l",
        "title": "Modularee s.r.l",
        "subtitle": "Massimo Giordano e Alessandro Randetti raccontano 15 anni di Modularee: prefabbricazione in legno stile Alto Adige, tempi rapidi, classe energetica top e artigiani locali selezionati. Con cantieri entro 70 km da Farra No",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_29-06-2025_09-05.mp3",
        "cover": coverPlaceholder.url,
        "date": "29-06-2025"
      },
      {
        "slug": "stuzzicaziende-cristina-lorenzo-di-ali-lavoro-p-5",
        "title": "Stuzzicaziende - Cristina Lorenzo di Ali Lavoro - P.5",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "29-06-2025"
      },
      {
        "slug": "cabboi-s-r-l",
        "title": "Cabboi s.r.l",
        "subtitle": "Giulia Bertinotti e Nicola Piacquadio narrano la storia di Cabboi, azienda gattinarese nata nel 1972 quando il nonno sarto Luigi decise di aprire un laboratorio di stiro e controllo capi. Oggi, sotto la guida della madre",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_15-06-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "15-06-2025"
      },
      {
        "slug": "stuzzicaziende-cristina-lorenzo-di-ali-lavoro-pt-4",
        "title": "Stuzzicaziende - Ali Lavoro - Con Carlo Messina di Labor-B -PT. 4",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "11-06-2025"
      },
      {
        "slug": "motel-hotel-piranha",
        "title": "Motel & Hotel Piranha",
        "subtitle": "Nato come celebre discoteca “Piranha”, il sito tra Novara e Vercelli diventa nel 2006 un motel tematico con 56 camere a tema e garage privati. Oggi, sotto la guida di Nicolas Manuelli, evolve in Hotel Piranha: 69 camere ",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_25-05-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "25-05-2025"
      },
      {
        "slug": "stuzzicaziende-hotel-piranha",
        "title": "Stuzzicaziende - Motel &#038; Hotel Piranha",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "25-05-2025"
      },
      {
        "slug": "stuzzicaziende-multone-s-r-l",
        "title": "Stuzzicaziende - Multone S.r.l",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "11-05-2025"
      },
      {
        "slug": "stuzzicaziende-marco-ponzetto-di-lautomobile",
        "title": "Stuzzicaziende - Marco Ponzetto di \"L'Automobile\"",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "11-05-2025"
      },
      {
        "slug": "stuzzicaziende-giuliano-valloggia-di-valpil",
        "title": "Stuzzicaziende - Giuliano Valloggia di \"Valpil\"",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "11-05-2025"
      },
      {
        "slug": "stuzzicaziende-cristina-lorenzo-di-ali-lavoro-pt-3",
        "title": "Stuzzicaziende - Cristina Lorenzo di Ali Lavoro - PT. 3",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "09-05-2025"
      },
      {
        "slug": "multone-s-r-l",
        "title": "Multone s.r.l",
        "subtitle": "Roberto e Fabio Multone, padre e figlio, ripercorrono la traiettoria dal 1976: parquet artigianale del nonno, scuola salesiana del legno, fino all’attuale laboratorio di interior su misura e all’Academy che forma i futur",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_03-04-2025_10-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "03-04-2025"
      },
      {
        "slug": "stuzzicaziende-cristina-lorenzo-di-ali-lavoro-pt-2",
        "title": "Stuzzicaziende - Cristina Lorenzo di Ali Lavoro - PT. 2",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "03-04-2025"
      },
      {
        "slug": "miroballi-rocco-s-r-l",
        "title": "Miroballi Rocco s.r.l",
        "subtitle": "Nicoletta Miroballi guida, con i fratelli, la seconda generazione dell’azienda fondata dal padre Rocco, arrivato dalla Basilicata a 14 anni. Dalla pulitura manuale dei metalli al salto pionieristico nella verniciatura a ",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-stuzzicaziende/imland-stuzzicaziende_29-03-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "29-03-2025"
      },
      {
        "slug": "stuzzicaziende-podcast-nicoletta-miroballi",
        "title": "Stuzzicaziende - Nicoletta Miroballi",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "29-03-2025"
      },
      {
        "slug": "stuzzicaziende-photottica-andorno",
        "title": "Stuzzicaziende - Photottica Andorno",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "11-03-2025"
      },
      {
        "slug": "cristina-lorenzo-ali-lavoro",
        "title": "Cristina Lorenzo di Ali Lavoro",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "26-02-2025"
      }
    ]
  },
  "terra-di-diamanti": {
    "slug": "terra-di-diamanti",
    "name": "Terra di Diamanti",
    "tagline": "Storie preziose del territorio: persone, luoghi e mestieri che brillano.",
    "cat": "Cultura",
    "cover": coverPlaceholder.url,
    "episodes": [
      {
        "slug": "freeride-paradise-contest-alagna",
        "title": "Freeride Paradise Contest Alagna",
        "subtitle": "Il mondo del Freeride Junior, per la prima volta sulle montagne valsesiane, raccontato da Giacomo atleta della Valsesia Free Lines e Francesco Barberi di Barberi Rubinetterie organizzatori dell'evento.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-diamanti/imland-diamanti_20-04-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "19-04-2026"
      },
      {
        "slug": "ascom-vercelli",
        "title": "ASCOM Vercelli",
        "subtitle": "QT Places Error: the selected post type doesn't exists or is not active in the plugin settings.Maria Cuscela intervista Angelo Santarella, presidente ASCOM di Vercelli, e Lucia Crosa, presidentessa della Delegazione Gatt",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-diamanti/imland-diamanti_08-12-2025_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "07-12-2025"
      },
      {
        "slug": "matteo-libanoro",
        "title": "Matteo Libanoro",
        "subtitle": "Il nostro Sellino intervista Matteo Libanoro, Maestro artigiano che racconta il mondo del marmo d'arte, tecnica antica che viene tutt'ora utilizzata in restauro e realizzazione di nuove opere.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-diamanti/imland-diamanti_01-12-2025_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "30-11-2025"
      },
      {
        "slug": "ruben-bertoldo",
        "title": "Ruben Bertoldo",
        "subtitle": "Davide Maiorano intervista Ruben Bertoldo, artista del metallo, che racconta la sua storia da artigiano a creatore di opere che valorizzano il territorio.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-diamanti/imland-diamanti_27-10-2025_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "26-10-2025"
      },
      {
        "slug": "speciale-gal-terre-del-sesia",
        "title": "Speciale GAL Terre del Sesia",
        "subtitle": "Gal terre del Sesia raccontata su Terre di Diamanti. L’unione della forza dei comuni della nostra zona possono dare visibilità al nostro territorio nel mondo intero tramite la presentazione di un nuovo sito e un nuovo lo",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-diamanti/imland-diamanti_28-08-2025_16-18.mp3",
        "cover": coverPlaceholder.url,
        "date": "28-08-2025"
      },
      {
        "slug": "speciale-prevenzione",
        "title": "Speciale Prevenzione",
        "subtitle": "Speciale sulla prevenzione alle truffe e altri reati con il maggior Marco Vivaldi del corpo dei carabinieri di Vercelli.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-diamanti/imland-diamanti_07-08-2025_15-59.mp3",
        "cover": coverPlaceholder.url,
        "date": "07-08-2025"
      },
      {
        "slug": "terra-di-diamanti-speciale-prevenzione",
        "title": "Terra di Diamanti - Speciale Prevenzione",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "07-08-2025"
      },
      {
        "slug": "gal-terre-del-sesia",
        "title": "GAL Terre del Sesia",
        "subtitle": "Franco Gilardi e Roberto Veggi spiegano la nuova programmazione 2023‑2027 del GAL Terre del Sesia: 2,8 milioni di fondi europei per colline e montagne dal lago d’Orta all’Alta Valsesia. Bandi per agriturismi, start‑up, c",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-diamanti/imland-diamanti_06-07-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "06-07-2025"
      },
      {
        "slug": "terra-di-diamanti-gal-terre-del-sesia-bandi-programmazione-2023-2027",
        "title": "Terra di Diamanti - GAL Terre del Sesia (Bandi programmazione 2023-2027)",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "06-07-2025"
      },
      {
        "slug": "museo-delle-campane-achille-mazzola",
        "title": "Museo delle Campane Achille Mazzola",
        "subtitle": "Alessandro Barlassina e Silvana Mazza aprono le porte del suggestivo Museo delle Campane Achille Mazzola di Valduggia. Fra fusioni ottocentesche, stampi in argilla e modelli lignei intagliati a mano, scopriamo l’arte ant",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-diamanti/imland-diamanti_29-06-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "29-06-2025"
      },
      {
        "slug": "terra-di-diamanti-museo-delle-campane-achille-mazzola",
        "title": "Terra di Diamanti - Museo delle Campane Achille Mazzola",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "29-06-2025"
      },
      {
        "slug": "1000-anni-di-varallo",
        "title": "1000 anni di Varallo",
        "subtitle": "La storica Paola Angeleri e il paleografo Massimo Bonola custodiscono a Varallo una pergamena imperiale del 1025: Corrado II confisca terre ai conti di Pombia e cita per la prima volta ponte di Varade, Rocca di Uberto e ",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-diamanti/imland-diamanti_28-06-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "28-06-2025"
      },
      {
        "slug": "terra-di-diamanti-paola-angeleri-e-massimo-bonola-1000-anni-di-varallo",
        "title": "Terra di Diamanti - 1000 anni di Varallo",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "28-06-2025"
      },
      {
        "slug": "lorella-morino",
        "title": "Lorella Morino",
        "subtitle": "Giornalista biellese, ufficio stampa del Comune di Borgosesia e consulente per enti e imprese, Lorella Morino racconta come la comunicazione istituzionale possa diventare motore di coesione territoriale. Dalla carta stam",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-diamanti/imland-diamanti_03-04-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "03-04-2025"
      },
      {
        "slug": "terra-di-diamanti-lorella-morino",
        "title": "Terra di diamanti - Lorella Morino",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "03-04-2025"
      },
      {
        "slug": "terra-di-diamanti-marta-serafini",
        "title": "Terra di diamanti - Marta Serafini",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "29-03-2025"
      },
      {
        "slug": "il-supervulcano-della-valsesia",
        "title": "Il supervulcano della Valsesia",
        "subtitle": "Il geologo Silvano Sinigoi (Uni Trieste) e il geomorfologo Marco Giardino (Uni Torino) svelano l’unicità del super‑vulcano fossile sotto la Valsesia: l’unico luogo al mondo dove si può “camminare” lungo l’intero condotto",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-diamanti/imland-diamanti_11-03-2025_10-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "11-03-2025"
      },
      {
        "slug": "marta-serafini",
        "title": "Marta Serafini",
        "subtitle": "A 33 anni la chimica farmaceutica Marta Serafini, cresciuta a Gattinara, guida un progetto internazionale da un milione di euro per sviluppare nuove molecole contro l’ipossia tumorale. Dopo la laurea all’Università del P",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-diamanti/imland-diamanti_11-03-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "11-03-2025"
      },
      {
        "slug": "terra-di-diamanti-il-supervulcano",
        "title": "Terra di diamanti - Il Supervulcano",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "11-03-2025"
      }
    ]
  },
  "istruzioni-per-luso": {
    "slug": "istruzioni-per-luso",
    "name": "Istruzioni per l'uso",
    "tagline": "Guide pratiche a mestieri, servizi e piccole scelte quotidiane.",
    "cat": "Lifestyle",
    "cover": coverPlaceholder.url,
    "episodes": [
      {
        "slug": "andrea-todaro-aziende-e-consulenza-finanziari",
        "title": "Andrea Todaro - Aziende e Consulenza Finanziari",
        "subtitle": "Alberto Colpo e Andrea Todaro tornano insieme in Istruzioni per l’uso. In questa puntata Andrea approfondisce il tema della consulenza finanziaria per le aziende.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_12-01-2026_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "11-01-2026"
      },
      {
        "slug": "studio-terapie-olistiche-episodio-3",
        "title": "Studio Terapie Olistiche - Episodio 3",
        "subtitle": "Davide Fenili, operatore olistico specializzato in Shiatsu, racconta come la sua esperienza e la sua passione lo abbiano portato a praticare trattamenti Shiatsu sui cavalli, favorendo così il benessere e l’armonia tra ca",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_3_09-09-2025_16-43.mp3",
        "cover": coverPlaceholder.url,
        "date": "09-09-2025"
      },
      {
        "slug": "studio-terapie-olistiche-episodio-2",
        "title": "Studio Terapie Olistiche - Episodio 2",
        "subtitle": "Davide Fenili, operatore olistico specializzato in Shiatsu, risponde alle domande e alle curiosità dei nostri ascoltatori!",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_2_09-09-2025_16-42.mp3",
        "cover": coverPlaceholder.url,
        "date": "09-09-2025"
      },
      {
        "slug": "studio-terapie-olistiche-episodio-1",
        "title": "Studio Terapie Olistiche - Episodio 1",
        "subtitle": "Davide Fenili, operatore olistico specializzato in Shiatsu, ci racconta la sua professione e il percorso che lo ha portato a intraprenderla.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_1_09-09-2025_16-40.mp3",
        "cover": coverPlaceholder.url,
        "date": "09-09-2025"
      },
      {
        "slug": "ottica-zonco-domande-dal-pubblico-pt-2",
        "title": "Ottica Zonco - Domande dal pubblico pt.2",
        "subtitle": "Massimo Zonco, titolare di Ottica Zonco, risponde alle domande e alle curiosità dei nostri ascoltatori!",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_3_07-09-2025_16-33.mp3",
        "cover": coverPlaceholder.url,
        "date": "07-09-2025"
      },
      {
        "slug": "istruzioni-per-luso-studio-terapie-olistiche-ep-3-cavalli-e-cavalieri",
        "title": "Istruzioni per l'uso - Studio Terapie Olistiche - Ep.3 - Cavalli e Cavalieri",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "07-08-2025"
      },
      {
        "slug": "istruzioni-per-l-uso-studio-terapie-olistiche-ep-2-domande-dal-pubblico",
        "title": "Istruzioni per L' uso - Studio Terapie Olistiche - Ep.2 - Domande dal Pubblico",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "07-08-2025"
      },
      {
        "slug": "istruzioni-per-luso-studio-terapie-olistiche-ep-1-figura-professionale",
        "title": "Istruzioni per l'uso - Studio Terapie Olistiche - Ep.1 - Figura professionale",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "07-08-2025"
      },
      {
        "slug": "istruzioni-per-luso-centro-medico-garibaldi-ep-4",
        "title": "Istruzioni per l'uso - Centro Medico Garibaldi - EP. 4",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "15-07-2025"
      },
      {
        "slug": "istruzioni-per-luso-studio-medico-tagliabue-ep-2",
        "title": "Istruzioni per l'uso - Studio Medico Tagliabue - Ep. 2",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "06-07-2025"
      },
      {
        "slug": "ottica-zonco-domande-dal-pubblico-pt-1",
        "title": "Ottica Zonco - Domande dal pubblico pt.1",
        "subtitle": "Domande dal pubblico per Massimo Zonco: come capire se servono gli occhiali, test “un occhio alla volta”, mal di testa da schermo e postura da smartphone. Si parla anche di montature in palette, lenti premium (visita agl",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_2_29-06-2025_09-15.mp3",
        "cover": coverPlaceholder.url,
        "date": "29-06-2025"
      },
      {
        "slug": "ottica-zonco-mai-smettere-di-guardale-lontano",
        "title": "Ottica Zonco - Mai smettere di guardare lontano!",
        "subtitle": "Alberto Colpo ospita Massimo Zonco, optometrista che dopo due diplomi e innumerevoli corsi ha aperto tre centri ottici fra Valdilana, Borgosesia e Gattinara. Dall’esame in Cadore ai macchinari di ultima generazione, Zonc",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_1_29-06-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "29-06-2025"
      },
      {
        "slug": "istruzioni-per-luso-studio-medico-tagliabue",
        "title": "Istruzioni per l'uso - Studio Medico Tagliabue - Ep. 1",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "29-06-2025"
      },
      {
        "slug": "istruzioni-per-luso-ottica-zonco-ep-3",
        "title": "Istruzioni per l'uso - Ottica Zonco - Ep.3",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "29-06-2025"
      },
      {
        "slug": "istruzioni-per-luso-ottica-zonco-ep-2",
        "title": "Istruzioni per l'uso - Ottica Zonco - Ep.2",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "29-06-2025"
      },
      {
        "slug": "istruzioni-per-luso-ottica-zonco-ep-1",
        "title": "Istruzioni per l'uso - Ottica Zonco - Ep.1",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "29-06-2025"
      },
      {
        "slug": "centro-medico-garibaldi-longevity",
        "title": "Istruzioni per L'uso - Centro Medico Garibaldi - EP. 3",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "03-04-2025"
      },
      {
        "slug": "filippo-mangiaracina-lombalgia",
        "title": "Filippo Mangiaracina - Lombalgia",
        "subtitle": null,
        "audio": "https://imlandradio.it/wp-content/uploads/2023/09/Istruzioni-per-luso-Filippo-Mangiaracina-Malama-P.1-Osteopatia-pediatrica-e-gravidanza-Podcast-BIS.mp3",
        "cover": coverPlaceholder.url,
        "date": "29-03-2025"
      },
      {
        "slug": "filippo-mangiaracina-di-studio-malama-la-lombalgia",
        "title": "Filippo Mangiaracina di Studio Malama - La lombalgia",
        "subtitle": "Mal di schiena nella zona lombare, sciatalgia, marshmallow dei dischi che si sfaldano: l’osteopata distingue ernia da protrusione e punta tutto sul movimento come “farmaco” preventivo. Un vademecum per capire quando serv",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_3_26-03-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "26-03-2025"
      },
      {
        "slug": "filippo-mangiaracina-di-studio-malama-la-cervicalgia",
        "title": "Filippo Mangiaracina di Studio Malama - La cervicalgia",
        "subtitle": "Dolore al collo? Mangiaracina smonta il mito della “postura perfetta” e spiega come stress, nervo vago e visceri possano scatenare la cervicalgia. Dalla valutazione clinica alle tecniche manuali, passando per l’importanz",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_2_20-03-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "20-03-2025"
      },
      {
        "slug": "filippo-mangiaracina-osteopata-di-malama-2",
        "title": "Filippo Mangiaracina - Osteopata di Malama",
        "subtitle": null,
        "audio": "https://imlandradio.it/wp-content/uploads/2023/09/Istruzioni-per-luso-Filippo-Mangiaracina-Malama-P.1-Osteopatia-pediatrica-e-gravidanza-Podcast-BIS.mp3",
        "cover": coverPlaceholder.url,
        "date": "18-03-2025"
      },
      {
        "slug": "filippo-mangiaracina-osteopata-di-malama-pt-2",
        "title": "Filippo Mangiaracina - Osteopata di Malama pt.2",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "11-03-2025"
      },
      {
        "slug": "centro-medico-garibaldi-idrocolonterapia",
        "title": "Istruzioni per l'uso - Centro Medico Garibaldi - EP.2",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "03-03-2025"
      },
      {
        "slug": "filippo-mangiaracina-di-studio-malama-osteopatia-e-gravidanza",
        "title": "Filippo Mangiaracina di Studio Malama - Osteopatia e gravidanza",
        "subtitle": "Nel primo focus tematico con Filippo Mangiaracina scopriamo perché l’osteopatia è indicata per neonati, bambini e donne in gravidanza. Reflusso dei primi mesi, piede piatto “che passa”, micro‑traumi da parto e check prev",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_1_22-02-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "22-02-2025"
      },
      {
        "slug": "andrea-todaro-episodio-6",
        "title": "Andrea Todaro - La pensione",
        "subtitle": "Quali sono le prospettive dei giovani sulla pensione? C'è il modo di tutelarsi dalle continue modifiche di legge? Andrea Todaro in questa puntata si focalizza sul tema pensione: età di uscita che sale, tasso di sostituzi",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_6_05-02-2025_09-05.mp3",
        "cover": coverPlaceholder.url,
        "date": "05-02-2025"
      },
      {
        "slug": "andrea-todaro-episodio-3",
        "title": "Andrea Todaro - Il portafoglio perfetto",
        "subtitle": "Esiste davvero un portafoglio ideale? Spoiler: no, ma c’è quello perfetto per TE. Rischio, orizzonte temporale e obiettivi di vita – barca, università dei figli o casa al mare – diventano la bussola. Andrea Todaro mostra",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_3_04-02-2025_09-10.mp3",
        "cover": coverPlaceholder.url,
        "date": "04-02-2025"
      },
      {
        "slug": "andrea-todaro-episodio-2",
        "title": "Andrea Todaro - Passaggio generazionale",
        "subtitle": "Che cos'è il passaggio generazionale? Perché è importante pensarci per tempo? In questo episodio di Istruzioni per L'uso Andrea Todaro affronta il nodo eredità: oltre 5.000 mld € di risparmio privato italiano passeranno ",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_2_04-02-2025_09-05.mp3",
        "cover": coverPlaceholder.url,
        "date": "04-02-2025"
      },
      {
        "slug": "andrea-todaro-episodio-1",
        "title": "Andrea Todaro - Il consulente finanziario",
        "subtitle": "Cosa fa un consulente finanziario? Come può aiutare le persone nelle difficoltà di oggi? Andrea Todaro racconta il salto dalla banca tradizionale alla consulenza indipendente: più libertà di prodotto, clienti dai 18 ai 7",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-istruzioni/imland-istruzioni_1_04-02-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "04-02-2025"
      }
    ]
  },
  "tedx": {
    "slug": "tedx",
    "name": "TEDx",
    "tagline": "Le idee che meritano di essere condivise, dal palco TEDx al podcast.",
    "cat": "Cultura",
    "cover": coverPlaceholder.url,
    "episodes": [
      {
        "slug": "voci-e-volti-di-tedx-biella",
        "title": "Voci e Volti di TEDx Biella",
        "subtitle": "Maria Cuscela intervista nel pre-evento i protagonisti principali, ovvero gli Speaker di TED X Biella 2025 Giulia Staccioli Direttrice artistica e Coreografa Max Hirzel Fotografo e Autore Simona Gavioli Critica d'arte e ",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-tedxbiella2025/imland-tedxbiella2025_2_16-11-2025_14-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "16-11-2025"
      },
      {
        "slug": "tedx-valori-trasmessi-al-territorio",
        "title": "TEDx - Valori trasmessi al territorio",
        "subtitle": "Irene Finiguerra in rappresentanza del gruppo di organizzatori Luca Murta, Christian Zegna e Matteo Lusiani, ci racconta come nasce l’idea di organizzare un evento così importante a Biella. Oltre agli organizzatori, sent",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-tedxbiella2025/imland-tedxbiella2025_1_16-11-2025_14-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "16-11-2025"
      }
    ]
  },
  "imweekend": {
    "slug": "imweekend",
    "name": "ImWeekend",
    "tagline": "Cosa fare da venerdi a domenica: agenda, consigli, voci in giro.",
    "cat": "Weekend",
    "cover": coverPlaceholder.url,
    "episodes": [
      {
        "slug": "speciale-imparty",
        "title": "Speciale IMParty",
        "subtitle": "In questo episodio Comix ci guida nel mondo delle feste taylor made con Tommy e Luca organizzatori di IMParty, \"la festa che da energia al territorio\"",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-imweekend/imland-imweekend_02-11-2025_00-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "01-11-2025"
      },
      {
        "slug": "tommy-segatto",
        "title": "Tommy Segatto",
        "subtitle": "In questo episodio di IM Weekend parliamo con Tommy Segatto, 26 anni, direttore artistico del Globetrotter e mente del format “Syrup”. Dall’evoluzione del clubbing alle strategie social per serate sold‑out: booking mirat",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-imweekend/imland-imweekend_18-05-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "18-05-2025"
      },
      {
        "slug": "imweekend-tommy-segatto",
        "title": "IMWEEKEND - Tommy Segatto",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "18-05-2025"
      }
    ]
  },
  "grigliata-mista": {
    "slug": "grigliata-mista",
    "name": "Grigliata Mista",
    "tagline": "Attualita, cronaca e opinioni: la settimana passata sulla brace.",
    "cat": "Cibo",
    "cover": coverPlaceholder.url,
    "episodes": [
      {
        "slug": "rs-eventi",
        "title": "R&S Eventi",
        "subtitle": "Raffaela e Serena nel 2022 uniscono le loro professionalità e background per creare R&S Eventi. In questo episodio di Grigliata Mista raccontano la propria esperienza da wedding planner per l'organizzazione dell'evento p",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-grigliata/imland-grigliata_27-10-2025_18-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "27-10-2025"
      },
      {
        "slug": "asd-mgco3-gym",
        "title": "ASD MgCO3 GYM",
        "subtitle": "Il mondo della ginnastica artistica e le attività svolte da ASD MgCO3 Gym nel racconto delle piccole ginnaste Giulia e Ginevra, accompagnate dalla presidente e allenatrice Lisa Ballarini.",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-grigliata/imland-grigliata_21-10-2025_12-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "21-10-2025"
      },
      {
        "slug": "scuola-di-danza-di-arborio",
        "title": "Grigliata Mista - Scuola di Danza di Arborio",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "27-07-2025"
      },
      {
        "slug": "robe-da-matti",
        "title": "Robe da matti",
        "subtitle": "In questa puntata di Grigliata Mista gli “Amici dell’Asilo Patriarca” trasformano un’idea folle in uno spettacolo corale: ex‑alunni, maestri e cittadini salgono sul palco dell’Auditorium Lux (26‑27 aprile 2025) per racco",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-grigliata/imland-grigliata_02-07-2025_22-19.mp3",
        "cover": coverPlaceholder.url,
        "date": "02-07-2025"
      },
      {
        "slug": "sos-nepal",
        "title": "SOS Nepal",
        "subtitle": "Renzo Andorno racconta la nascita di SOS Nepal, l’associazione fondata dalla sua famiglia dopo un viaggio tra le montagne himalayane. Da una scuola e un ospedale costruiti dopo il terremoto del 2015, fino alla prima acca",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-grigliata/imland-grigliata_02-07-2025_22-15.mp3",
        "cover": coverPlaceholder.url,
        "date": "02-07-2025"
      },
      {
        "slug": "grigliata-mista-robe-da-matti-amici-dellasilo-patriarca",
        "title": "Grigliata Mista - Robe da Matti - Amici dell'Asilo Patriarca",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "03-04-2025"
      },
      {
        "slug": "renzo-andorno-di-sos-nepal",
        "title": "Renzo Andorno di SOS Nepal",
        "subtitle": "Scopri di più sul sito di SOS Nepal",
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "03-03-2025"
      }
    ]
  },
  "schema-libero": {
    "slug": "schema-libero",
    "name": "Schema Libero",
    "tagline": "Sport, campi e spogliatoi: il territorio visto dal bordo campo.",
    "cat": "Lifestyle",
    "cover": coverPlaceholder.url,
    "episodes": [
      {
        "slug": "sebastien-frey",
        "title": "Sébastien Frey",
        "subtitle": "Tra sacrifici, fame di rivalsa e amicizie vere (“due o tre, come l’amore”), l’ex portiere svela il dietro le quinte del calcio‑show e il valore di credere nei propri sogni – perché «sognare non costa nulla, ma chiede sud",
        "audio": "https://dts.podtrac.com/redirect.mp3/podcast.imlandradio.it/channel-files/imland-schemalibero/imland-schemalibero_17-03-2025_09-00.mp3",
        "cover": coverPlaceholder.url,
        "date": "17-03-2025"
      },
      {
        "slug": "sebastien-frey-schema-libero",
        "title": "Sébastien Frey - Schema Libero",
        "subtitle": null,
        "audio": "https://stream.aiir.com/ylpompusqpatv",
        "cover": coverPlaceholder.url,
        "date": "17-03-2025"
      }
    ]
  },
  "speciali": {
    "slug": "speciali",
    "name": "Speciali",
    "tagline": "Puntate speciali, dirette ed eventi raccontati da IMLAND.",
    "cat": "Cultura",
    "cover": coverPlaceholder.url,
    "episodes": [
      {
        "slug": "speciale-serata-gal-terre-del-sesia",
        "title": "Speciale serata • GAL Terre del Sesia",
        "subtitle": "EPISODI Istruzioni per l’uso Ep.1 Il consulente finanziario – con Andrea Todaro Ep.2 Andrea Todaro – Patrimonio e successione Ep.3 Il portafogli perfetto con Andrea Todaro Ep.4 Istruzioni per l’uso Ep.1 Il consulente fin",
        "audio": "https://imlandradio.it/wp-content/uploads/2025/02/GAL-Podcast.mp3",
        "cover": coverPlaceholder.url,
        "date": "08-02-2025"
      }
    ]
  },
  "andrea-todaro": {
    "slug": "andrea-todaro",
    "name": "Andrea Todaro",
    "tagline": "Le conversazioni e gli speciali firmati da Andrea Todaro.",
    "cat": "Cultura",
    "cover": coverPlaceholder.url,
    "episodes": [
      {
        "slug": "domande-dagli-ascoltatori-con-andrea-todaro-ep-8",
        "title": "Domande dagli ascoltatori con Andrea Todaro Ep.8",
        "subtitle": null,
        "audio": "https://imlandradio.it/wp-content/uploads/2025/02/IPU-Andrea-Todaro-8-Titolo.mp3",
        "cover": coverPlaceholder.url,
        "date": "05-02-2025"
      },
      {
        "slug": "andrea-todaro-risponde-ep-7",
        "title": "Andrea Todaro risponde alle vostre domande Ep.7",
        "subtitle": null,
        "audio": "https://imlandradio.it/wp-content/uploads/2025/02/IPU-Andrea-Todaro-7-Titolo.mp3",
        "cover": coverPlaceholder.url,
        "date": "05-02-2025"
      },
      {
        "slug": "la-pensione-con-andrea-todaro-ep-6",
        "title": "La pensione con Andrea Todaro Ep.6",
        "subtitle": null,
        "audio": "https://imlandradio.it/wp-content/uploads/2025/02/IPU-Andrea-Todaro-6-Titolo.mp3",
        "cover": coverPlaceholder.url,
        "date": "05-02-2025"
      },
      {
        "slug": "consulente-finanziario-vs-intelligenza-artificiale-con-andrea-todaro-ep-5",
        "title": "Consulente finanziario vs intelligenza artificiale con Andrea Todaro Ep.5",
        "subtitle": null,
        "audio": "https://imlandradio.it/wp-content/uploads/2025/02/IPU-Andrea-Todaro-5-Titolo.mp3",
        "cover": coverPlaceholder.url,
        "date": "05-02-2025"
      },
      {
        "slug": "obbligazioni-vs-azioni-con-andrea-todaro-ep-4",
        "title": "Obbligazioni vs azioni con Andrea Todaro Ep.4",
        "subtitle": null,
        "audio": "https://imlandradio.it/wp-content/uploads/2025/02/IPU-Andrea-Todaro-4-Obbligazioni-vs-azioni.mp3",
        "cover": coverPlaceholder.url,
        "date": "04-02-2025"
      },
      {
        "slug": "il-passaggio-generazionale-con-andrea-todaro-ep-2",
        "title": "Il passaggio generazionale con Andrea Todaro Ep.2",
        "subtitle": "EPISODI Istruzioni per l’uso Ep.1 Il consulente finanziario – con Andrea Todaro Ep.2 Andrea Todaro – Patrimonio e successione Ep.3 Il portafogli perfetto con Andrea Todaro Ep.4 Istruzioni per l’uso Ep.1 Il consulente fin",
        "audio": "https://imlandradio.it/wp-content/uploads/2025/02/IPU-Andrea-Todaro-2-Il-passaggio-generazionale.mp3",
        "cover": coverPlaceholder.url,
        "date": "04-02-2025"
      },
      {
        "slug": "il-consulente-finanziario-con-andrea-todaro-ep-1",
        "title": "Il consulente finanziario con Andrea Todaro Ep.1",
        "subtitle": null,
        "audio": "https://imlandradio.it/wp-content/uploads/2025/02/IPU-Andrea-Todaro-1-Consulente-finaziario-ed-investimenti.mp3",
        "cover": coverPlaceholder.url,
        "date": "04-02-2025"
      },
      {
        "slug": "il-portafoglio-perfetto-con-andrea-todaro-ep-3",
        "title": "Il portafoglio perfetto con Andrea Todaro Ep.3",
        "subtitle": null,
        "audio": "https://imlandradio.it/wp-content/uploads/2025/02/IPU-Andrea-Todaro-1-Consulente-finaziario-ed-investimenti.mp3",
        "cover": coverPlaceholder.url,
        "date": "04-02-2025"
      }
    ]
  }
};

const officialCovers: Record<string, string> = {
  "assaggi": coverAssaggi.url,
  "carta-canta": coverCartaCanta.url,
  "stuzzicaziende": coverStuzzicaziende.url,
  "terra-di-diamanti": coverTerraDiamanti.url,
  "istruzioni-per-luso": coverIstruzioni.url,
  "imweekend": coverImweekend.url,
  "grigliata-mista": coverGrigliata.url,
};


for (const [slug, cover] of Object.entries(officialCovers)) {
  const program = podcastPrograms[slug];
  if (!program || !cover) continue;
  program.cover = cover;
  for (const ep of program.episodes) {
    ep.cover = cover;
  }
}

export const podcastProgramList: PodcastProgram[] = Object.values(podcastPrograms);
