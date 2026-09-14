import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

export type FieldKind = "text" | "textarea" | "number" | "bool" | "datetime" | "list" | "select";

export type Field = {
  name: string;
  label: string;
  kind: FieldKind;
  options?: readonly string[];
  required?: boolean;
};

type TableName =
  | "previews"
  | "benefits"
  | "member_events"
  | "exclusive_contents"
  | "discoveries"
  | "notifications";

type Row = Record<string, unknown> & { id: string };

function emptyValues(fields: Field[]) {
  const v: Record<string, string | boolean> = {};
  for (const f of fields) v[f.name] = f.kind === "bool" ? true : "";
  return v;
}

function toDbValue(field: Field, raw: string | boolean) {
  if (field.kind === "bool") return Boolean(raw);
  const value = String(raw).trim();
  if (value === "") return field.required ? "" : null;
  if (field.kind === "number") return Number(value);
  if (field.kind === "list") return value.split(",").map((s) => s.trim()).filter(Boolean);
  if (field.kind === "datetime") return new Date(value).toISOString();
  return value;
}

function toFormValue(field: Field, raw: unknown): string | boolean {
  if (field.kind === "bool") return Boolean(raw);
  if (raw === null || raw === undefined) return "";
  if (field.kind === "list") return Array.isArray(raw) ? raw.join(", ") : String(raw);
  if (field.kind === "datetime") {
    const d = new Date(String(raw));
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  return String(raw);
}

export function AdminResource({
  table,
  title,
  fields,
  titleField,
  orderBy,
}: {
  table: TableName;
  title: string;
  fields: Field[];
  titleField: string;
  orderBy: string;
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [values, setValues] = useState<Record<string, string | boolean>>(emptyValues(fields));

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(orderBy, { ascending: false });
      if (error) throw error;
      return data as unknown as Row[];
    },
  });

  const openNew = () => {
    setValues(emptyValues(fields));
    setEditing("new");
  };

  const openEdit = (row: Row) => {
    const v: Record<string, string | boolean> = {};
    for (const f of fields) v[f.name] = toFormValue(f, row[f.name]);
    setValues(v);
    setEditing(row);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {};
      for (const f of fields) {
        const value = toDbValue(f, values[f.name] ?? "");
        if (f.required && (value === "" || value === null)) {
          throw new Error(`Campo obbligatorio: ${f.label}`);
        }
        payload[f.name] = value;
      }
      if (editing === "new") {
        const { error } = await supabase.from(table).insert(payload as never);
        if (error) throw error;
      } else if (editing) {
        const { error } = await supabase.from(table).update(payload as never).eq("id", editing.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", table] });
      setEditing(null);
      toast.success("Salvato.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Salvataggio non riuscito"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", table] });
      toast.success("Eliminato.");
    },
    onError: () => toast.error("Eliminazione non riuscita."),
  });

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-h3-im">{title}</h2>
        <Button className="rounded-full" onClick={openNew}>
          <Plus size={15} /> Nuovo
        </Button>
      </div>

      {isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">Caricamento…</p>
      ) : data.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Nessun elemento.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {data.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-3 py-3">
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{String(row[titleField] ?? "—")}</span>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => openEdit(row)}
                  aria-label="Modifica"
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => remove.mutate(row.id)}
                  aria-label="Elimina"
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">{editing === "new" ? "Nuovo elemento" : "Modifica elemento"}</h3>
            <button onClick={() => setEditing(null)} aria-label="Chiudi" className="text-muted-foreground">
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={`space-y-1.5 ${f.kind === "textarea" ? "md:col-span-2" : ""}`}>
                <Label htmlFor={`${table}-${f.name}`}>
                  {f.label}
                  {f.required ? " *" : ""}
                </Label>
                {f.kind === "bool" ? (
                  <div className="pt-1">
                    <Switch
                      checked={Boolean(values[f.name])}
                      onCheckedChange={(c) => setValues((v) => ({ ...v, [f.name]: c }))}
                    />
                  </div>
                ) : f.kind === "textarea" ? (
                  <Textarea
                    id={`${table}-${f.name}`}
                    rows={4}
                    maxLength={5000}
                    value={String(values[f.name] ?? "")}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  />
                ) : f.kind === "select" ? (
                  <select
                    id={`${table}-${f.name}`}
                    value={String(values[f.name] ?? "")}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">—</option>
                    {(f.options ?? []).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={`${table}-${f.name}`}
                    type={f.kind === "number" ? "number" : f.kind === "datetime" ? "datetime-local" : "text"}
                    maxLength={f.kind === "text" ? 500 : undefined}
                    value={String(values[f.name] ?? "")}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <Button className="rounded-full" disabled={save.isPending} onClick={() => save.mutate()}>
              Salva
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => setEditing(null)}>
              Annulla
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
