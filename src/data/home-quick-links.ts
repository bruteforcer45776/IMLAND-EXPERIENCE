import type { BadgeName } from "@/components/badge-icon";
import type { BentoSpan, BentoTone } from "@/components/bento";

/** Home quick-access tiles, con i bollini circolari ufficiali. */
export const quickLinks = [
  { to: "/radio", label: "Radio", desc: "Ascolta la diretta", badge: "radio" as BadgeName, tone: "radio" as BentoTone, span: 2 as BentoSpan },
  { to: "/podcast", label: "Podcast", desc: "Le nostre serie", badge: "podcast" as BadgeName, tone: "podcast" as BentoTone, span: 2 as BentoSpan },
  { to: "/eventi", label: "Eventi", desc: "Il calendario live", badge: "calendario" as BadgeName, tone: "eventi" as BentoTone, span: 2 as BentoSpan },
  { to: "/news", label: "News", desc: "Le notizie del territorio", badge: "news" as BadgeName, tone: "news" as BentoTone, span: 2 as BentoSpan },
  { to: "/member", label: "Membri", desc: "Le aziende della rete", badge: "community" as BadgeName, tone: "member" as BentoTone, span: 2 as BentoSpan },
] as const;

/** Altri prodotti IMLAND: piattaforme operative collegate all'ecosistema. */
export const otherProducts = [
  { to: "/alert", label: "Alert", desc: "Segnala quello che vedi sul territorio", badge: "alert" as BadgeName, tone: "alert" as BentoTone, span: 2 as BentoSpan },
  { to: "/jobs", label: "Jobs", desc: "Opportunità di lavoro vicino a te", badge: "jobs" as BadgeName, tone: "jobs" as BentoTone, span: 2 as BentoSpan },
  { to: "/terrain", label: "Terrain", desc: "Luoghi e attività da scoprire", badge: "terrain" as BadgeName, tone: "terrain" as BentoTone, span: 2 as BentoSpan },
] as const;
