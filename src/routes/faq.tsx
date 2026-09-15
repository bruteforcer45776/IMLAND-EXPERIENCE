import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { canonical, faqLd, jsonLd } from "../lib/seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

const faqItems = [
  { q: "Radio — Come posso ascoltare IMLAND Radio?", a: "Puoi ascoltare gratuitamente la diretta 24 ore su 24 dalla pagina Radio, dal player presente sul sito e dall'app IMLAND installabile sul tuo dispositivo." },
  { q: "Podcast — Dove trovo i podcast IMLAND?", a: "Nella sezione Podcast trovi i format editoriali e le puntate disponibili. My Podcast è invece lo spazio dedicato ai progetti audio realizzati su misura per aziende e organizzazioni." },
  { q: "Partner — Come si diventa Member di IMLAND?", a: "Aziende, professionisti e associazioni possono presentare la propria realtà dalla pagina Partner. Il team IMLAND valuterà insieme la collaborazione e le opportunità più adatte." },
  { q: "Eventi — Come posso partecipare agli eventi?", a: "Nella sezione Eventi trovi gli appuntamenti pubblicati con data, luogo e modalità di partecipazione. Quando è richiesta una prenotazione, le indicazioni sono riportate nella scheda dell'evento." },
  { q: "News — Come vengono selezionate le notizie?", a: "La sezione News raccoglie contenuti e segnalazioni legati al territorio. La redazione verifica e seleziona le informazioni prima della loro pubblicazione o condivisione." },
  { q: "Community — Come posso partecipare alla rete IMLAND?", a: "Puoi ascoltare i contenuti, partecipare agli eventi, proporre storie e iniziative oppure entrare nella rete Member. Le pagine Contatti e Partner indicano il percorso più adatto." },
  { q: "Tecnica — Cosa faccio se il sito, l'app o il player non funzionano?", a: "Verifica la connessione, aggiorna la pagina e prova con un browser aggiornato. Se il problema continua, scrivici dalla pagina Contatti indicando dispositivo, browser e una breve descrizione dell'errore." },
];

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
            Risposte chiare su radio, podcast, eventi, partnership e assistenza.
          </p>
        </div>
      </section>

      <section className="container-im pb-12 md:pb-16">
        <Accordion type="single" collapsible className="mx-auto max-w-4xl rounded-[28px] border border-border bg-white px-5 sm:px-8">
          {faqItems.map((item, index) => (
            <AccordionItem key={item.q} value={`faq-${index}`} className="border-border">
              <AccordionTrigger className="py-5 text-left text-base font-semibold text-ink-950 hover:no-underline sm:text-lg">{item.q}</AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-ink-950 sm:text-base">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
