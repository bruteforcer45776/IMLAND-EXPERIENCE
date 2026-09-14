import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Loader2,
  Play,
  RefreshCw,
  Save,
  Settings,
  ShieldAlert,
  X,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import {
  runNewsAutomation,
  getNewsSettings,
  updateNewsSettings,
  listNewsSources,
  upsertNewsSource,
  listNewsCandidates,
  listNewsArticles,
  getNewsArticleWithSources,
  updateNewsArticle,
  approveNewsArticle,
  rejectNewsArticle,
  listAutomationRuns,
} from "@/lib/news-automation/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/news-automation")({
  head: () => ({
    meta: [
      { title: "News Automation — IMLAND EXPERIENCE" },
      { name: "description", content: "Pannello di controllo per l'automazione delle notizie IMLAND." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NewsAutomationAdminPage,
});

const tabs = [
  { key: "settings", label: "Impostazioni" },
  { key: "sources", label: "Fonti" },
  { key: "candidates", label: "Candidati" },
  { key: "articles", label: "Articoli" },
  { key: "runs", label: "Esecuzioni" },
] as const;

function NewsAutomationAdminPage() {
  const { isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("settings");

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 section-pad text-center text-muted-foreground">Caricamento…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 section-pad text-center">
        <h1 className="text-h1-im">Accesso riservato.</h1>
        <p className="mt-3 text-muted-foreground">Questa area è disponibile solo allo staff IMLAND.</p>
        <Link to="/area" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
          Torna all'Area Membri
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <header className="mb-6">
        <h1 className="text-h1-im">News Automation.</h1>
        <p className="mt-2 text-muted-foreground">Gestisci raccolta, selezione, generazione e pubblicazione delle notizie.</p>
        <Link to="/admin" className="mt-3 inline-flex text-sm font-medium text-primary">
          Torna al pannello admin
        </Link>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              tab === t.key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "settings" && <SettingsTab />}
      {tab === "sources" && <SourcesTab />}
      {tab === "candidates" && <CandidatesTab />}
      {tab === "articles" && <ArticlesTab />}
      {tab === "runs" && <RunsTab />}
    </div>
  );
}

function SettingsTab() {
  const queryClient = useQueryClient();
  const fetchSettings = useServerFn(getNewsSettings);
  const saveSettings = useServerFn(updateNewsSettings);
  const runNow = useServerFn(runNewsAutomation);
  const { data: settings } = useQuery({ queryKey: ["news-settings"], queryFn: () => fetchSettings() });
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: saveSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["news-settings"] }),
  });

  if (!settings) return <div className="text-muted-foreground">Caricamento…</div>;

  const boolFields: { key: keyof typeof settings; label: string; warn?: boolean }[] = [
    { key: "automation_enabled", label: "Automazione attiva" },
    { key: "manual_review_mode", label: "Modalità revisione manuale" },
    { key: "emergency_stop", label: "Stop di emergenza", warn: true },
  ];

  const update = (patch: Record<string, unknown>) => mutation.mutate({ data: { id: settings.id, patch } });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {boolFields.map((f) => (
          <label
            key={String(f.key)}
            className={`flex items-center justify-between rounded-2xl border p-4 ${f.warn ? "border-error/30 bg-error/5" : "border-border bg-card"}`}
          >
            <span className="font-medium">{f.label}</span>
            <button
              onClick={() => update({ [f.key]: !settings[f.key] })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[f.key] ? (f.warn ? "bg-error" : "bg-primary") : "bg-muted"}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${settings[f.key] ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </label>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Schedule cron" value={settings.cron_schedule} onSave={(v) => update({ cron_schedule: v })} />
        <Field label="Fuso orario" value={settings.cron_timezone} onSave={(v) => update({ cron_timezone: v })} />
        <Field label="Max articoli Piemonte" value={String(settings.max_piemonte_articles)} onSave={(v) => update({ max_piemonte_articles: Number(v) })} />
        <Field label="Max articoli Italia" value={String(settings.max_italia_articles)} onSave={(v) => update({ max_italia_articles: Number(v) })} />
        <Field label="Soglia rilevanza" value={String(settings.min_relevance_score)} onSave={(v) => update({ min_relevance_score: Number(v) })} />
        <Field label="Soglia affidabilità" value={String(settings.min_credibility_score)} onSave={(v) => update({ min_credibility_score: Number(v) })} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="font-semibold">Stato revisione iniziale</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Giorni di revisione manuale obbligatoria: {settings.review_period_days}. Iniziato: {settings.review_period_started_at ? new Date(settings.review_period_started_at).toLocaleDateString("it-IT") : "—"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={async () => {
            setRunning(true);
            setLastResult(null);
            try {
              const res = await runNow();
              setLastResult(JSON.stringify(res, null, 2));
              queryClient.invalidateQueries({ queryKey: ["news-articles"] });
              queryClient.invalidateQueries({ queryKey: ["news-candidates"] });
              queryClient.invalidateQueries({ queryKey: ["news-runs"] });
            } catch (e) {
              setLastResult(String(e));
            } finally {
              setRunning(false);
            }
          }}
          disabled={running || settings.emergency_stop}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Esegui ora
        </button>
        {settings.emergency_stop && (
          <span className="inline-flex items-center gap-1 text-sm text-error">
            <ShieldAlert className="h-4 w-4" /> Stop di emergenza attivo
          </span>
        )}
      </div>

      {lastResult && (
        <pre className="max-h-64 overflow-auto rounded-2xl border border-border bg-muted p-4 text-xs">{lastResult}</pre>
      )}
    </div>
  );
}

function Field({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => void }) {
  const [v, setV] = useState(value);
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <label className="block text-sm font-medium text-muted-foreground">{label}</label>
      <div className="mt-2 flex gap-2">
        <input value={v} onChange={(e) => setV(e.target.value)} className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm" />
        <button onClick={() => onSave(v)} className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
          <Save className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SourcesTab() {
  const queryClient = useQueryClient();
  const fetchSources = useServerFn(listNewsSources);
  const saveSource = useServerFn(upsertNewsSource);
  const { data: sources } = useQuery({ queryKey: ["news-sources"], queryFn: () => fetchSources() });
  const [editing, setEditing] = useState<Record<string, string> | null>(null);
  const mutation = useMutation({
    mutationFn: saveSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-sources"] });
      setEditing(null);
    },
  });

  const blank = {
    name: "",
    domain: "",
    feed_url: "",
    endpoint_url: "",
    source_type: "rss",
    coverage_scope: "piemonte",
    province: "",
    city: "",
    reliability_score: "3",
    allows_scraping: "false",
    allows_image_reuse: "false",
    is_active: "true",
  };

  return (
    <div className="space-y-4">
      <button onClick={() => setEditing(blank)} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        Aggiungi fonte
      </button>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Copertura</th>
              <th className="p-3">Affidabilità</th>
              <th className="p-3">Attiva</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(sources ?? []).map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3">{s.source_type}</td>
                <td className="p-3">{s.coverage_scope}</td>
                <td className="p-3">{s.reliability_score}</td>
                <td className="p-3">{s.is_active ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-error" />}</td>
                <td className="p-3">
                  <button onClick={() => setEditing(s as unknown as Record<string, string>)} className="text-sm text-primary">
                    Modifica
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <SourceEditor
          source={editing}
          onSave={(payload) => mutation.mutate({ data: payload as unknown as Parameters<typeof upsertNewsSource>[0]["data"] })}
          onClose={() => setEditing(null)}
          saving={mutation.isPending}
        />
      )}
    </div>
  );
}

function SourceEditor({
  source,
  onSave,
  onClose,
  saving,
}: {
  source: Record<string, string>;
  onSave: (payload: Record<string, unknown>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [s, setS] = useState(source);
  const update = (key: string, value: string) => setS((p) => ({ ...p, [key]: value }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-background p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{s.id ? "Modifica fonte" : "Nuova fonte"}</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Nome" value={s.name} onChange={(v) => update("name", v)} />
          <Input label="Dominio" value={s.domain} onChange={(v) => update("domain", v)} />
          <Input label="Feed URL" value={s.feed_url} onChange={(v) => update("feed_url", v)} />
          <Input label="Endpoint URL" value={s.endpoint_url} onChange={(v) => update("endpoint_url", v)} />
          <Select label="Tipo" value={s.source_type} options={["rss", "api", "institutional", "html"]} onChange={(v) => update("source_type", v)} />
          <Select label="Copertura" value={s.coverage_scope} options={["piemonte", "italia", "provincia", "comune"]} onChange={(v) => update("coverage_scope", v)} />
          <Input label="Provincia" value={s.province} onChange={(v) => update("province", v)} />
          <Input label="Città" value={s.city} onChange={(v) => update("city", v)} />
          <Input label="Affidabilità 1-5" value={s.reliability_score} onChange={(v) => update("reliability_score", v)} />
          <Select label="Attiva" value={s.is_active} options={["true", "false"]} onChange={(v) => update("is_active", v)} />
          <Select label="Scraping" value={s.allows_scraping} options={["true", "false"]} onChange={(v) => update("allows_scraping", v)} />
          <Select label="Riutilizzo immagini" value={s.allows_image_reuse} options={["true", "false"]} onChange={(v) => update("allows_image_reuse", v)} />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm">
            Annulla
          </button>
          <button
            onClick={() =>
              onSave({
                ...s,
                reliability_score: Number(s.reliability_score),
                is_active: s.is_active === "true",
                allows_scraping: s.allows_scraping === "true",
                allows_image_reuse: s.allows_image_reuse === "true",
              })
            }
            disabled={saving}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Salvataggio…" : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function CandidatesTab() {
  const fetchCandidates = useServerFn(listNewsCandidates);
  const [status, setStatus] = useState<string>("pending");
  const { data } = useQuery({
    queryKey: ["news-candidates", status],
    queryFn: () => fetchCandidates({ data: { status, limit: 100 } }),
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["pending", "scored", "selected", "duplicate", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full border px-3 py-1 text-sm ${status === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {(data ?? []).map((c) => (
          <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-medium">{c.title_original}</h4>
              <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs">{c.processing_status}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.excerpt_original}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-md bg-muted px-2 py-1">{c.source_name}</span>
              <span className="rounded-md bg-muted px-2 py-1">{c.geographic_scope}</span>
              <span className="rounded-md bg-muted px-2 py-1">rel: {c.relevance_score ?? "—"}</span>
              <span className="rounded-md bg-muted px-2 py-1">cred: {c.credibility_score ?? "—"}</span>
            </div>
            {c.rejection_reason && (
              <p className="mt-2 text-xs text-error">Motivo: {c.rejection_reason}</p>
            )}
            <a href={c.canonical_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-primary">
              Apri fonte
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticlesTab() {
  const queryClient = useQueryClient();
  const fetchArticles = useServerFn(listNewsArticles);
  const fetchArticle = useServerFn(getNewsArticleWithSources);
  const saveArticle = useServerFn(updateNewsArticle);
  const approve = useServerFn(approveNewsArticle);
  const reject = useServerFn(rejectNewsArticle);
  const [status, setStatus] = useState<string>("draft");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, string>>({});

  const { data: articles } = useQuery({
    queryKey: ["news-articles", status],
    queryFn: () => fetchArticles({ data: { status, limit: 50 } }),
  });

  const { data: full } = useQuery({
    queryKey: ["news-article", editingId],
    queryFn: () => fetchArticle({ data: { id: editingId! } }),
    enabled: !!editingId,
  });

  const saveMutation = useMutation({
    mutationFn: saveArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-articles"] });
      setEditingId(null);
    },
  });

  const approveMutation = useMutation({
    mutationFn: approve,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["news-articles"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: reject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["news-articles"] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["draft", "review", "published", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full border px-3 py-1 text-sm ${status === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {(articles ?? []).map((a) => (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-medium">{a.title}</h4>
              <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs">{a.status}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-md bg-muted px-2 py-1">{a.category_slug}</span>
              <span className="rounded-md bg-muted px-2 py-1">{a.geographic_scope}</span>
              <span className="rounded-md bg-muted px-2 py-1">rel: {a.relevance_score}</span>
              <span className="rounded-md bg-muted px-2 py-1">cred: {a.credibility_score}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => { setEditingId(a.id); setEditing({ title: a.title, subtitle: a.subtitle ?? "", summary: a.summary ?? "", body: a.body ?? "", seo_title: a.seo_title ?? "", seo_description: a.seo_description ?? "" }); }} className="text-sm text-primary">
                Modifica
              </button>
              {a.status !== "published" && (
                <button onClick={() => approveMutation.mutate({ data: { id: a.id } })} className="text-sm text-success">
                  Pubblica
                </button>
              )}
              {a.status !== "rejected" && (
                <button onClick={() => rejectMutation.mutate({ data: { id: a.id } })} className="text-sm text-error">
                  Rifiuta
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingId && full && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Modifica articolo</h3>
              <button onClick={() => setEditingId(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <Input label="Titolo" value={editing.title} onChange={(v) => setEditing((p) => ({ ...p, title: v }))} />
              <Input label="Sottotitolo" value={editing.subtitle} onChange={(v) => setEditing((p) => ({ ...p, subtitle: v }))} />
              <Textarea label="Sommario" value={editing.summary} onChange={(v) => setEditing((p) => ({ ...p, summary: v }))} />
              <Textarea label="Corpo (HTML)" value={editing.body} onChange={(v) => setEditing((p) => ({ ...p, body: v }))} />
              <Input label="SEO title" value={editing.seo_title} onChange={(v) => setEditing((p) => ({ ...p, seo_title: v }))} />
              <Input label="SEO description" value={editing.seo_description} onChange={(v) => setEditing((p) => ({ ...p, seo_description: v }))} />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditingId(null)} className="rounded-full border border-border px-4 py-2 text-sm">
                Annulla
              </button>
              <button
                onClick={() =>
                  saveMutation.mutate({ data: {
                    id: editingId,
                    patch: {
                      title: editing.title,
                      subtitle: editing.subtitle,
                      summary: editing.summary,
                      body: editing.body,
                      seo_title: editing.seo_title,
                      seo_description: editing.seo_description,
                    },
                  } })
                }
                disabled={saveMutation.isPending}
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {saveMutation.isPending ? "Salvataggio…" : "Salva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}

function RunsTab() {
  const fetchRuns = useServerFn(listAutomationRuns);
  const { data } = useQuery({ queryKey: ["news-runs"], queryFn: () => fetchRuns({ data: { limit: 20 } }) });

  return (
    <div className="space-y-3">
      {(data ?? []).map((r) => (
        <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{new Date(r.started_at).toLocaleString("it-IT")}</span>
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                r.status === "completed" ? "bg-success/10 text-success" : r.status === "failed" ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
              }`}
            >
              {r.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Trigger: {r.triggered_by}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            <div className="rounded-xl bg-muted p-2">Fonti: {r.sources_checked}</div>
            <div className="rounded-xl bg-muted p-2">Candidati: {r.candidates_collected}</div>
            <div className="rounded-xl bg-muted p-2">Duplicati: {r.duplicates_found}</div>
            <div className="rounded-xl bg-muted p-2">Generati: {r.articles_generated}</div>
            <div className="rounded-xl bg-muted p-2">Pubblicati: {r.articles_published}</div>
            <div className="rounded-xl bg-muted p-2">Revisione: {r.articles_review}</div>
            <div className="rounded-xl bg-muted p-2">Rifiutati: {r.articles_rejected}</div>
          </div>
          {Array.isArray(r.errors) && r.errors.length > 0 && (
            <div className="mt-3 rounded-xl bg-error/5 p-3 text-xs text-error">
              <div className="flex items-center gap-1 font-semibold">
                <AlertTriangle className="h-3 w-3" /> Errori
              </div>
              <pre className="mt-1 whitespace-pre-wrap">{JSON.stringify(r.errors, null, 2)}</pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
