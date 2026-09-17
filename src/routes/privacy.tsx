import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionDecor } from "../components/decor";
import { canonical } from "../lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · IMLAND EXPERIENCE" },
      {
        name: "description",
        content:
          "Informativa sul trattamento dei dati personali di IMLAND EXPERIENCE SRL ai sensi degli articoli 13 e 14 del GDPR.",
      },
    ],
    links: [canonical("/privacy")],
  }),
  component: PrivacyPage,
});

const email = "imlandexperience@gmail.com";

function PrivacyPage() {
  return (
    <section className="decor-host mx-auto max-w-4xl overflow-hidden px-4 section-pad md:px-8">
      <SectionDecor variant="bubbles" />
      <div className="text-center">
        <h1 className="text-display-l">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Ultimo aggiornamento: 17 settembre 2026
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-3xl space-y-8 text-left text-foreground/85">
        <p>
          Questa informativa, resa ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679
          (“GDPR”), descrive come vengono trattati i dati personali di chi visita il sito, crea un
          account o utilizza i servizi IMLAND.
        </p>

        <section>
          <h2 className="text-h2-im">1. Titolare del trattamento</h2>
          <p className="mt-3">
            <strong>IMLAND EXPERIENCE SRL</strong>, C.F. e P.IVA 02802650024, REA VC-316051, sede
            legale in Via Costantino Durio 16, 13019 Varallo (VC), Italia. Per richieste privacy e
            per l’esercizio dei diritti:{" "}
            <a className="text-signal underline" href={`mailto:${email}`}>
              {email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">2. Dati trattati</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>dati identificativi e di contatto, come nome, cognome, email e telefono;</li>
            <li>dati dell’account, preferenze, contenuti salvati e cronologia delle operazioni;</li>
            <li>
              dati di profilo Member o aziendale, sedi, referenti, materiali e contenuti pubblicati;
            </li>
            <li>
              candidature, curriculum, messaggi, proposte, recensioni, feedback e segnalazioni;
            </li>
            <li>
              dati tecnici e di sicurezza, inclusi IP, dispositivo, browser, log e identificativi di
              sessione;
            </li>
            <li>preferenze cookie e dati statistici, nei limiti della scelta effettuata.</li>
          </ul>
          <p className="mt-3">
            Non chiediamo categorie particolari di dati personali. Evita di inserirle nei campi
            liberi o nei documenti, salvo siano strettamente necessarie e legittimamente trattabili.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">3. Finalità e basi giuridiche</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              fornire account, aree riservate, radio, podcast, eventi, candidature e servizi
              richiesti: misure precontrattuali o contratto;
            </li>
            <li>rispondere a contatti, proposte e segnalazioni: esecuzione della richiesta;</li>
            <li>
              gestire sicurezza, prevenzione abusi, continuità e difesa dei diritti: legittimo
              interesse;
            </li>
            <li>
              adempiere a obblighi amministrativi, fiscali, contabili e richieste dell’autorità:
              obbligo di legge;
            </li>
            <li>
              inviare newsletter o comunicazioni promozionali non necessarie: consenso revocabile;
            </li>
            <li>attivare analisi o marketing non tecnici: consenso tramite il pannello cookie.</li>
          </ul>
          <p className="mt-3">
            La presa visione dell’informativa non sostituisce il consenso quando richiesto e non
            rende obbligatori trattamenti facoltativi.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">4. Conferimento</h2>
          <p className="mt-3">
            I dati contrassegnati come obbligatori sono necessari per fornire il servizio o
            rispondere alla richiesta. Il mancato conferimento può impedire l’invio, l’account o
            l’uso della funzione. I consensi marketing e analytics sono facoltativi e il rifiuto non
            limita i servizi essenziali.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">5. Database, modalità e sicurezza</h2>
          <p className="mt-3">
            I dati sono trattati con strumenti digitali e misure proporzionate al rischio. Il sito
            utilizza <strong>Supabase</strong> per database PostgreSQL, autenticazione,
            archiviazione e funzioni backend. Supabase agisce, per i dati trattati per conto di
            IMLAND, come fornitore e responsabile del trattamento secondo gli accordi applicabili.
            L’accesso è regolato da autorizzazioni, controlli applicativi e policy di sicurezza a
            livello di riga dove previste.
          </p>
          <p className="mt-3">
            Nessun sistema garantisce sicurezza assoluta. Eventuali violazioni vengono gestite
            secondo gli obblighi applicabili, incluse le valutazioni sulle notifiche agli
            interessati e all’autorità.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">6. Destinatari e trasferimenti</h2>
          <p className="mt-3">
            I dati possono essere trattati da personale autorizzato e fornitori necessari a hosting,
            database, autenticazione, email, assistenza, sicurezza e manutenzione; possono essere
            comunicati a consulenti, partner coinvolti nel servizio, aziende destinatarie di
            candidature e autorità quando previsto.
          </p>
          <p className="mt-3">
            Se un fornitore tratta dati fuori dallo Spazio Economico Europeo, il trasferimento
            avviene sulla base di una decisione di adeguatezza o di altre garanzie previste dagli
            articoli 44 e seguenti GDPR, come clausole contrattuali standard, quando applicabili. Le
            garanzie possono essere richieste al Titolare.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">7. Conservazione</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>account e profili: fino alla chiusura, salvo obblighi o contestazioni;</li>
            <li>contatti, proposte e feedback: per la gestione e, di norma, non oltre 24 mesi;</li>
            <li>
              candidature e CV: per la selezione e, salvo diversa necessità o consenso, non oltre 12
              mesi;
            </li>
            <li>
              dati amministrativi e contrattuali: per i termini di legge, normalmente 10 anni;
            </li>
            <li>
              consensi e prove: per la durata del trattamento e il periodo necessario a dimostrarne
              la liceità;
            </li>
            <li>log di sicurezza: per il periodo proporzionato alla finalità e al rischio.</li>
          </ul>
          <p className="mt-3">
            Alla scadenza i dati vengono cancellati o anonimizzati, salvo necessità di tutela
            giudiziaria.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">8. Diritti</h2>
          <p className="mt-3">
            Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opposizione,
            e revocare il consenso senza pregiudicare i trattamenti già effettuati. Scrivi a{" "}
            <a className="text-signal underline" href={`mailto:${email}`}>
              {email}
            </a>
            . Potremo verificare la tua identità. Puoi proporre reclamo al{" "}
            <a
              className="text-signal underline"
              href="https://www.garanteprivacy.it/"
              target="_blank"
              rel="noreferrer"
            >
              Garante per la protezione dei dati personali
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">9. Minori</h2>
          <p className="mt-3">
            Le funzioni che comportano account o invio autonomo di dati non sono destinate a minori
            che non abbiano l’età richiesta dalla legge per agire senza l’autorizzazione di chi
            esercita la responsabilità genitoriale.
          </p>
        </section>

        <section>
          <h2 className="text-h2-im">10. Cookie e aggiornamenti</h2>
          <p className="mt-3">
            Per cookie e tecnologie simili consulta la{" "}
            <Link to="/cookie" className="text-signal underline">
              Cookie Policy
            </Link>
            . Questa informativa può essere aggiornata per modifiche normative o tecniche; la data
            in alto identifica la versione vigente.
          </p>
        </section>
      </div>
    </section>
  );
}
