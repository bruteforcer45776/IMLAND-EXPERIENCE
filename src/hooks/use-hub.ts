import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { notifyError } from "@/lib/errors";
import { distanceKm, uniqueSlug } from "@/lib/hub";
import type { Database } from "@/integrations/supabase/types";

export type Place = Database["public"]["Tables"]["terrain_places"]["Row"];
export type JobPost = Database["public"]["Tables"]["job_posts"]["Row"];
export type JobApplication = Database["public"]["Tables"]["job_applications"]["Row"];

export type Coords = { lat: number; lon: number };

/** Posizione del dispositivo, chiesta solo su gesto dell'utente. */
export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("La posizione non è disponibile su questo dispositivo.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        setError("Non abbiamo il permesso di usare la tua posizione.");
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  const clear = useCallback(() => setCoords(null), []);

  return { coords, loading, error, request, clear };
}

function withDistance<T extends { latitude: number | null; longitude: number | null }>(
  rows: T[],
  coords: Coords | null,
  radiusKm: number | null,
): (T & { distance: number | null })[] {
  const mapped = rows.map((row) => ({
    ...row,
    distance:
      coords && row.latitude != null && row.longitude != null
        ? distanceKm(coords, { lat: Number(row.latitude), lon: Number(row.longitude) })
        : null,
  }));
  const filtered =
    coords && radiusKm
      ? mapped.filter((r) => r.distance == null || r.distance <= radiusKm)
      : mapped;
  if (!coords) return filtered;
  return filtered.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
}

/* ------------------------------- TERRAIN ------------------------------- */

export type PlaceFilters = {
  q?: string;
  category?: string;
  comune?: string;
  radiusKm?: number | null;
};

export function usePlaces(filters: PlaceFilters, coords: Coords | null) {
  const query = useQuery({
    queryKey: ["terrain", "places", filters.q ?? "", filters.category ?? "", filters.comune ?? ""],
    queryFn: async () => {
      let q = supabase
        .from("terrain_places")
        .select("*")
        .eq("status", "published")
        .order("plan", { ascending: false })
        .order("name", { ascending: true })
        .limit(200);
      if (filters.category) q = q.eq("category", filters.category);
      if (filters.comune) q = q.ilike("comune", filters.comune);
      if (filters.q) q = q.or(`name.ilike.%${filters.q}%,description.ilike.%${filters.q}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const places = withDistance(query.data ?? [], coords, filters.radiusKm ?? null);
  return { ...query, places };
}

export function usePlace(slug: string) {
  return useQuery({
    queryKey: ["terrain", "place", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("terrain_places")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useTerrainFavorites() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["terrain", "favorites", user?.id ?? "guest"],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("terrain_favorites")
        .select("place_id, created_at, terrain_places(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const ids = new Set((list.data ?? []).map((r) => r.place_id));

  const toggle = useMutation({
    mutationFn: async (placeId: string) => {
      if (!user) throw new Error("GUEST");
      if (ids.has(placeId)) {
        const { error } = await supabase
          .from("terrain_favorites")
          .delete()
          .eq("place_id", placeId)
          .eq("user_id", user.id);
        if (error) throw error;
        return "removed" as const;
      }
      const { error } = await supabase
        .from("terrain_favorites")
        .insert({ place_id: placeId, user_id: user.id });
      if (error) throw error;
      return "added" as const;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["terrain", "favorites"] }),
    onError: (error) => notifyError(error, { fallback: "Non è stato possibile salvare il luogo." }),
  });

  return { list, ids, toggle };
}

export function useMyPlaces() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["terrain", "mine", user?.id ?? "guest"],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("terrain_places")
        .select("*")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export type PlaceDraft = {
  name: string;
  category: string;
  comune: string;
  province: string | null;
  address: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
};

export function useCreatePlace() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (draft: PlaceDraft) => {
      if (!user) throw new Error("GUEST");
      const { data, error } = await supabase
        .from("terrain_places")
        .insert({ ...draft, owner_id: user.id, slug: uniqueSlug(draft.name), status: "pending" })
        .select("id, slug")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["terrain"] }),
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile inviare la scheda." }),
  });
}

/* --------------------------------- JOBS -------------------------------- */

export type JobFilters = {
  q?: string;
  sector?: string;
  contract?: string;
  comune?: string;
  radiusKm?: number | null;
};

export function useJobs(filters: JobFilters, coords: Coords | null) {
  const query = useQuery({
    queryKey: [
      "jobs",
      "list",
      filters.q ?? "",
      filters.sector ?? "",
      filters.contract ?? "",
      filters.comune ?? "",
    ],
    queryFn: async () => {
      let q = supabase
        .from("job_posts")
        .select("*")
        .eq("status", "published")
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(200);
      if (filters.sector) q = q.eq("sector", filters.sector);
      if (filters.contract) q = q.eq("contract_type", filters.contract);
      if (filters.comune) q = q.ilike("comune", filters.comune);
      if (filters.q)
        q = q.or(
          `title.ilike.%${filters.q}%,company_name.ilike.%${filters.q}%,description.ilike.%${filters.q}%`,
        );
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const jobs = withDistance(query.data ?? [], coords, filters.radiusKm ?? null);
  return { ...query, jobs };
}

export function useJob(slug: string) {
  return useQuery({
    queryKey: ["jobs", "detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useJobSaves() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["jobs", "saved", user?.id ?? "guest"],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_saves")
        .select("job_id, created_at, job_posts(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const ids = new Set((list.data ?? []).map((r) => r.job_id));

  const toggle = useMutation({
    mutationFn: async (jobId: string) => {
      if (!user) throw new Error("GUEST");
      if (ids.has(jobId)) {
        const { error } = await supabase
          .from("job_saves")
          .delete()
          .eq("job_id", jobId)
          .eq("user_id", user.id);
        if (error) throw error;
        return "removed" as const;
      }
      const { error } = await supabase
        .from("job_saves")
        .insert({ job_id: jobId, user_id: user.id });
      if (error) throw error;
      return "added" as const;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["jobs", "saved"] }),
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile salvare l'opportunità." }),
  });

  return { list, ids, toggle };
}

export function useMyApplication(jobId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["jobs", "application", jobId ?? "", user?.id ?? "guest"],
    enabled: Boolean(user && jobId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("job_id", jobId!)
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export type ApplicationDraft = {
  jobId: string;
  fullName: string;
  email: string;
  phone: string | null;
  message: string | null;
  cv: File | null;
};

export function useApplyToJob() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (draft: ApplicationDraft) => {
      if (!user) throw new Error("GUEST");
      let cvPath: string | null = null;
      if (draft.cv) {
        if (draft.cv.size > 5 * 1024 * 1024) throw new Error("Il CV non può superare i 5 MB.");
        const ext = draft.cv.name.split(".").pop()?.toLowerCase() ?? "pdf";
        if (!["pdf", "doc", "docx"].includes(ext)) throw new Error("Allega un CV in PDF o Word.");
        cvPath = `${user.id}/${draft.jobId}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("cv-uploads")
          .upload(cvPath, draft.cv, { upsert: true });
        if (upErr) throw upErr;
      }
      const { error } = await supabase.from("job_applications").insert({
        job_id: draft.jobId,
        user_id: user.id,
        full_name: draft.fullName,
        email: draft.email,
        phone: draft.phone,
        message: draft.message,
        cv_path: cvPath,
      });
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["jobs"] }),
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile inviare la candidatura." }),
  });
}

export function useMyJobs() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["jobs", "mine", user?.id ?? "guest"],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_posts")
        .select("*")
        .eq("company_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useReceivedApplications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["jobs", "received", user?.id ?? "guest"],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*, job_posts(title, slug, company_id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).filter((row) => row.job_posts?.company_id === user!.id);
    },
  });
}

export type JobDraft = {
  companyName: string;
  title: string;
  sector: string;
  contractType: string;
  description: string;
  requirements: string | null;
  comune: string;
  province: string | null;
  salaryRange: string | null;
  applyEmail: string | null;
  expiresAt: string;
  latitude: number | null;
  longitude: number | null;
};

export function useCreateJob() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (draft: JobDraft) => {
      if (!user) throw new Error("GUEST");
      const { data, error } = await supabase
        .from("job_posts")
        .insert({
          company_id: user.id,
          company_name: draft.companyName,
          title: draft.title,
          slug: uniqueSlug(`${draft.companyName}-${draft.title}`),
          sector: draft.sector,
          contract_type: draft.contractType,
          description: draft.description,
          requirements: draft.requirements,
          comune: draft.comune,
          province: draft.province,
          salary_range: draft.salaryRange,
          apply_email: draft.applyEmail,
          expires_at: draft.expiresAt,
          latitude: draft.latitude,
          longitude: draft.longitude,
          status: "pending",
        })
        .select("id, slug")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["jobs"] }),
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile inviare l'annuncio." }),
  });
}

/* ------------------------------ MODERAZIONE ---------------------------- */

export function useHubModeration() {
  const qc = useQueryClient();

  const places = useQuery({
    queryKey: ["hub", "moderation", "places"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("terrain_places")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const jobs = useQuery({
    queryKey: ["hub", "moderation", "jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const alerts = useQuery({
    queryKey: ["hub", "moderation", "alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("territory_alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const setPlaceStatus = useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: string; note?: string }) => {
      const { error } = await supabase
        .from("terrain_places")
        .update({
          status,
          moderation_note: note ?? null,
          verified_at: status === "published" ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["hub", "moderation", "places"] }),
    onError: (error) => notifyError(error),
  });

  const setJobStatus = useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: string; note?: string }) => {
      const { error } = await supabase
        .from("job_posts")
        .update({ status, moderation_note: note ?? null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["hub", "moderation", "jobs"] }),
    onError: (error) => notifyError(error),
  });

  const setAlertStatus = useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: string; note?: string }) => {
      const { error } = await supabase
        .from("territory_alerts")
        .update({
          status,
          moderation_note: note ?? null,
          published_at: status === "published" ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["hub", "moderation", "alerts"] }),
    onError: (error) => notifyError(error),
  });

  return { places, jobs, alerts, setPlaceStatus, setJobStatus, setAlertStatus };
}
