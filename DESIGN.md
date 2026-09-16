---
name: IMLAND Experience
description: Sistema visivo territoriale editoriale, immersivo e accessibile, con gerarchie chiare e materiali traslucidi funzionali.
colors:
  experience-blue: "#087cf0"
  radio-cyan: "#0aa2cf"
  podcast-blue: "#1646d8"
  member-gold: "#e0a800"
  news-red: "#e21d2f"
  events-green: "#12a531"
  ink: "#101114"
  ink-muted: "#5f6368"
  canvas: "#ffffff"
  surface-muted: "#f7f9fc"
  outline: "#e2e6ec"
  glass-subtle: "rgb(255 255 255 / 46%)"
  glass-standard: "rgb(255 255 255 / 68%)"
  glass-elevated: "rgb(255 255 255 / 78%)"
  glass-dark: "rgb(10 10 10 / 58%)"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "clamp(2.35rem, 6vw, 5.75rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 4vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2.2vw, 1.625rem)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  card: "1.375rem"
  panel: "1.875rem"
  full: "999px"
spacing:
  gutter-mobile: "1rem"
  gutter-desktop: "1.25rem"
  block-mobile: "1.5rem"
  block-desktop: "1.75rem"
  section-mobile: "2.5rem"
  section-desktop: "4rem"
  grid-gap: "clamp(0.875rem, 1.5vw, 1.25rem)"
  card-padding: "clamp(1.125rem, 2vw, 1.625rem)"
components:
  button-primary:
    backgroundColor: "{colors.experience-blue}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.full}"
    padding: "0.55rem 1.125rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "#0b66c3"
    textColor: "{colors.canvas}"
    rounded: "{rounded.full}"
  card-glass:
    backgroundColor: "{colors.glass-standard}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
  field:
    backgroundColor: "rgb(255 255 255 / 72%)"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.55rem 0.8rem"
    height: "2.75rem"
---

# Design System: IMLAND Experience

## Overview

**Creative North Star: "Il territorio, a fuoco"**

IMLAND è un ecosistema editoriale territoriale, non un’interfaccia tecnologica generica. Il design deve far percepire radio, podcast, news, eventi e community come parti dello stesso luogo digitale: contemporaneo, autorevole e immediato. L’identità esistente resta la fonte di verità; le indicazioni Apple Human Interface Guidelines vengono adottate come criteri di chiarezza, gerarchia, leggibilità, accessibilità e comportamento, non come licenza per copiare l’estetica o sostituire il branding IMLAND.

Il contenuto rimane protagonista. Colore, vetro, profondità e movimento servono a distinguere livelli funzionali e orientare la navigazione. Le superfici traslucide mantengono il contesto visibile, ma diventano progressivamente più opache quando contengono testo, controlli o informazioni che richiedono contrasto. La densità è editoriale e ariosa, senza sacrificare la quantità reale di contenuti né alterarne ordine, testi, immagini, CTA o funzionalità.

**Key Characteristics:**

- Identità territoriale premium, contemporanea ed editoriale.
- Gerarchia netta tra contenuto, navigazione e controlli.
- Codifica cromatica stabile per verticale.
- Materiali traslucidi usati per funzione, mai come decorazione indiscriminata.
- Tipografia leggibile, responsiva e coerente.
- Interazioni percepibili anche senza affidarsi al solo colore.
- Comportamento completo su mobile, desktop, tastiera e riduzione del movimento.

## Colors

La base è luminosa e neutra; i colori di verticale sono segnali semantici ad alta riconoscibilità, non sfondi decorativi intercambiabili.

### Primary

- **Blu Experience:** accento generale, azioni principali, focus e continuità del brand nelle aree non associate a una verticale.

### Secondary

- **Ciano Radio:** ascolto live e contenuti radiofonici.
- **Blu Podcast:** programmi, episodi e player podcast.
- **Oro Member:** community, adesione e contenuti Member; usa inchiostro scuro sopra il fondo oro.
- **Rosso News:** contenuti giornalistici e segnali editoriali News.
- **Verde Eventi:** appuntamenti e contenuti Eventi.

### Neutral

- **Inchiostro:** testo principale e icone ad alta priorità.
- **Inchiostro attenuato:** testo secondario, metadati e descrizioni non essenziali.
- **Tela:** fondo principale e testo inverso sui colori scuri.
- **Superficie tenue:** raggruppamenti secondari e aree operative.
- **Contorno:** separatori e bordi che devono restare percepibili senza diventare dominanti.
- **Vetro sottile, standard, elevato e scuro:** livelli di materiale con opacità crescente in base al bisogno di separazione e leggibilità.

### Named Rules

**The Vertical Signal Rule.** Radio, Podcast, Member, News ed Eventi conservano sempre il proprio colore semantico; lo stesso colore non assume significati differenti nella medesima vista.

**The Contrast Before Transparency Rule.** Se lo sfondo riduce la leggibilità, aumenta l’opacità o applica una velatura prima di ridurre il contrasto del testo.

**The Never Color Alone Rule.** Stato, selezione e interattività devono essere comunicati anche con forma, etichetta, icona, sottolineatura o variazione di peso.

## Typography

**Display Font:** Plus Jakarta Sans (fallback Inter, system-ui, sans-serif)  
**Body Font:** Inter (fallback system-ui, sans-serif)  
**Keyword Font:** Instrument Serif (fallback Playfair Display, Georgia, serif), solo dove già previsto come accento editoriale.

**Character:** Plus Jakarta Sans costruisce titoli compatti e contemporanei; Inter mantiene il testo operativo neutro e leggibile. La coppia comunica autorevolezza senza irrigidire l’esperienza editoriale. Non introdurre altri caratteri.

### Hierarchy

- **Display** (700, scala fluida, line-height 0.98): titoli hero e messaggi principali; bilanciamento delle righe attivo.
- **Headline** (700, scala fluida, line-height 1.06): apertura di sezioni e pagine editoriali.
- **Title** (700, scala fluida, line-height 1.18): titoli di card e gruppi di contenuto.
- **Body** (400, 1rem, line-height 1.6): testo corrente; nelle card limita le righe a un massimo di 72ch.
- **Label** (600, 0.875rem, line-height 1.4): controlli, categorie e metadati interattivi.

### Named Rules

**The Readable Weight Rule.** Per testi piccoli usa Regular, Medium, Semibold o Bold; evita pesi Light e Thin.

**The Two-Family Rule.** Plus Jakarta Sans e Inter coprono il sistema; Instrument Serif è un accento già codificato, non un terzo linguaggio tipografico per componenti o navigazione.

**The Content Integrity Rule.** Le ottimizzazioni tipografiche possono modificare solo presentazione, ritmo e adattamento responsive; non riscrivono, abbreviano o riordinano i contenuti.

## Layout

Il layout usa un contenitore massimo di 80rem, gutter mobile di 1rem e desktop di 1.25rem. La griglia bento parte da una colonna, passa a due da 40rem, sei da 48rem e dodici da 64rem. Gli elementi devono allinearsi a una griglia comune per rendere immediatamente percepibili relazioni e gerarchie.

Le sezioni mantengono un ritmo verticale fluido e leggibile. Il contenuto primario deve essere visibile senza zoom e senza scorrimento orizzontale. Header, player e navigazione inferiore rispettano safe area, notch e barre di sistema. Su mobile le card riducono padding e raggio senza comprimere testo o controlli.

I controlli primari e le aree cliccabili devono raggiungere almeno 44 × 44px quando usati tramite tocco, anche se il segno visivo interno è più piccolo. Controlli e azioni restano vicini al contenuto che modificano. Gli elementi persistenti non devono coprire CTA, campi o contenuti nell’ultima porzione della pagina.

**The One Grid Rule.** Testi, immagini, card e CTA condividono assi di allineamento riconoscibili; gli scarti intenzionali devono rafforzare una gerarchia, non creare rumore.

**The Mobile Is Complete Rule.** La versione mobile conserva contenuti e funzionalità, adattando colonne, spaziature e controlli senza nascondere informazioni essenziali.

## Elevation & Depth

La profondità è un sistema ibrido di traslucenza, blur, bordo luminoso e ombra ambientale. Il vetro sottile appartiene a sezioni ampie; il vetro standard a card e moduli; il vetro elevato a navigazione, player, menu e dialoghi. Il vetro scuro è riservato ai controlli multimediali su fondi ricchi. Come nelle HIG Apple, il materiale distingue livelli funzionali e mantiene il senso del contesto; non va applicato uniformemente a ogni superficie.

### Shadow Vocabulary

- **Subtle** (`0 10px 28px rgb(1 29 104 / 8%)`): separazione delicata delle sezioni.
- **Standard** (`0 16px 40px rgb(1 29 104 / 12%)`): card e moduli sopra contenuto visivo.
- **Elevated** (`0 22px 56px rgb(1 29 104 / 18%)`): header, player, dialog e pannelli temporanei.
- **Highlight** (`inset 0 1px 0 rgb(255 255 255 / 52%)`): bordo di luce comune alle superfici traslucide.

### Named Rules

**The Functional Glass Rule.** Usa il vetro elevato per controlli e navigazione sopra il contenuto; nel livello editoriale preferisci superfici standard o sottili.

**The Three-Level Rule.** Ogni superficie deve appartenere chiaramente a uno dei tre livelli — subtle, standard, elevated — evitando valori intermedi non documentati.

## Shapes

La forma è morbida ma disciplinata. I controlli usano angoli da 0.75rem o capsule complete; le card usano 1.375rem; i pannelli principali 1.875rem. Su mobile i raggi molto ampi si riducono per preservare spazio utile. Bordi sottili e semitrasparenti definiscono le superfici senza creare cornici pesanti.

Le silhouette asimmetriche già presenti nelle aree editoriali possono rimanere come firma visiva, ma non vanno replicate casualmente nei componenti operativi. Immagini e video mantengono sempre il rapporto d’aspetto previsto, senza deformazioni.

**The Soft, Not Inflated Rule.** Le forme sono accoglienti e contemporanee; evita card e controlli eccessivamente bulbosi che riducono densità, allineamento o spazio leggibile.

## Components

### Buttons

- **Shape:** capsule per CTA principali; raggio medio per controlli compatti.
- **Primary:** colore della verticale attiva o Blu Experience, testo con contrasto verificato e area tattile minima 44px.
- **Hover:** lieve elevazione e rafforzamento cromatico; non spostare layout o contenuti.
- **Active:** traslazione verticale massima di 1px per feedback tattile.
- **Focus:** anello esterno di 3px, ben contrastato e separato dal bordo.
- **Secondary / Ghost:** superficie tonale o traslucida, bordo percepibile e testo ad alto contrasto.

### Chips

- **Style:** capsule compatte con testo minimo da label; colore di verticale come segnale.
- **State:** selezione comunicata con fondo, bordo e/o icona, mai solo tramite differenza cromatica.
- **Touch:** espandere l’area interattiva senza gonfiare necessariamente il segno visivo.

### Cards / Containers

- **Corner Style:** raggio card condiviso; riduzione controllata su mobile.
- **Background:** vetro standard per card, sottile per sezioni, opaco quando necessario alla lettura.
- **Shadow Strategy:** standard a riposo; incremento moderato su hover solo per card realmente interattive.
- **Border:** bianco semitrasparente su vetro; bordo semantico attenuato per la verticale attiva.
- **Internal Padding:** fluido e coerente con la scala globale.

### Inputs / Fields

- **Style:** superficie bianca traslucida, bordo neutro percepibile, altezza tattile minima 44px.
- **Focus:** anello esterno di 3px con contrasto sufficiente; placeholder e testo non devono confondersi.
- **Error / Disabled:** messaggio testuale e icona oltre al colore; lo stato disabled resta leggibile.

### Navigation

- **Style:** vetro elevato sopra il contenuto, opacità maggiore durante lo scroll e ombra ambientale contenuta.
- **Typography:** label Inter Semibold, con stato attivo inequivocabile.
- **Desktop:** allineamento al contenitore editoriale e gerarchia stabile tra logo, sezioni e azioni.
- **Mobile:** controlli raggiungibili, safe area rispettata e nessuna sovrapposizione con player o azioni persistenti.

### Media Player

- **Material:** vetro scuro quando sovrapposto a contenuti ricchi; testo e icone ad alto contrasto.
- **Hierarchy:** play/pause è l’azione dominante; titolo, programma e durata sono secondari ma leggibili.
- **Persistence:** il player può restare visibile senza coprire navigazione, modali o contenuto terminale.

### Motion

- **Timing:** 180ms per feedback immediato; 220ms per transizioni di superficie e struttura.
- **Easing:** uscita morbida (`cubic-bezier(.22, 1, .36, 1)`) per evitare movimenti bruschi.
- **Purpose:** il movimento comunica stato, relazione e continuità; non distrae dalla lettura.
- **Accessibility:** con `prefers-reduced-motion` le transizioni diventano quasi istantanee e le trasformazioni decorative vengono rimosse.

## Do's and Don'ts

### Do:

- **Do** preservare contenuti, copy, immagini, ordine delle sezioni, CTA, link e funzionalità esistenti.
- **Do** usare la codifica cromatica di ogni verticale in modo stabile e semantico.
- **Do** scegliere il livello di vetro in base alla funzione e aumentare l’opacità quando serve contrasto.
- **Do** mantenere testo corrente da 1rem, pesi leggibili e righe entro 72ch nelle superfici editoriali.
- **Do** garantire controlli touch da almeno 44 × 44px, focus visibile e stati comprensibili senza solo colore.
- **Do** verificare desktop e mobile, safe area, assenza di overflow orizzontale e rispetto di `prefers-reduced-motion`.

### Don't:

- **Don't** trasformare IMLAND in un clone estetico di iOS, macOS o Apple.com.
- **Don't** sostituire font, logo, immagini, palette o contenuti approvati con risorse Apple.
- **Don't** applicare Liquid Glass a ogni livello: navigazione e controlli elevati devono restare distinti dal contenuto.
- **Don't** usare trasparenze che riducono la leggibilità o testi secondari troppo chiari sopra immagini e gradienti.
- **Don't** introdurre nuove sezioni, CTA, claim, dati, eventi, persone, servizi o integrazioni.
- **Don't** deformare immagini, ridurre target tattili o nascondere contenuti essenziali nella versione mobile.
