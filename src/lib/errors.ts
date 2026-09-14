import { toast } from "sonner";

/**
 * Traduce gli errori tecnici (Supabase, rete, permessi) in messaggi chiari
 * in italiano, così l'interfaccia non mostra mai stringhe di debug.
 */
export function describeError(error: unknown, fallback = "Qualcosa è andato storto. Riprova."): string {
  if (!error) return fallback;

  const raw = error as { message?: string; code?: string; status?: number; details?: string };
  const message = typeof error === "string" ? error : (raw.message ?? "");
  const code = raw.code ?? "";
  const status = raw.status ?? 0;

  if (message === "GUEST") return "Accedi per salvare i tuoi contenuti.";

  if (status === 401 || code === "401" || /jwt|not authenticated|invalid token/i.test(message)) {
    return "La sessione è scaduta. Accedi di nuovo per continuare.";
  }
  if (status === 403 || code === "42501" || /permission denied|row-level security/i.test(message)) {
    return "Non hai i permessi necessari per questa operazione.";
  }
  if (code === "23505" || code === "23503" || /duplicate key/i.test(message)) {
    return "Questo elemento esiste già.";
  }
  if (/failed to fetch|network|networkerror|load failed|timeout/i.test(message)) {
    return "Connessione assente o instabile. Controlla la rete e riprova.";
  }
  if (message) return message;
  return fallback;
}

/** Toast di errore con azione “Riprova” quando è possibile ritentare. */
export function notifyError(error: unknown, options?: { fallback?: string; retry?: () => void }) {
  toast.error(describeError(error, options?.fallback), {
    action: options?.retry ? { label: "Riprova", onClick: options.retry } : undefined,
  });
}
