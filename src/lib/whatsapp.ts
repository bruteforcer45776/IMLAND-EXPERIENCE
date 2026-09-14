/** Contatto WhatsApp ufficiale per le richieste di adesione alla rete IMLAND. */
export const WHATSAPP_MEMBER_NUMBER = "393423535595";

export const WHATSAPP_MEMBER_MESSAGE =
  "Salve, vorrei maggiori informazioni per unirmi alla rete IMLAND EXPERIENCE.";

export const WHATSAPP_MEMBER_URL = `https://wa.me/${WHATSAPP_MEMBER_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MEMBER_MESSAGE,
)}`;

/** Contatto WhatsApp per il funnel aziende/partner. */
export const WHATSAPP_PARTNER_MESSAGE =
  "Salve, vorrei maggiori informazioni per diventare partner della rete IMLAND EXPERIENCE.";

export const WHATSAPP_PARTNER_URL = `https://wa.me/${WHATSAPP_MEMBER_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_PARTNER_MESSAGE,
)}`;
