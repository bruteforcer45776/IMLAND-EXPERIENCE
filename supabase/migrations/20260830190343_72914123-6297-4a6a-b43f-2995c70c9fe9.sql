-- ============ TERRAIN ============
CREATE TABLE public.terrain_places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  description text,
  comune text NOT NULL,
  province text,
  address text,
  latitude numeric,
  longitude numeric,
  phone text,
  email text,
  website text,
  image_url text,
  plan text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'pending',
  moderation_note text,
  verified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX terrain_places_comune_idx ON public.terrain_places (lower(comune));
CREATE INDEX terrain_places_category_idx ON public.terrain_places (category);
CREATE INDEX terrain_places_status_idx ON public.terrain_places (status);

GRANT SELECT ON public.terrain_places TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.terrain_places TO authenticated;
GRANT ALL ON public.terrain_places TO service_role;
ALTER TABLE public.terrain_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "terrain_places_public_read" ON public.terrain_places
  FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "terrain_places_owner_read" ON public.terrain_places
  FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "terrain_places_admin_read" ON public.terrain_places
  FOR SELECT TO authenticated USING (private.is_admin());
CREATE POLICY "terrain_places_owner_insert" ON public.terrain_places
  FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND status = 'pending');
CREATE POLICY "terrain_places_owner_update" ON public.terrain_places
  FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "terrain_places_admin_write" ON public.terrain_places
  FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE TRIGGER terrain_places_updated_at BEFORE UPDATE ON public.terrain_places
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.terrain_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_id uuid NOT NULL REFERENCES public.terrain_places(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, place_id)
);
GRANT SELECT, INSERT, DELETE ON public.terrain_favorites TO authenticated;
GRANT ALL ON public.terrain_favorites TO service_role;
ALTER TABLE public.terrain_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "terrain_favorites_own" ON public.terrain_favorites
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============ JOBS ============
CREATE TABLE public.job_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name text NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  sector text NOT NULL,
  contract_type text NOT NULL,
  description text NOT NULL,
  requirements text,
  comune text NOT NULL,
  province text,
  latitude numeric,
  longitude numeric,
  salary_range text,
  apply_email text,
  status text NOT NULL DEFAULT 'pending',
  moderation_note text,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '60 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX job_posts_sector_idx ON public.job_posts (sector);
CREATE INDEX job_posts_comune_idx ON public.job_posts (lower(comune));
CREATE INDEX job_posts_status_idx ON public.job_posts (status);

GRANT SELECT ON public.job_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_posts TO authenticated;
GRANT ALL ON public.job_posts TO service_role;
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_posts_public_read" ON public.job_posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published' AND expires_at > now());
CREATE POLICY "job_posts_owner_read" ON public.job_posts
  FOR SELECT TO authenticated USING (company_id = auth.uid());
CREATE POLICY "job_posts_admin_read" ON public.job_posts
  FOR SELECT TO authenticated USING (private.is_admin());
CREATE POLICY "job_posts_owner_insert" ON public.job_posts
  FOR INSERT TO authenticated WITH CHECK (company_id = auth.uid() AND status = 'pending');
CREATE POLICY "job_posts_owner_update" ON public.job_posts
  FOR UPDATE TO authenticated USING (company_id = auth.uid()) WITH CHECK (company_id = auth.uid());
CREATE POLICY "job_posts_admin_write" ON public.job_posts
  FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE TRIGGER job_posts_updated_at BEFORE UPDATE ON public.job_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.job_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES public.job_posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, job_id)
);
GRANT SELECT, INSERT, DELETE ON public.job_saves TO authenticated;
GRANT ALL ON public.job_saves TO service_role;
ALTER TABLE public.job_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "job_saves_own" ON public.job_saves
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.job_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  cv_path text,
  status text NOT NULL DEFAULT 'sent',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_applications_own" ON public.job_applications
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "job_applications_company_read" ON public.job_applications
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.job_posts p WHERE p.id = job_id AND p.company_id = auth.uid()));
CREATE POLICY "job_applications_company_update" ON public.job_applications
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.job_posts p WHERE p.id = job_id AND p.company_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.job_posts p WHERE p.id = job_id AND p.company_id = auth.uid()));
CREATE POLICY "job_applications_admin" ON public.job_applications
  FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE TRIGGER job_applications_updated_at BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ALERT ============
CREATE TABLE public.territory_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  reporter_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  category text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  comune text NOT NULL,
  province text,
  latitude numeric,
  longitude numeric,
  contact_email text,
  status text NOT NULL DEFAULT 'received',
  moderation_note text,
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX territory_alerts_status_idx ON public.territory_alerts (status);
CREATE INDEX territory_alerts_comune_idx ON public.territory_alerts (lower(comune));

GRANT SELECT ON public.territory_alerts TO anon;
GRANT SELECT, INSERT, UPDATE ON public.territory_alerts TO authenticated;
GRANT ALL ON public.territory_alerts TO service_role;
ALTER TABLE public.territory_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "territory_alerts_public_read" ON public.territory_alerts
  FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "territory_alerts_owner_read" ON public.territory_alerts
  FOR SELECT TO authenticated USING (reporter_id = auth.uid());
CREATE POLICY "territory_alerts_admin_all" ON public.territory_alerts
  FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE POLICY "territory_alerts_owner_insert" ON public.territory_alerts
  FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid() AND status = 'received');

CREATE TRIGGER territory_alerts_updated_at BEFORE UPDATE ON public.territory_alerts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- validazione lunghezze
CREATE OR REPLACE FUNCTION public.validate_territory_alert()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF length(NEW.title) < 5 OR length(NEW.title) > 160 THEN
    RAISE EXCEPTION 'titolo non valido';
  END IF;
  IF length(NEW.body) < 20 OR length(NEW.body) > 4000 THEN
    RAISE EXCEPTION 'descrizione non valida';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER validate_territory_alert_trg BEFORE INSERT OR UPDATE ON public.territory_alerts
  FOR EACH ROW EXECUTE FUNCTION public.validate_territory_alert();