import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionDecor } from "../components/decor";

export const Route = createFileRoute("/termini")({
  head: () => ({
    meta: [
      { title: "Termini e Condizioni · IMLAND EXPERIENCE" },
      {
        name: "description",
        content: "Condizioni d'uso del sito e dei servizi IMLAND EXPERIENCE.",
      },
    ],
  }),
  component: TerminiPage,
});

const email = "imlandexperience@gmail.com";

function TerminiPage() {
  return (
    <section className="decor-host mx-auto max-w-4xl overflow-hidden px-4 section-pad md:px-8">
      <SectionDecor variant="bubbles" />
      <div className="text-center">
        <h1 className="text-display-l">Termini e Condizioni</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Ultimo aggiornamento: 17 settembre 2026
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-3xl space-y-8 text-left text-foreground/85">
        <section>
          <h2 className="text-h2-im">1. Gestore e contatti</h2>
          <p className="mt-3">
            Il sito e i servizi IMLAND sono gestiti da <strong>IMLAND EXPERIENCE SRL</strong>, C.F.
            e P.IVA 02802650024, REA VC-316051, sede legale in Via Costantino Durio 16, 13019
            Varallo (VC), Italia. Email per assistenza, comunicazioni formali e contestazioni:{" "}
            <a className="text-signal underline" href={`mailto:${email}`}>
              {email}
            </a>
            . Telefono: +39 351 432 3003.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">2. Ambito e accettazione</h2>
          <p className="mt-3">
            Queste condizioni regolano sito, radio, podcast, eventi, aree riservate, servizi Member,
            contenuti editoriali, recensioni, candidature e altri servizi digitali. La consultazione
            è soggetta alle clausole pertinenti; quando è presente una casella di accettazione,
            l’utente conclude l’accordo selezionandola e inviando la richiesta.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">3. Account e credenziali</h2>
          <p className="mt-3">
            I dati devono essere corretti e aggiornati. L’utente custodisce le credenziali, non
            condivide l’account e segnala accessi non autorizzati. IMLAND può sospendere account
            usati in modo illecito, fraudolento o contrario a queste condizioni, nel rispetto delle
            tutele inderogabili.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">4. Regole di utilizzo</h2>
          <p className="mt-3">
            È vietato pubblicare contenuti illeciti, falsi, discriminatori, diffamatori o lesivi;
            inviare malware, spam o comunicazioni ingannevoli; tentare accessi non autorizzati;
            estrarre dati in massa; interferire con sicurezza o funzionamento; usare marchi o
            contenuti oltre quanto autorizzato.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">5. Contenuti degli utenti</h2>
          <p className="mt-3">
            L’utente conserva i diritti sui contenuti inviati e dichiara di poterli utilizzare. Con
            l’invio concede a IMLAND una licenza non esclusiva e limitata a ospitare, moderare,
            adattare tecnicamente, mostrare e distribuire il contenuto nell’ambito del servizio
            richiesto. IMLAND può rimuovere contenuti illeciti o incompatibili; la decisione può
            essere contestata a {email}.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">6. Recensioni e contenuti editoriali</h2>
          <p className="mt-3">
            Recensioni e segnalazioni devono descrivere esperienze autentiche. Sono vietati
            incentivi condizionati a valutazioni positive, manipolazioni e contenuti coordinati. Le
            notizie di terzi restano attribuite alle fonti indicate; richieste di rettifica possono
            essere inviate all’indirizzo di contatto.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">7. JOBS e candidature</h2>
          <p className="mt-3">
            IMLAND mette in contatto candidati e soggetti che pubblicano opportunità, ma non è
            datore di lavoro, agenzia per il lavoro o parte del rapporto eventualmente concluso,
            salvo indicazione espressa. Chi pubblica è responsabile di veridicità, liceità e non
            discriminazione; il candidato dei dati e documenti inviati.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">8. Servizi Member, eventi e pagamenti</h2>
          <p className="mt-3">
            Durata, prezzo, rinnovo, recesso e condizioni specifiche dei servizi a pagamento sono
            comunicati prima dell’acquisto o adesione e prevalgono per quel servizio. Nessun
            addebito avviene senza conferma esplicita. Restano integri i diritti inderogabili del
            consumatore, incluso l’eventuale diritto di recesso.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">9. Proprietà intellettuale</h2>
          <p className="mt-3">
            Marchi, loghi, grafica, software, testi, immagini, audio e format appartengono a IMLAND
            o ai rispettivi titolari. È consentita la fruizione personale nei limiti del servizio;
            riproduzione, modifica, vendita o distribuzione richiedono autorizzazione o base di
            legge. Diffusione musicale: licenza SIAE n. 202500000226 e SCF n. 116/5/24.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">10. Servizi di terzi</h2>
          <p className="mt-3">
            Il sito può integrare streaming, mappe, social, email e Supabase. Tali servizi applicano
            condizioni e informative proprie. IMLAND non controlla disponibilità o contenuti
            esterni, ma seleziona e gestisce i fornitori secondo gli obblighi applicabili.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">11. Disponibilità e responsabilità</h2>
          <p className="mt-3">
            IMLAND adotta misure ragionevoli per continuità e accuratezza, ma il servizio può essere
            sospeso per manutenzione, sicurezza, guasti o forza maggiore. Nei limiti consentiti
            dalla legge non risponde di danni indiretti non prevedibili. Nulla esclude
            responsabilità per dolo, colpa grave, danni alla persona o altri casi non limitabili, né
            riduce le garanzie inderogabili del consumatore.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">12. Privacy e database</h2>
          <p className="mt-3">
            Il trattamento dei dati è descritto nella{" "}
            <Link to="/privacy" className="text-signal underline">
              Privacy Policy
            </Link>
            . Database, autenticazione e alcune funzioni backend sono erogati tramite Supabase.
            Cookie e preferenze sono descritti nella{" "}
            <Link to="/cookie" className="text-signal underline">
              Cookie Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">13. Modifiche e cessazione</h2>
          <p className="mt-3">
            Le condizioni possono essere aggiornate per modifiche normative, tecniche o dei servizi.
            Le variazioni sostanziali per utenti registrati saranno comunicate con mezzi adeguati e,
            quando necessario, richiederanno una nuova accettazione. L’utente può cessare l’uso e
            chiedere la chiusura dell’account.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">14. Legge, reclami e controversie</h2>
          <p className="mt-3">
            Si applica la legge italiana. Prima di agire, l’utente è invitato a scrivere a{" "}
            <a className="text-signal underline" href={`mailto:${email}`}>
              {email}
            </a>
            , descrivendo problema e soluzione richiesta. Per i consumatori resta competente il
            giudice del luogo di residenza o domicilio quando previsto da norme inderogabili; negli
            altri casi è competente il Foro di Vercelli. Il consumatore può rivolgersi a un
            organismo ADR riconosciuto. La piattaforma europea ODR è stata dismessa il 20 luglio
            2025; l’elenco aggiornato degli organismi è disponibile sul portale della Commissione
            europea.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">15. Clausole finali</h2>
          <p className="mt-3">
            L’invalidità di una clausola non pregiudica le altre. La mancata applicazione
            occasionale di un diritto non è rinuncia. Le condizioni specifiche accettate per un
            servizio prevalgono sulle presenti limitatamente a quel servizio.
          </p>
        </section>
      </div>
    </section>
  );
}
