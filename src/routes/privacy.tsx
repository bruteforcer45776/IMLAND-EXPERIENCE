import { createFileRoute } from "@tanstack/react-router";
import { SectionDecor } from "../components/decor";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · IMLAND EXPERIENCE" },
      {
        name: "description",
        content:
          "Informativa sul trattamento dei dati personali di IMLAND EXPERIENCE SRL ai sensi del Regolamento UE 2016/679 (GDPR).",
      },
      { property: "og:title", content: "Privacy Policy · IMLAND EXPERIENCE" },
      {
        property: "og:description",
        content: "Informativa sulla privacy ai sensi del GDPR.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="decor-host overflow-hidden mx-auto max-w-3xl px-4 section-pad md:px-8">
      <SectionDecor variant="bubbles" />
      <h1 className="text-display-l">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
      </p>

      <div className="prose prose-invert mt-10 max-w-none space-y-6 text-foreground/85">
        <p>
          La presente informativa è resa ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679
          (GDPR) a chi consulta il sito e utilizza i servizi offerti da{" "}
          <strong>IMLAND EXPERIENCE SRL</strong>.
        </p>

        <h2 className="text-h2-im">1. Titolare del trattamento</h2>
        <p>
          IMLAND EXPERIENCE SRL — P.IVA 02802650024.
          <br />
          Email:{" "}
          <a href="mailto:info@imlandradio.com" className="text-signal">
            info@imlandradio.com
          </a>
          <br />
          Telefono: +39 351 432 3003
        </p>

        <h2 className="text-h2-im">2. Dati raccolti</h2>
        <p>
          Raccogliamo i dati che ci fornisci volontariamente (nome, email, città) tramite i moduli
          di iscrizione, contatto e membership, oltre ai dati di navigazione (indirizzo IP, browser,
          pagine visitate) raccolti in forma aggregata.
        </p>

        <h2 className="text-h2-im">3. Finalità</h2>
        <ul className="list-disc pl-6">
          <li>Erogazione dei servizi richiesti (radio, podcast, eventi, membership).</li>
          <li>Riscontro alle richieste inviate tramite i moduli di contatto.</li>
          <li>Invio, previo consenso, di comunicazioni e newsletter.</li>
          <li>Adempimenti di legge e obblighi contrattuali.</li>
        </ul>

        <h2 className="text-h2-im">4. Base giuridica</h2>
        <p>
          Il trattamento si fonda sul consenso dell&apos;interessato, sulla necessità di eseguire un
          contratto e sull&apos;adempimento di obblighi di legge (art. 6 GDPR).
        </p>

        <h2 className="text-h2-im">5. Conservazione</h2>
        <p>
          I dati sono conservati per il tempo strettamente necessario alle finalità per cui sono
          raccolti e nel rispetto dei termini di legge.
        </p>

        <h2 className="text-h2-im">6. Diritti dell&apos;interessato</h2>
        <p>
          Puoi esercitare in qualsiasi momento i diritti di accesso, rettifica, cancellazione,
          limitazione, portabilità e opposizione scrivendo a{" "}
          <a href="mailto:info@imlandradio.com" className="text-signal">
            info@imlandradio.com
          </a>
          . Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali.
        </p>

        <h2 className="text-h2-im">7. Cookie</h2>
        <p>
          Il sito utilizza cookie tecnici e, previo consenso, cookie di analisi e marketing.
          Consulta la nostra Cookie Policy per il dettaglio e per modificare le preferenze.
        </p>
      </div>
    </section>
  );
}
