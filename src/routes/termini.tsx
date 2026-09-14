import { createFileRoute } from "@tanstack/react-router";
import { SectionDecor } from "../components/decor";

export const Route = createFileRoute("/termini")({
  head: () => ({
    meta: [
      { title: "Termini e Condizioni · IMLAND EXPERIENCE" },
      {
        name: "description",
        content:
          "Termini e condizioni d'uso del sito e dei servizi di IMLAND EXPERIENCE SRL.",
      },
      { property: "og:title", content: "Termini e Condizioni · IMLAND EXPERIENCE" },
      {
        property: "og:description",
        content: "Termini d'uso di sito e servizi IMLAND.",
      },
    ],
  }),
  component: TerminiPage,
});

function TerminiPage() {
  return (
    <section className="decor-host overflow-hidden mx-auto max-w-3xl px-4 section-pad md:px-8">
      <SectionDecor variant="bubbles" />
      <h1 className="text-display-l">
        Termini e Condizioni
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
      </p>

      <div className="mt-10 space-y-6 text-foreground/85">
        <h2 className="text-h2-im">1. Oggetto</h2>
        <p>
          I presenti termini regolano l&apos;utilizzo del sito e dei servizi
          offerti da <strong>IMLAND EXPERIENCE SRL</strong> (P.IVA
          02802650024), inclusi radio, podcast, eventi, membership e
          contenuti editoriali.
        </p>

        <h2 className="text-h2-im">2. Accettazione</h2>
        <p>
          L&apos;accesso al sito e l&apos;utilizzo dei servizi implicano
          l&apos;accettazione integrale dei presenti termini. In caso di
          disaccordo, si prega di non utilizzare il sito.
        </p>

        <h2 className="text-h2-im">3. Proprietà intellettuale</h2>
        <p>
          Marchi, loghi, contenuti audio, testi, immagini e software sono di
          proprietà di IMLAND EXPERIENCE SRL o dei rispettivi titolari e sono
          tutelati dalla normativa vigente. È vietata la riproduzione, anche
          parziale, senza autorizzazione scritta.
        </p>

        <h2 className="text-h2-im">4. Uso dei servizi</h2>
        <p>
          L&apos;utente si impegna a utilizzare il sito nel rispetto della
          legge, del buon costume e dei diritti di terzi. È vietato ogni uso
          che possa arrecare danno, sovraccarico o interferenza al servizio.
        </p>

        <h2 className="text-h2-im">5. Membership</h2>
        <p>
          Le condizioni economiche e i benefit dei piani membership sono
          descritti nella pagina dedicata. IMLAND si riserva di modificare
          benefici e condizioni con congruo preavviso agli iscritti.
        </p>

        <h2 className="text-h2-im">6. Limitazione di responsabilità</h2>
        <p>
          IMLAND non risponde di interruzioni del servizio dovute a cause di
          forza maggiore, manutenzioni tecniche o eventi al di fuori del
          proprio controllo. I contenuti sono offerti &quot;as-is&quot; senza
          garanzia di accuratezza o completezza.
        </p>

        <h2 className="text-h2-im">7. Licenze</h2>
        <p>
          La diffusione musicale è coperta da licenza SIAE n. 202500000226 e
          licenza SCF n. 116/5/24.
        </p>

        <h2 className="text-h2-im">8. Legge applicabile e foro</h2>
        <p>
          I presenti termini sono regolati dalla legge italiana. Per ogni
          controversia è competente in via esclusiva il Foro della sede
          legale di IMLAND EXPERIENCE SRL, salvo diverse norme inderogabili
          in favore del consumatore.
        </p>

        <h2 className="text-h2-im">9. Contatti</h2>
        <p>
          Per informazioni:{" "}
          <a href="mailto:info@imlandradio.com" className="text-signal">
            info@imlandradio.com
          </a>{" "}
          · +39 351 432 3003.
        </p>
      </div>
    </section>
  );
}
