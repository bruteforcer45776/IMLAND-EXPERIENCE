import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function createPublicClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getPublishedArticles = createServerFn({ method: "GET" })
  .inputValidator(
    (data: {
      scope?: "piemonte" | "italia" | "all";
      province?: string;
      category?: string;
      limit?: number;
      offset?: number;
    }) => data,
  )
  .handler(async ({ data }) => {
    const supabase = createPublicClient();
    let q = supabase
      .from("news_articles")
      .select("*", { count: "exact" })
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (data.scope && data.scope !== "all") q = q.eq("geographic_scope", data.scope);
    if (data.province) q = q.eq("province", data.province);
    if (data.category) q = q.eq("category_slug", data.category);
    if (data.limit) q = q.limit(data.limit);
    if (data.offset) q = q.range(data.offset, data.offset + (data.limit ?? 10) - 1);

    const { data: rows, error, count } = await q;
    if (error) throw error;
    return { articles: rows ?? [], count: count ?? 0 };
  });

export const getPublishedArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createPublicClient();
    const { data: article, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw error;
    if (!article) return null;

    const { data: sources, error: sErr } = await supabase
      .from("news_article_sources")
      .select("*")
      .eq("article_id", article.id);
    if (sErr) throw sErr;

    let related: {
      id: string;
      title: string;
      slug: string;
      category_slug: string | null;
      published_at: string | null;
    }[] = [];
    if (article.category_slug) {
      const { data: relatedRows, error: rErr } = await supabase
        .from("news_articles")
        .select("id, title, slug, category_slug, published_at")
        .eq("status", "published")
        .eq("category_slug", article.category_slug)
        .neq("id", article.id)
        .order("published_at", { ascending: false })
        .limit(3);
      if (rErr) throw rErr;
      related = relatedRows ?? [];
    }

    return { article, sources: sources ?? [], related: related ?? [] };
  });

export const getNewsCategories = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("news_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
});
