import { createFileRoute } from "@tanstack/react-router";
import { collectDailyNews } from "@/lib/news-automation/collect.server";
import { scoreAndDeduplicateCandidates } from "@/lib/news-automation/score.server";
import { generateArticles } from "@/lib/news-automation/generate.server";
import { verifyAndPublishArticles } from "@/lib/news-automation/publish.server";

export const Route = createFileRoute("/api/public/collect-daily-news")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.NEWS_AUTOMATION_SECRET;
        const provided = request.headers.get("x-news-automation-secret");
        if (!expected || provided !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const collect = await collectDailyNews(supabaseAdmin, "cron");
        if (!collect.ok) {
          return Response.json({ ok: false, error: collect.error, runId: collect.runId }, { status: 500 });
        }

        const score = await scoreAndDeduplicateCandidates(supabaseAdmin, collect.runId);
        if (score.error) {
          return Response.json({ ok: false, stage: "score", error: score.error, runId: collect.runId }, { status: 500 });
        }

        const gen = await generateArticles(supabaseAdmin, collect.runId, key);
        if (gen.error) {
          return Response.json(
            { ok: false, stage: "generate", error: gen.error, runId: collect.runId, generated: gen.generated },
            { status: 500 },
          );
        }

        const pub = await verifyAndPublishArticles(supabaseAdmin, collect.runId);

        return Response.json({
          ok: true,
          runId: collect.runId,
          collected: collect.ok,
          scored: score.scored,
          duplicates: score.duplicates,
          selected: score.selected,
          generated: gen.generated,
          published: pub.published,
          review: pub.review,
          rejected: pub.rejected,
        });
      },
    },
  },
});
