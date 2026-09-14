-- FASE 1: fondamenta Hub territoriale (additiva, nessun DROP di tabelle/dati)

CREATE TYPE public.org_kind AS ENUM ('azienda','associazione','ente','organizzatore','professionista','altro');
CREATE TYPE public.org_status AS ENUM ('draft','email_verification','org_verification','approved','limited','suspended','archived');
CREATE TYPE public.org_member_role AS ENUM ('owner','org_admin','editor','recruiter','events','analyst','viewer');
CREATE TYPE public.verification_outcome AS ENUM ('pending','approved','rejected','more_info');
CREATE TYPE public.review_state AS ENUM ('pending','approved','rejected','hidden');
CREATE TYPE public.alert_state AS ENUM ('draft','submitted','analyzing','needs_review','needs_information','approved','transformed','published','rejected','archived');
CREATE TYPE public.content_kind AS ENUM ('alert','place','job','event','news','radio_program','radio_episode','podcast','podcast_episode','organization','review');

-- ORGANIZZAZIONI ---------------------------------------------------------
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  kind public.org_kind NOT NULL DEFAULT 'azienda',
  vat_number text,
  tax_code text,
  contact_name text,
  contact_email text,
  contact_phone text,
  comune text,
  province text,
  address text,
  website text,
  logo_url text,
  description text,
  status public.org_status NOT NULL DEFAULT 'draft',
  is_member boolean NOT NULL DEFAULT false,
  trust_score integer NOT NULL DEFAULT 0,
  terms_accepted_at timestamptz,
  verified_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.organizations TO authenticated;
GRANT SELECT ON public.organizations TO anon;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.organization_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email text,
  role public.org_member_role NOT NULL DEFAULT 'viewer',
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_users TO authenticated;
GRANT ALL ON public.organization_users TO service_role;
ALTER TABLE public.organization_users ENABLE ROW LEVEL SECURITY;

-- helper security definer: evita ricorsione nelle policy
CREATE OR REPLACE FUNCTION private.org_role(_org uuid)
RETURNS public.org_member_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE
    WHEN EXISTS (SELECT 1 FROM public.organizations o WHERE o.id = _org AND o.owner_id = auth.uid()) THEN 'owner'::public.org_member_role
    ELSE (SELECT ou.role FROM public.organization_users ou
          WHERE ou.organization_id = _org AND ou.user_id = auth.uid() AND ou.accepted_at IS NOT NULL
          LIMIT 1)
  END
$$;

CREATE OR REPLACE FUNCTION private.has_org_role(_org uuid, _roles public.org_member_role[])
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT private.org_role(_org) = ANY(_roles)
$$;

CREATE OR REPLACE FUNCTION private.is_org_member(_org uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT private.org_role(_org) IS NOT NULL
$$;

CREATE POLICY "organizations_public_read" ON public.organizations FOR SELECT TO anon, authenticated
  USING (status = 'approved' AND archived_at IS NULL);
CREATE POLICY "organizations_team_read" ON public.organizations FOR SELECT TO authenticated
  USING (private.is_org_member(id) OR private.is_admin());
CREATE POLICY "organizations_insert_own" ON public.organizations FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() AND status IN ('draft','email_verification','org_verification'));
CREATE POLICY "organizations_update_team" ON public.organizations FOR UPDATE TO authenticated
  USING (private.has_org_role(id, ARRAY['owner','org_admin']::public.org_member_role[]) OR private.is_admin())
  WITH CHECK (private.has_org_role(id, ARRAY['owner','org_admin']::public.org_member_role[]) OR private.is_admin());

CREATE POLICY "organization_users_read" ON public.organization_users FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR private.is_org_member(organization_id) OR private.is_admin());
CREATE POLICY "organization_users_manage" ON public.organization_users FOR ALL TO authenticated
  USING (private.has_org_role(organization_id, ARRAY['owner','org_admin']::public.org_member_role[]) OR private.is_admin())
  WITH CHECK (private.has_org_role(organization_id, ARRAY['owner','org_admin']::public.org_member_role[]) OR private.is_admin());
CREATE POLICY "organization_users_accept_invite" ON public.organization_users FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.organization_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  requested_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  document_path text,
  note text,
  outcome public.verification_outcome NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.organization_verifications TO authenticated;
GRANT ALL ON public.organization_verifications TO service_role;
ALTER TABLE public.organization_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_verifications_team_read" ON public.organization_verifications FOR SELECT TO authenticated
  USING (private.is_org_member(organization_id) OR private.is_admin());
CREATE POLICY "org_verifications_team_insert" ON public.organization_verifications FOR INSERT TO authenticated
  WITH CHECK (private.has_org_role(organization_id, ARRAY['owner','org_admin']::public.org_member_role[]));
CREATE POLICY "org_verifications_admin_all" ON public.organization_verifications FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE TABLE public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'base',
  status text NOT NULL DEFAULT 'active',
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.memberships TO authenticated;
GRANT ALL ON public.memberships TO service_role;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "memberships_team_read" ON public.memberships FOR SELECT TO authenticated
  USING (private.is_org_member(organization_id) OR private.is_admin());
CREATE POLICY "memberships_admin_all" ON public.memberships FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

-- TASSONOMIE -------------------------------------------------------------
CREATE TABLE public.terrain_categories (
  slug text PRIMARY KEY,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.terrain_categories TO anon, authenticated;
GRANT ALL ON public.terrain_categories TO service_role;
ALTER TABLE public.terrain_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "terrain_categories_read" ON public.terrain_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "terrain_categories_admin" ON public.terrain_categories FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE TABLE public.alert_categories (
  slug text PRIMARY KEY,
  label text NOT NULL,
  audience text NOT NULL DEFAULT 'all',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.alert_categories TO anon, authenticated;
GRANT ALL ON public.alert_categories TO service_role;
ALTER TABLE public.alert_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alert_categories_read" ON public.alert_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "alert_categories_admin" ON public.alert_categories FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

INSERT INTO public.terrain_categories (slug, label, sort_order) VALUES
  ('ristorazione','Ristorazione',10),
  ('ospitalita','Ospitalità',20),
  ('commercio','Commercio',30),
  ('servizi','Servizi',40),
  ('artigianato','Artigianato',50),
  ('agricoltura','Agricoltura',60),
  ('cultura','Cultura',70),
  ('sport','Sport e benessere',80),
  ('natura','Natura e itinerari',90),
  ('associazioni','Associazioni',100),
  ('istituzioni','Istituzioni',110)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.alert_categories (slug, label, audience, sort_order) VALUES
  ('notizia','Notizia','user',10),
  ('evento','Evento','all',20),
  ('nuova-attivita','Nuova attività','all',30),
  ('luogo','Luogo','all',40),
  ('storia','Storia','all',50),
  ('personaggio','Personaggio','user',60),
  ('problema','Problema','user',70),
  ('informazione-errata','Informazione errata','all',80),
  ('opportunita','Opportunità','all',90),
  ('aggiornamento-attivita','Aggiornamento attività','org',100),
  ('offerta-lavoro','Offerta di lavoro','all',110),
  ('comunicato','Comunicato','org',120),
  ('proposta-news','Proposta News','org',130),
  ('proposta-radio','Proposta Radio','org',140),
  ('proposta-podcast','Proposta Podcast','org',150),
  ('collaborazione','Collaborazione','org',160),
  ('assistenza','Richiesta assistenza','org',170),
  ('altro','Altro','all',999)
ON CONFLICT (slug) DO NOTHING;

-- RECENSIONI -------------------------------------------------------------
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid REFERENCES public.terrain_places(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL,
  body text,
  images text[] NOT NULL DEFAULT '{}',
  is_verified boolean NOT NULL DEFAULT false,
  status public.review_state NOT NULL DEFAULT 'pending',
  moderation_note text,
  edit_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX reviews_one_per_place ON public.reviews (user_id, place_id) WHERE place_id IS NOT NULL;
CREATE INDEX reviews_place_idx ON public.reviews (place_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "reviews_own_read" ON public.reviews FOR SELECT TO authenticated USING (user_id = auth.uid() OR private.is_admin());
CREATE POLICY "reviews_own_insert" ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND rating BETWEEN 1 AND 5 AND (place_id IS NOT NULL OR organization_id IS NOT NULL));
CREATE POLICY "reviews_own_update" ON public.reviews FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid() AND rating BETWEEN 1 AND 5);
CREATE POLICY "reviews_own_delete" ON public.reviews FOR DELETE TO authenticated USING (user_id = auth.uid() OR private.is_admin());
CREATE POLICY "reviews_admin_all" ON public.reviews FOR UPDATE TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE OR REPLACE FUNCTION public.validate_review()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN RAISE EXCEPTION 'valutazione non valida'; END IF;
  IF NEW.body IS NOT NULL AND length(NEW.body) > 2000 THEN RAISE EXCEPTION 'testo troppo lungo'; END IF;
  IF array_length(NEW.images, 1) > 5 THEN RAISE EXCEPTION 'troppe immagini'; END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER validate_review_trg BEFORE INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.validate_review();
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.review_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  reporter_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reason text NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.review_reports TO authenticated;
GRANT ALL ON public.review_reports TO service_role;
ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "review_reports_own" ON public.review_reports FOR SELECT TO authenticated
  USING (reporter_id = auth.uid() OR private.is_admin());
CREATE POLICY "review_reports_insert" ON public.review_reports FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "review_reports_admin" ON public.review_reports FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE TABLE public.organization_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL UNIQUE REFERENCES public.reviews(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_responses TO authenticated;
GRANT SELECT ON public.organization_responses TO anon;
GRANT ALL ON public.organization_responses TO service_role;
ALTER TABLE public.organization_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_responses_public_read" ON public.organization_responses FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "org_responses_manage" ON public.organization_responses FOR ALL TO authenticated
  USING (private.has_org_role(organization_id, ARRAY['owner','org_admin','editor']::public.org_member_role[]) OR private.is_admin())
  WITH CHECK (private.has_org_role(organization_id, ARRAY['owner','org_admin','editor']::public.org_member_role[]) OR private.is_admin());
CREATE TRIGGER organization_responses_updated_at BEFORE UPDATE ON public.organization_responses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ALERT EVOLUTO ----------------------------------------------------------
ALTER TABLE public.territory_alerts
  ADD COLUMN IF NOT EXISTS alert_type text,
  ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS state public.alert_state NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

CREATE TABLE public.alert_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL REFERENCES public.territory_alerts(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  mime_type text,
  size_bytes integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.alert_attachments TO authenticated;
GRANT ALL ON public.alert_attachments TO service_role;
ALTER TABLE public.alert_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alert_attachments_own" ON public.alert_attachments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.territory_alerts a WHERE a.id = alert_id AND a.reporter_id = auth.uid()) OR private.is_admin());
CREATE POLICY "alert_attachments_insert" ON public.alert_attachments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.territory_alerts a WHERE a.id = alert_id AND a.reporter_id = auth.uid()));
CREATE POLICY "alert_attachments_admin" ON public.alert_attachments FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE TABLE public.alert_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL REFERENCES public.territory_alerts(id) ON DELETE CASCADE,
  from_state public.alert_state,
  to_state public.alert_state NOT NULL,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX alert_status_history_alert_idx ON public.alert_status_history (alert_id, created_at DESC);
GRANT SELECT ON public.alert_status_history TO authenticated;
GRANT ALL ON public.alert_status_history TO service_role;
ALTER TABLE public.alert_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alert_history_own_read" ON public.alert_status_history FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.territory_alerts a WHERE a.id = alert_id AND a.reporter_id = auth.uid()) OR private.is_admin());
CREATE POLICY "alert_history_admin" ON public.alert_status_history FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE OR REPLACE FUNCTION public.track_alert_state()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.alert_status_history (alert_id, from_state, to_state, actor_id)
    VALUES (NEW.id, NULL, NEW.state, auth.uid());
  ELSIF NEW.state IS DISTINCT FROM OLD.state THEN
    INSERT INTO public.alert_status_history (alert_id, from_state, to_state, actor_id, note)
    VALUES (NEW.id, OLD.state, NEW.state, auth.uid(), NEW.moderation_note);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER track_alert_state_trg AFTER INSERT OR UPDATE ON public.territory_alerts
  FOR EACH ROW EXECUTE FUNCTION public.track_alert_state();

-- RELAZIONI TRA CONTENUTI ------------------------------------------------
CREATE TABLE public.content_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_kind public.content_kind NOT NULL,
  source_id text NOT NULL,
  target_kind public.content_kind NOT NULL,
  target_id text NOT NULL,
  relation text NOT NULL DEFAULT 'related',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_kind, source_id, target_kind, target_id, relation)
);
CREATE INDEX content_relations_source_idx ON public.content_relations (source_kind, source_id);
CREATE INDEX content_relations_target_idx ON public.content_relations (target_kind, target_id);
GRANT SELECT ON public.content_relations TO anon, authenticated;
GRANT ALL ON public.content_relations TO service_role;
ALTER TABLE public.content_relations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content_relations_read" ON public.content_relations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "content_relations_admin" ON public.content_relations FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

-- SEGUITI ----------------------------------------------------------------
CREATE TABLE public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_kind text NOT NULL,
  target_id text NOT NULL,
  label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_kind, target_id)
);
GRANT SELECT, INSERT, DELETE ON public.follows TO authenticated;
GRANT ALL ON public.follows TO service_role;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows_own" ON public.follows FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- MODERAZIONE, AUDIT, VERIFICHE, AUTOMAZIONI -----------------------------
CREATE TABLE public.moderation_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_kind public.content_kind NOT NULL,
  content_id text NOT NULL,
  reason text NOT NULL,
  detail text,
  severity text NOT NULL DEFAULT 'info',
  status text NOT NULL DEFAULT 'open',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.moderation_flags TO authenticated;
GRANT ALL ON public.moderation_flags TO service_role;
ALTER TABLE public.moderation_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "moderation_flags_admin" ON public.moderation_flags FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_kind text,
  entity_id text,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_logs_created_idx ON public.audit_logs (created_at DESC);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_logs_admin_read" ON public.audit_logs FOR SELECT TO authenticated USING (private.is_admin());
CREATE POLICY "audit_logs_admin_write" ON public.audit_logs FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE TABLE public.verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_kind text NOT NULL,
  subject_id text NOT NULL,
  requested_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  note text,
  outcome public.verification_outcome NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.verification_requests TO authenticated;
GRANT ALL ON public.verification_requests TO service_role;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "verification_requests_own" ON public.verification_requests FOR SELECT TO authenticated
  USING (requested_by = auth.uid() OR private.is_admin());
CREATE POLICY "verification_requests_insert" ON public.verification_requests FOR INSERT TO authenticated
  WITH CHECK (requested_by = auth.uid());
CREATE POLICY "verification_requests_admin" ON public.verification_requests FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE TABLE public.automation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  processed integer NOT NULL DEFAULT 0,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  lease_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.automation_runs TO authenticated;
GRANT ALL ON public.automation_runs TO service_role;
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "automation_runs_admin" ON public.automation_runs FOR ALL TO authenticated
  USING (private.is_admin()) WITH CHECK (private.is_admin());

-- COLLEGAMENTO ORGANIZZAZIONE AI CONTENUTI OPERATIVI ---------------------
ALTER TABLE public.terrain_places ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL;
ALTER TABLE public.terrain_places ADD COLUMN IF NOT EXISTS last_confirmed_at timestamptz;
ALTER TABLE public.terrain_places ADD COLUMN IF NOT EXISTS archived_at timestamptz;
ALTER TABLE public.job_posts ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL;
ALTER TABLE public.job_posts ADD COLUMN IF NOT EXISTS archived_at timestamptz;
ALTER TABLE public.member_events ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL;
ALTER TABLE public.member_events ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published';
ALTER TABLE public.member_events ADD COLUMN IF NOT EXISTS archived_at timestamptz;

CREATE INDEX IF NOT EXISTS terrain_places_org_idx ON public.terrain_places (organization_id);
CREATE INDEX IF NOT EXISTS job_posts_org_idx ON public.job_posts (organization_id);

CREATE POLICY "terrain_places_org_manage" ON public.terrain_places FOR ALL TO authenticated
  USING (organization_id IS NOT NULL AND private.has_org_role(organization_id, ARRAY['owner','org_admin','editor']::public.org_member_role[]))
  WITH CHECK (organization_id IS NOT NULL AND private.has_org_role(organization_id, ARRAY['owner','org_admin','editor']::public.org_member_role[]));
CREATE POLICY "job_posts_org_manage" ON public.job_posts FOR ALL TO authenticated
  USING (organization_id IS NOT NULL AND private.has_org_role(organization_id, ARRAY['owner','org_admin','recruiter']::public.org_member_role[]))
  WITH CHECK (organization_id IS NOT NULL AND private.has_org_role(organization_id, ARRAY['owner','org_admin','recruiter']::public.org_member_role[]));
CREATE POLICY "member_events_org_manage" ON public.member_events FOR ALL TO authenticated
  USING (organization_id IS NOT NULL AND private.has_org_role(organization_id, ARRAY['owner','org_admin','events']::public.org_member_role[]))
  WITH CHECK (organization_id IS NOT NULL AND private.has_org_role(organization_id, ARRAY['owner','org_admin','events']::public.org_member_role[]));

CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER organization_users_updated_at BEFORE UPDATE ON public.organization_users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER organization_verifications_updated_at BEFORE UPDATE ON public.organization_verifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER memberships_updated_at BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();