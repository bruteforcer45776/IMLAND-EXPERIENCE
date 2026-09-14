import { useEffect, useMemo, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { notifyError } from "@/lib/errors";
import { podcastAudio, primeSavedPositions } from "@/components/podcast-audio";
import { allEpisodes, episodeLink, parseEpisodeDate, type EpisodeRef } from "@/lib/listener-catalog";

/* ------------------------------------------------------------------ *
 * Progressi di ascolto
 * ------------------------------------------------------------------ */

export type ProgressRow = {
  id: string;
  program_slug: string;
  episode_slug: string;
  audio_url: string;
  position_seconds: number;
  duration_seconds: number | null;
  completed: boolean;
  updated_at: string;
};

export function useListenerProgress() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["listener-progress", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listener_progress")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ProgressRow[];
    },
  });

  const rows = query.data ?? [];

  // Le posizioni del server alimentano il player locale (ripresa cross-device).
  useEffect(() => {
    if (rows.length === 0) return;
    const map: Record<string, number> = {};
    for (const row of rows) {
      if (!row.completed) map[row.audio_url] = Number(row.position_seconds) || 0;
    }
    primeSavedPositions(map);
  }, [rows]);

  const byEpisode = useMemo(() => {
    const m = new Map<string, ProgressRow>();
    for (const row of rows) m.set(row.episode_slug, row);
    return m;
  }, [rows]);

  return { rows, byEpisode, isLoading: query.isLoading };
}

/**
 * Salva il tempo di ascolto della puntata corrente sul database, così la
 * ripresa funziona anche cambiando dispositivo o svuotando il browser.
 */
export function useListenerProgressSync() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const lastSaved = useRef<{ audio: string; position: number; at: number }>({
    audio: "",
    position: 0,
    at: 0,
  });

  useEffect(() => {
    if (!user) return;

    const save = async (force = false) => {
      const { track, time, duration } = podcastAudio.get();
      if (!track || !isFinite(time) || time < 5) return;
      const now = Date.now();
      const prev = lastSaved.current;
      const movedEnough = prev.audio !== track.audio || Math.abs(time - prev.position) >= 10;
      const waitedEnough = now - prev.at >= 15000;
      if (!force && !(movedEnough && waitedEnough)) return;
      lastSaved.current = { audio: track.audio, position: time, at: now };

      const completed = Boolean(duration && time >= duration - 20);
      const { error } = await supabase.from("listener_progress").upsert(
        {
          user_id: user.id,
          program_slug: track.programSlug,
          episode_slug: track.episodeSlug,
          audio_url: track.audio,
          position_seconds: Math.round(time),
          duration_seconds: duration && isFinite(duration) ? Math.round(duration) : null,
          completed,
        },
        { onConflict: "user_id,episode_slug" },
      );
      if (!error) void qc.invalidateQueries({ queryKey: ["listener-progress"] });
    };

    const unsubscribe = podcastAudio.subscribe(() => void save());
    const onHide = () => void save(true);
    window.addEventListener("pagehide", onHide);
    const interval = window.setInterval(() => void save(true), 30000);

    return () => {
      unsubscribe();
      window.removeEventListener("pagehide", onHide);
      window.clearInterval(interval);
      void save(true);
    };
  }, [user, qc]);
}

/* ------------------------------------------------------------------ *
 * Raccolte / playlist
 * ------------------------------------------------------------------ */

export type Collection = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
};

export type CollectionItem = {
  id: string;
  collection_id: string;
  program_slug: string;
  episode_slug: string;
  label: string | null;
  link_url: string | null;
  sort_order: number;
  created_at: string;
};

export function useCollections() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["listener-collections"] });
    void qc.invalidateQueries({ queryKey: ["listener-collection-items"] });
  };

  const collections = useQuery({
    queryKey: ["listener-collections", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listener_collections")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Collection[];
    },
  });

  const items = useQuery({
    queryKey: ["listener-collection-items", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listener_collection_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as CollectionItem[];
    },
  });

  const createCollection = useMutation({
    mutationFn: async (input: { name: string; description?: string }) => {
      if (!user) throw new Error("Devi accedere");
      const { data, error } = await supabase
        .from("listener_collections")
        .insert({
          user_id: user.id,
          name: input.name.trim(),
          description: input.description?.trim() || null,
          sort_order: (collections.data ?? []).length,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Raccolta creata.");
    },
    onError: (error) => notifyError(error, { fallback: "Non è stato possibile creare la raccolta." }),
  });

  const renameCollection = useMutation({
    mutationFn: async (input: { id: string; name: string }) => {
      const { error } = await supabase
        .from("listener_collections")
        .update({ name: input.name.trim() })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteCollection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("listener_collections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Raccolta eliminata.");
    },
  });

  const addItem = useMutation({
    mutationFn: async (input: {
      collectionId: string;
      programSlug: string;
      episodeSlug: string;
      label: string;
    }) => {
      if (!user) throw new Error("Devi accedere");
      const existing = (items.data ?? []).filter((i) => i.collection_id === input.collectionId);
      const { error } = await supabase.from("listener_collection_items").upsert(
        {
          collection_id: input.collectionId,
          user_id: user.id,
          program_slug: input.programSlug,
          episode_slug: input.episodeSlug,
          label: input.label,
          link_url: episodeLink(input.programSlug, input.episodeSlug),
          sort_order: existing.length,
        },
        { onConflict: "collection_id,episode_slug" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Puntata aggiunta alla raccolta.");
    },
    onError: (error) => notifyError(error, { fallback: "Non è stato possibile aggiornare la raccolta." }),
  });

  const removeItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("listener_collection_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const moveItem = useMutation({
    mutationFn: async (input: { id: string; collectionId: string; direction: -1 | 1 }) => {
      const list = (items.data ?? [])
        .filter((i) => i.collection_id === input.collectionId)
        .sort((a, b) => a.sort_order - b.sort_order);
      const index = list.findIndex((i) => i.id === input.id);
      const target = index + input.direction;
      if (index < 0 || target < 0 || target >= list.length) return;
      const a = list[index];
      const b = list[target];
      const { error } = await supabase.from("listener_collection_items").upsert([
        { id: a.id, sort_order: b.sort_order },
        { id: b.id, sort_order: a.sort_order },
      ] as never);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error) => notifyError(error, { fallback: "Non è stato possibile riordinare la raccolta." }),
  });

  return {
    collections: collections.data ?? [],
    items: items.data ?? [],
    isLoading: collections.isLoading || items.isLoading,
    createCollection,
    renameCollection,
    deleteCollection,
    addItem,
    removeItem,
    moveItem,
  };
}

/* ------------------------------------------------------------------ *
 * Canali seguiti e notifiche nuove puntate
 * ------------------------------------------------------------------ */

export type Follow = {
  id: string;
  program_slug: string;
  last_seen_at: string;
  created_at: string;
};

export function useFollows() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["listener-follows", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from("listener_follows").select("*");
      if (error) throw error;
      return (data ?? []) as Follow[];
    },
  });

  const toggle = useMutation({
    mutationFn: async (programSlug: string) => {
      if (!user) throw new Error("Devi accedere");
      const existing = (query.data ?? []).find((f) => f.program_slug === programSlug);
      if (existing) {
        const { error } = await supabase.from("listener_follows").delete().eq("id", existing.id);
        if (error) throw error;
        return "removed" as const;
      }
      const { error } = await supabase
        .from("listener_follows")
        .insert({ user_id: user.id, program_slug: programSlug });
      if (error) throw error;
      return "added" as const;
    },
    onSuccess: (result) => {
      void qc.invalidateQueries({ queryKey: ["listener-follows"] });
      toast.success(result === "added" ? "Canale seguito." : "Canale non più seguito.");
    },
    onError: (error) => notifyError(error, { fallback: "Non è stato possibile aggiornare i canali seguiti." }),
  });

  const markSeen = useMutation({
    mutationFn: async (programSlugs?: string[]) => {
      const targets = (query.data ?? []).filter(
        (f) => !programSlugs || programSlugs.includes(f.program_slug),
      );
      if (targets.length === 0) return;
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("listener_follows")
        .update({ last_seen_at: now })
        .in(
          "id",
          targets.map((t) => t.id),
        );
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["listener-follows"] }),
  });

  const isFollowing = (programSlug: string) =>
    (query.data ?? []).some((f) => f.program_slug === programSlug);

  return { follows: query.data ?? [], isFollowing, toggle, markSeen, isLoading: query.isLoading };
}

export type EpisodeNotification = EpisodeRef & { publishedAt: Date; followedSince: Date; isNew: boolean };

/**
 * Notifiche derivate: nuove puntate dei canali seguiti pubblicate dopo
 * l'ultima visita all'area notifiche.
 */
export function useEpisodeNotifications() {
  const { follows, markSeen, isLoading } = useFollows();

  const notifications = useMemo<EpisodeNotification[]>(() => {
    if (follows.length === 0) return [];
    const rows: EpisodeNotification[] = [];
    for (const follow of follows) {
      const seenAt = new Date(follow.last_seen_at);
      const since = new Date(follow.created_at);
      for (const ref of allEpisodes()) {
        if (ref.program.slug !== follow.program_slug) continue;
        const publishedAt = parseEpisodeDate(ref.episode.date);
        if (!publishedAt) continue;
        rows.push({
          ...ref,
          publishedAt,
          followedSince: since,
          isNew: publishedAt.getTime() > seenAt.getTime(),
        });
      }
    }
    return rows.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()).slice(0, 40);
  }, [follows]);

  const unread = notifications.filter((n) => n.isNew).length;

  return { notifications, unread, markSeen, isLoading };
}

/* ------------------------------------------------------------------ *
 * Condivisioni con tracking
 * ------------------------------------------------------------------ */

export type ShareRow = {
  id: string;
  token: string;
  program_slug: string;
  episode_slug: string;
  title: string;
  link_url: string;
  channel: string;
  click_count: number;
  last_click_at: string | null;
  created_at: string;
};

function randomToken() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(36).padStart(2, "0")).join("").slice(0, 12);
}

export function useShares() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["listener-shares", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listener_shares")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ShareRow[];
    },
  });

  const createShare = useMutation({
    mutationFn: async (input: {
      programSlug: string;
      episodeSlug: string;
      title: string;
      channel?: string;
    }) => {
      if (!user) throw new Error("Devi accedere");
      const existing = (query.data ?? []).find(
        (s) => s.episode_slug === input.episodeSlug && s.channel === (input.channel ?? "link"),
      );
      if (existing) return existing;
      const { data, error } = await supabase
        .from("listener_shares")
        .insert({
          user_id: user.id,
          token: randomToken(),
          program_slug: input.programSlug,
          episode_slug: input.episodeSlug,
          title: input.title,
          link_url: episodeLink(input.programSlug, input.episodeSlug),
          channel: input.channel ?? "link",
        })
        .select("*")
        .single();
      if (error) throw error;
      return data as ShareRow;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["listener-shares"] }),
    onError: (error) => notifyError(error, { fallback: "Non è stato possibile generare il link." }),
  });

  const totalClicks = (query.data ?? []).reduce((sum, s) => sum + s.click_count, 0);

  return { shares: query.data ?? [], totalClicks, createShare, isLoading: query.isLoading };
}

export function shareUrl(token: string) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/s/${token}`;
}
