import { createFileRoute } from "@tanstack/react-router";
import { SectionDecor } from "../components/decor";
import { canonical } from "../lib/seo";
import { useEffect, useState } from "react";
import {
  Apple,
  Chrome,
  Download,
  Monitor,
  Smartphone,
  Share,
  Plus,
  MoreVertical,
} from "lucide-react";
import Stepper, { Step } from "../components/stepper";
import { SpotlightCard } from "../components/spotlight-card";
import { BentoGrid, BentoCard } from "../components/bento";

export const Route = createFileRoute("/scarica-app")({
  head: () => ({
    meta: [
      { title: "Scarica l'app · IMLAND EXPERIENCE" },
      {
        name: "description",
        content:
          "Installa IMLAND EXPERIENCE come web app su iPhone, Android e desktop. Guida passo-passo per aggiungerla alla home screen.",
      },
      { property: "og:title", content: "Scarica l'app · IMLAND EXPERIENCE" },
      {
        property: "og:description",
        content: "Guida passo-passo per installare IMLAND EXPERIENCE su qualsiasi dispositivo.",
      },
    ],
    links: [canonical("/scarica-app")],
  }),
  component: DownloadPage,
});

type Platform = "ios" | "android" | "desktop";
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<unknown>;
};

function DownloadPage() {
  const [platform, setPlatform] = useState<Platform>("ios");
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) setPlatform("ios");
    else if (/android/.test(ua)) setPlatform("android");
    else setPlatform("desktop");

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS
      window.navigator.standalone === true;
    setInstalled(isStandalone);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const handleInstall = async () => {
    if (installEvent) {
      installEvent.prompt();
      await installEvent.userChoice;
      setInstallEvent(null);
    }
  };

  return (
    <div className="hero-frame decor-host overflow-hidden max-w-5xl px-4 hero-pad md:px-8">
      <SectionDecor variant="cool" />
      {/* Hero */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Download className="h-3.5 w-3.5" /> Web App installabile
        </span>
        <h1 className="mt-5 text-display-l">
          Scarica <span className="text-signal">IMLAND</span> sul tuo dispositivo
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
          Aggiungi IMLAND EXPERIENCE alla home del tuo telefono o al desktop. Funziona come un'app
          nativa, senza passare da nessuno store.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {installEvent ? (
            <button
              onClick={handleInstall}
              className="inline-flex items-center gap-2 rounded-full btn-blue px-6 py-3 text-sm"
            >
              <Download className="h-4 w-4" /> Installa ora
            </button>
          ) : (
            <a
              href="#guida"
              className="inline-flex items-center gap-2 rounded-full btn-blue px-6 py-3 text-sm"
            >
              <Download className="h-4 w-4" /> Scarica l'app
            </a>
          )}
          <a
            href="#guida"
            className="inline-flex items-center gap-2 rounded-full btn-blue px-6 py-3 text-sm"
          >
            Maggiori informazioni
          </a>
        </div>

        {installed && (
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-signal">
            App già installata su questo dispositivo
          </p>
        )}
      </div>

      {/* Platform picker */}
      <div id="guida" className="mt-20 scroll-mt-24">
        <h2 className="text-center text-h2-im">Guida step by step</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          Seleziona il tuo dispositivo e segui i passaggi. Bastano meno di 30 secondi.
        </p>

        <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2 rounded-full glass-panel p-1">
          <PlatformTab
            active={platform === "ios"}
            onClick={() => setPlatform("ios")}
            icon={<Apple className="h-4 w-4" />}
            label="iPhone / iPad"
          />
          <PlatformTab
            active={platform === "android"}
            onClick={() => setPlatform("android")}
            icon={<Smartphone className="h-4 w-4" />}
            label="Android"
          />
          <PlatformTab
            active={platform === "desktop"}
            onClick={() => setPlatform("desktop")}
            icon={<Monitor className="h-4 w-4" />}
            label="Desktop"
          />
        </div>

        <div className="mt-10">
          {platform === "ios" && <IosSteps />}
          {platform === "android" && <AndroidSteps />}
          {platform === "desktop" && <DesktopSteps />}
        </div>
      </div>

      {/* FAQ */}
      <BentoGrid className="mx-auto mt-24 max-w-4xl">
        {faqs.map((f) => (
          <BentoCard key={f.q} tone="member" span={3}>
            <h3 className="text-h3-im">{f.q}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
          </BentoCard>
        ))}
      </BentoGrid>
    </div>
  );
}

function PlatformTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition glow-orange-hover ${
        active
          ? "bg-signal text-signal-foreground glow-orange"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function IosSteps() {
  return (
    <Stepper onFinalStepCompleted={() => {}} backButtonText="Indietro" nextButtonText="Avanti">
      <Step>
        <StepHead icon={<Chrome className="h-5 w-5" />} n={1} title="Apri IMLAND in Safari" />
        <p className="mt-2 text-sm text-muted-foreground">
          Su iPhone o iPad devi usare <strong>Safari</strong> (Chrome iOS non supporta
          l'installazione). Vai su{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">
            imland-experience-hub-territoriale.area-di-lavo-2221.chatgpt.site
          </code>
          .
        </p>
      </Step>
      <Step>
        <StepHead icon={<Share className="h-5 w-5" />} n={2} title="Tocca il pulsante Condividi" />
        <p className="mt-2 text-sm text-muted-foreground">
          Nella barra in basso di Safari, tocca l'icona <strong>Condividi</strong> (il quadrato con
          la freccia verso l'alto).
        </p>
      </Step>
      <Step>
        <StepHead icon={<Plus className="h-5 w-5" />} n={3} title='Scegli "Aggiungi a Home"' />
        <p className="mt-2 text-sm text-muted-foreground">
          Scorri il menu e seleziona <strong>Aggiungi a Home</strong>. Se non lo vedi, tocca{" "}
          <em>Modifica azioni</em> e attivalo.
        </p>
      </Step>
      <Step>
        <StepHead
          icon={<Smartphone className="h-5 w-5" />}
          n={4}
          title="Conferma e apri dall'icona"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Tocca <strong>Aggiungi</strong> in alto a destra. L'app IMLAND compare nella tua home
          screen: aprila come una qualsiasi app.
        </p>
      </Step>
    </Stepper>
  );
}

function AndroidSteps() {
  return (
    <Stepper onFinalStepCompleted={() => {}} backButtonText="Indietro" nextButtonText="Avanti">
      <Step>
        <StepHead icon={<Chrome className="h-5 w-5" />} n={1} title="Apri IMLAND in Chrome" />
        <p className="mt-2 text-sm text-muted-foreground">
          Su Android usa <strong>Google Chrome</strong> (o Edge / Samsung Internet). Vai su{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">
            imland-experience-hub-territoriale.area-di-lavo-2221.chatgpt.site
          </code>
          .
        </p>
      </Step>
      <Step>
        <StepHead
          icon={<MoreVertical className="h-5 w-5" />}
          n={2}
          title="Apri il menu a tre puntini"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          In alto a destra tocca i tre puntini <strong>⋮</strong>. Potresti vedere anche un banner
          "Installa app" che compare da solo.
        </p>
      </Step>
      <Step>
        <StepHead icon={<Download className="h-5 w-5" />} n={3} title='Seleziona "Installa app"' />
        <p className="mt-2 text-sm text-muted-foreground">
          Tocca <strong>Installa app</strong> (o <em>Aggiungi a schermata Home</em>). Conferma il
          nome e premi <strong>Installa</strong>.
        </p>
      </Step>
      <Step>
        <StepHead icon={<Smartphone className="h-5 w-5" />} n={4} title="Trova IMLAND nel drawer" />
        <p className="mt-2 text-sm text-muted-foreground">
          L'icona è ora nel drawer app e sulla home. Aprila: parte in modalità standalone, senza
          barra del browser.
        </p>
      </Step>
    </Stepper>
  );
}

function DesktopSteps() {
  return (
    <Stepper onFinalStepCompleted={() => {}} backButtonText="Indietro" nextButtonText="Avanti">
      <Step>
        <StepHead
          icon={<Chrome className="h-5 w-5" />}
          n={1}
          title="Apri il sito in Chrome, Edge o Brave"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Su Mac, Windows o Linux apri IMLAND EXPERIENCE con un browser compatibile
          (Chromium-based). Safari desktop non supporta l'installazione PWA.
        </p>
      </Step>
      <Step>
        <StepHead
          icon={<Download className="h-5 w-5" />}
          n={2}
          title="Clicca l'icona di installazione"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          A destra della barra degli indirizzi appare un'icona a forma di{" "}
          <strong>schermo con freccia in basso</strong>. Cliccala.
        </p>
      </Step>
      <Step>
        <StepHead icon={<Plus className="h-5 w-5" />} n={3} title="Conferma l'installazione" />
        <p className="mt-2 text-sm text-muted-foreground">
          Nel popup premi <strong>Installa</strong>. Se preferisci, dal menu del browser scegli{" "}
          <em>Installa IMLAND EXPERIENCE…</em>
        </p>
      </Step>
      <Step>
        <StepHead
          icon={<Monitor className="h-5 w-5" />}
          n={4}
          title="Avvia dal Launchpad / Menu Start"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          IMLAND è ora installata come app: la trovi nel Launchpad (Mac), nel Menu Start (Windows) o
          tra le applicazioni (Linux).
        </p>
      </Step>
    </Stepper>
  );
}

function StepHead({ icon, n, title }: { icon: React.ReactNode; n: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-signal/15 text-signal">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Passo {n}
        </p>
        <h3 className="text-h3-im">{title}</h3>
      </div>
    </div>
  );
}

const faqs = [
  {
    q: "L'app è gratuita?",
    a: "Sì. IMLAND EXPERIENCE è una web app completamente gratuita: nessun costo, nessun acquisto interno per usare radio, podcast ed eventi.",
  },
  {
    q: "Serve passare da App Store o Play Store?",
    a: "No. L'installazione avviene direttamente dal browser in pochi secondi. Non occupa spazio come un'app nativa e si aggiorna da sola.",
  },
  {
    q: "Funziona offline?",
    a: "Le pagine già visitate restano consultabili anche senza connessione stabile, ma radio e podcast in streaming richiedono internet.",
  },
  {
    q: "Come faccio a disinstallarla?",
    a: "Su mobile: tieni premuta l'icona e scegli 'Rimuovi'. Su desktop: apri l'app, menu ⋮ in alto, 'Disinstalla IMLAND EXPERIENCE'.",
  },
];
