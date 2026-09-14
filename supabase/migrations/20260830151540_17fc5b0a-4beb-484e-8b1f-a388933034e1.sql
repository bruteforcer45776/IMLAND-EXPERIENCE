-- 1. Progressi di ascolto per puntata
CREATE TABLE public.listener_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  program_slug text NOT NULL,
  episode_slug text NOT NULL,
  audio_url text NOT NULL,
  position_seconds numeric NOT NULL DEFAULT 0,
  duration_seconds numeric,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, episode_slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listener_progress TO authenticated;
GRANT ALL ON public.listener_progress TO service_role;
ALTER TABLE public.listener_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listener_progress_own" ON public.listener_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER listener_progress_updated_at BEFORE UPDATE ON public.listener_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Raccolte / playlist
CREATE TABLE public.listener_collections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listener_collections TO authenticated;
GRANT ALL ON public.listener_collections TO service_role;
ALTER TABLE public.listener_collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listener_collections_own" ON public.listener_collections FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER listener_collections_updated_at BEFORE UPDATE ON public.listener_collections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Elementi delle raccolte
CREATE TABLE public.listener_collection_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id uuid NOT NULL REFERENCES public.listener_collections(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  program_slug text NOT NULL,
  episode_slug text NOT NULL,
  label text,
  link_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (collection_id, episode_slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listener_collection_items TO authenticated;
GRANT ALL ON public.listener_collection_items TO service_role;
ALTER TABLE public.listener_collection_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listener_collection_items_own" ON public.listener_collection_items FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER listener_collection_items_updated_at BEFORE UPDATE ON public.listener_collection_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Canali seguiti (per le notifiche nuove puntate)
CREATE TABLE public.listener_follows (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  program_slug text NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, program_slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listener_follows TO authenticated;
GRANT ALL ON public.listener_follows TO service_role;
ALTER TABLE public.listener_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listener_follows_own" ON public.listener_follows FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER listener_follows_updated_at BEFORE UPDATE ON public.listener_follows
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Condivisioni con tracking
CREATE TABLE public.listener_shares (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  program_slug text NOT NULL,
  episode_slug text NOT NULL,
  title text NOT NULL,
  link_url text NOT NULL,
  channel text NOT NULL DEFAULT 'link',
  click_count integer NOT NULL DEFAULT 0,
  last_click_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listener_shares TO authenticated;
GRANT ALL ON public.listener_shares TO service_role;
ALTER TABLE public.listener_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listener_shares_own" ON public.listener_shares FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER listener_shares_updated_at BEFORE UPDATE ON public.listener_shares
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX listener_progress_user_idx ON public.listener_progress (user_id, updated_at DESC);
CREATE INDEX listener_collection_items_collection_idx ON public.listener_collection_items (collection_id, sort_order);
CREATE INDEX listener_shares_user_idx ON public.listener_shares (user_id, created_at DESC);
