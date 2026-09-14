import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * GDPR — esportazione dati personali del membro autenticato.
 * Registra la richiesta in account_requests e restituisce il pacchetto dati.
 */
export const exportMyData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [profile, favorites, bookings, redemptions, referrals, requests] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("favorites").select("*").eq("user_id", userId),
      supabase.from("event_bookings").select("*").eq("user_id", userId),
      supabase.from("benefit_redemptions").select("*").eq("user_id", userId),
      supabase.from("referrals").select("*").eq("referrer_id", userId),
      supabase.from("account_requests").select("*").eq("user_id", userId),
    ]);

    await supabase.from("account_requests").insert({
      user_id: userId,
      request_type: "export",
      status: "completed",
      note: "Esportazione self-service dall'Area Membri",
      completed_at: new Date().toISOString(),
    });

    return {
      generated_at: new Date().toISOString(),
      profile: profile.data ?? null,
      favorites: favorites.data ?? [],
      event_bookings: bookings.data ?? [],
      benefit_redemptions: redemptions.data ?? [],
      referrals: referrals.data ?? [],
      account_requests: requests.data ?? [],
    };
  });

/**
 * GDPR — eliminazione account. Registra la richiesta, poi elimina l'utente
 * di autenticazione (le tabelle collegate cadono in cascata).
 */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { confirm: string }) => {
    if (input?.confirm !== "ELIMINA") throw new Error("Conferma non valida");
    return input;
  })
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    await supabase.from("account_requests").insert({
      user_id: userId,
      request_type: "delete",
      status: "processing",
      note: "Richiesta di eliminazione dall'Area Membri",
    });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw new Error(error.message);

    return { ok: true };
  });
