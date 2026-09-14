import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Risolve un link di condivisione pubblico: registra il click e restituisce
 * la destinazione. Usa il client privilegiato perché il visitatore non è
 * l'autore della condivisione (RLS personale).
 */
export const resolveShare = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ token: z.string().min(4).max(64) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: share } = await supabaseAdmin
      .from("listener_shares")
      .select("id, program_slug, episode_slug, title, link_url, click_count")
      .eq("token", data.token)
      .maybeSingle();

    if (!share) return { found: false as const };

    await supabaseAdmin
      .from("listener_shares")
      .update({
        click_count: (share.click_count ?? 0) + 1,
        last_click_at: new Date().toISOString(),
      })
      .eq("id", share.id);

    return {
      found: true as const,
      title: share.title,
      linkUrl: share.link_url || `/podcast/${share.program_slug}/${share.episode_slug}`,
    };
  });
