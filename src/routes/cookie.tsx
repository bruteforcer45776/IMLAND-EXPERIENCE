import { createFileRoute } from "@tanstack/react-router";
import { SectionDecor } from "../components/decor";

export const Route = createFileRoute("/cookie")({
  head: () => ({
    meta: [
      { title: "Cookie Policy · IMLAND EXPERIENCE" },
      {
        name: "description",
        content:
          "Informativa estesa sull'uso dei cookie e delle tecnologie di tracciamento sul sito IMLAND EXPERIENCE.",
      },
      { property: "og:title", content: "Cookie Policy · IMLAND EXPERIENCE" },
      {
        property: "og:description",
        content: "Cookie policy IMLAND ai sensi del GDPR e della normativa italiana.",
      },
    ],
  }),
  component: CookiePage,
});

function CookiePage() {
  const resetConsent = () => {
    try {
      localStorage.removeItem("imland-cookie-consent");
      window.dispatchEvent(new Event("imland:cookie-reset"));
    } catch {
      // ignore
    }
  };

  return (
    <section className="decor-host overflow-hidden mx-auto max-w-3xl px-4 section-pad md:px-8">
      <SectionDecor variant="bubbles" />
      <h1 className="text-display-l">Cookie Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Ultimo aggiornamento: 17 settembre 2026</p>

      <div className="mt-10 space-y-6 text-foreground/85">
        <p>
          Questo sito utilizza cookie e tecnologie simili per garantire il corretto funzionamento
          delle pagine, migliorare l&apos;esperienza utente e — previo consenso — per finalità di
          analisi e marketing, in conformità al GDPR (Reg. UE 2016/679) e alle linee guida del
          Garante per la protezione dei dati personali.
        </p>

        <h2 className="text-h2-im">1. Cookie tecnici</h2>
        <p>
          Necessari al funzionamento del sito e alla memorizzazione delle preferenze. Non richiedono
          consenso.
        </p>

        <h2 className="text-h2-im">2. Memorie locali e autenticazione</h2>
        <p>
          Il sito può usare localStorage o sessionStorage per conservare preferenze cookie, chiusura
          dei popup e impostazioni dell'interfaccia. L'autenticazione e le sessioni delle aree
          riservate sono gestite tramite Supabase e possono richiedere identificativi tecnici
          strettamente necessari alla sicurezza e alla continuità della sessione.
        </p>

        <h2 className="text-h2-im">3. Cookie di analisi</h2>
        <p>
          Utilizzati in forma aggregata per misurare l&apos;uso del sito e migliorare i contenuti.
          Vengono attivati solo dopo il tuo consenso.
        </p>

        <h2 className="text-h2-im">4. Cookie di marketing</h2>
        <p>
          Utilizzati per proporre contenuti e comunicazioni personalizzate. Vengono attivati solo
          dopo il tuo consenso.
        </p>

        <h2 className="text-h2-im">5. Gestione e durata delle preferenze</h2>
        <p>
          Le categorie facoltative sono disattivate fino a una scelta positiva. La preferenza viene
          conservata nel browser e può essere modificata o revocata in qualsiasi momento con il
          pulsante seguente. Il rifiuto è semplice quanto l'accettazione e non limita i servizi
          essenziali.
        </p>

        <button
          type="button"
          onClick={resetConsent}
          className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Rivedi le preferenze cookie
        </button>

        <h2 className="text-h2-im">6. Terze parti e browser</h2>
        <p>
          Se vengono attivati servizi esterni che impostano cookie o identificatori propri, la
          relativa categoria resta subordinata al consenso quando richiesto. Puoi inoltre cancellare
          o bloccare cookie e memorie locali dalle impostazioni del browser; il blocco degli
          strumenti tecnici può compromettere accesso e preferenze.
        </p>

        <h2 className="text-h2-im">7. Contatti</h2>
        <p>
          Titolare del trattamento: IMLAND EXPERIENCE SRL — P.IVA 02802650024 —{" "}
          <a href="mailto:imlandexperience@gmail.com" className="text-signal">
            imlandexperience@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
