import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { canonical, faqLd, jsonLd } from "../lib/seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

const faqSections = [
  {
    title: "Radio",
    intro: "Diretta, palinsesto e canali di ascolto.",
    items: [
      { q: "Come si ascolta la radio di IMLAND?", a: "Puoi ascoltare gratuitamente IMLAND Radio dalla pagina Radio e dal player presente sul sito, dall’app IMLAND, su TuneIn, su myTuner Radio e tramite smart speaker. La diretta è disponibile 24 ore su 24." },
      { q: "Dove trovo il palinsesto?", a: "Il palinsesto aggiornato è disponibile nella pagina Radio, con giorni, orari e programmi in onda." },
    ],
  },
  {
    title: "Podcast",
    intro: "Format editoriali e produzioni audio.",
    items: [
      { q: "Dove trovo i podcast IMLAND?", a: "Nella sezione Podcast trovi i format editoriali e tutte le puntate disponibili. My Podcast è lo spazio dedicato ai progetti audio realizzati su misura per aziende e organizzazioni." },
      { q: "Posso proporre un podcast?", a: "Sì. Dalla pagina Contatti puoi presentare l’idea, il tema e gli obiettivi del progetto: il team valuterà insieme a te il percorso più adatto." },
    ],
  },
  {
    title: "Eventi",
    intro: "Il contributo di IMLAND all’interno degli eventi.",
    items: [
      { q: "Che ruolo può avere IMLAND in un evento?", a: "A seconda del progetto, IMLAND può entrare all’interno di un evento occupandosi di animazione, conduzione, radio, produzione di contenuti e service tecnico audio, quando previsto. L’organizzazione complessiva dell’evento rimane in capo all’organizzatore." },
      { q: "IMLAND dispone di un impianto audio?", a: "IMLAND dispone del service tecnico necessario alla produzione e diffusione del suono, quando previsto dal progetto. IMLAND non fornisce il palco e non fornisce il catering; questi aspetti restano in capo all’organizzatore." },
      { q: "IMLAND organizza l’intero evento?", a: "No. IMLAND interviene con i servizi concordati per il singolo progetto, mentre la responsabilità dell’organizzazione complessiva rimane in capo all’organizzatore." },
    ],
  },
  {
    title: "Member",
    intro: "Vantaggi, rete e visibilità.",
    items: [
      { q: "Come si diventa Member di IMLAND?", a: "Chi desidera diventare Member deve entrare in contatto direttamente con IMLAND. Il team illustrerà funzionamento, vantaggi e modalità di adesione." },
      { q: "A chi è rivolta la rete Member?", a: "La rete è rivolta ad aziende, professionisti e realtà del territorio interessati a conoscere IMLAND e a valutare un percorso di adesione direttamente con il team." },
    ],
  },
  {
    title: "Community e supporto tecnico",
    intro: "Partecipazione, sito, app e player.",
    items: [
      { q: "Come posso partecipare alla community IMLAND?", a: "Puoi ascoltare i contenuti, partecipare agli appuntamenti, proporre storie e iniziative oppure entrare in contatto con la rete Member. La pagina Contatti raccoglie tutti i riferimenti utili." },
      { q: "Cosa faccio se il sito, l’app o il player non funzionano?", a: "Verifica la connessione, aggiorna la pagina e prova con un browser aggiornato. Se il problema continua, scrivici dalla pagina Contatti indicando dispositivo, browser e una breve descrizione dell’errore." },
    ],
  },
  {
    title: "News",
    intro: "Notizie del territorio e notizie dei Member.",
    items: [
      { q: "Qual è la differenza tra News del territorio e News dei Member?", a: "Le News del territorio raccontano fatti, persone e iniziative delle province in cui opera IMLAND. Le News dei Member sono uno spazio dedicato alle novità delle realtà che fanno parte della rete Member." },
      { q: "Come posso segnalare una notizia?", a: "Puoi inviare la segnalazione dalla pagina Contatti, indicando le informazioni essenziali e le fonti disponibili. La redazione valuta i contenuti prima della pubblicazione." },
      { q: "Essere Member garantisce la pubblicazione di una notizia?", a: "Le News dei Member sono uno spazio dedicato alla rete, ma ogni contenuto viene comunque valutato e organizzato dalla redazione in coerenza con il progetto editoriale." },
    ],
  },
] as const;

const faqItems = faqSections.flatMap((section) => section.items);

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — IMLAND EXPERIENCE" },
      { name: "description", content: "Le risposte essenziali su radio, podcast, eventi, partnership e assistenza IMLAND." },
    ],
    links: [canonical("/faq")],
    scripts: [jsonLd(faqLd(faqItems))],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", messaggio: "" });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setSent(true);
    setForm({ nome: "", email: "", messaggio: "" });
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <main>
      <section className="faq-hero container-im flex min-h-[42svh] items-center justify-center section-pad text-center">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-ink-950">Domande frequenti</p>
          <h1 className="text-display-m text-ink-950">Tutto quello che vuoi sapere.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-950 sm:text-lg">
            Risposte chiare su radio, podcast, eventi, Member, supporto e news.
          </p>
        </div>
      </section>

      <section className="container-im pb-12 md:pb-16">
        <div className="mx-auto grid max-w-4xl gap-6">
          {faqSections.map((section, sectionIndex) => (
            <section key={section.title} className="rounded-[28px] border border-border bg-white px-5 py-6 sm:px-8">
              <h2 className="text-h2-im text-ink-950">{section.title}</h2>
              <p className="mt-2 text-sm text-ink-600 sm:text-base">{section.intro}</p>
              <Accordion type="single" collapsible className="mt-4 w-full">
                {section.items.map((item, itemIndex) => (
                  <AccordionItem key={item.q} value={`faq-${sectionIndex}-${itemIndex}`} className="border-border">
                    <AccordionTrigger className="py-5 text-left text-base font-semibold text-ink-950 hover:no-underline sm:text-lg">{item.q}</AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm leading-relaxed text-ink-950 sm:text-base">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      </section>

      <section className="container-im pb-16 md:pb-24">
        <form onSubmit={submit} className="mx-auto max-w-4xl rounded-[28px] border border-border bg-white p-6 sm:p-8 md:p-10">
          <div className="text-center">
            <h2 className="text-h2-im text-ink-950">Hai ancora una domanda?</h2>
            <p className="mt-2 text-sm text-ink-950 sm:text-base">Scrivici direttamente.</p>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-ink-950">Nome</span>
              <input required value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} className="field-im mt-2 rounded-full" placeholder="Il tuo nome" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink-950">Email</span>
              <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="field-im mt-2 rounded-full" placeholder="nome@esempio.it" />
            </label>
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-ink-950">Messaggio</span>
            <textarea required rows={5} value={form.messaggio} onChange={(event) => setForm({ ...form, messaggio: event.target.value })} className="field-im mt-2 rounded-3xl" placeholder="Scrivi qui la tua domanda…" />
          </label>
          <button type="submit" className="mt-5 w-full rounded-full btn-blue px-5 py-3.5 text-sm font-semibold">Invia messaggio</button>
          {sent && <p className="mt-4 rounded-2xl bg-meadow/20 px-4 py-3 text-center text-sm font-medium text-ink-950">Grazie! Abbiamo ricevuto il tuo messaggio.</p>}
        </form>
      </section>
    </main>
  );
}
