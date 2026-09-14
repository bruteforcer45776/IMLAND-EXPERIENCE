-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('user', 'member', 'admin');

-- ============ UTIL ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE SEQUENCE public.member_id_seq START 1001;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  avatar_url text,
  email text,
  city text,
  province text,
  interests text[] NOT NULL DEFAULT '{}',
  member_id text NOT NULL UNIQUE,
  membership_status text NOT NULL DEFAULT 'active',
  member_since timestamptz NOT NULL DEFAULT now(),
  qr_token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  referral_code text NOT NULL UNIQUE,
  referred_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  notify_in_app boolean NOT NULL DEFAULT true,
  notify_email boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ROLES ============
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$$;

CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "roles_admin_write" ON public.user_roles FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin()) WITH CHECK (id = auth.uid() OR public.is_admin());

-- ============ SIGNUP TRIGGER ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  seq bigint := nextval('public.member_id_seq');
  ref_code text := NEW.raw_user_meta_data->>'referral_code';
  referrer uuid;
BEGIN
  IF ref_code IS NOT NULL AND length(ref_code) > 0 THEN
    SELECT id INTO referrer FROM public.profiles WHERE referral_code = upper(ref_code);
  END IF;

  INSERT INTO public.profiles (id, email, first_name, last_name, member_id, referral_code, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    'IM-' || to_char(seq, 'FM000000'),
    'IM' || upper(substr(replace(NEW.id::text, '-', ''), 1, 6)),
    referrer
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member')
  ON CONFLICT DO NOTHING;

  IF referrer IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_id, invited_email, status, registered_user_id, registered_at)
    VALUES (referrer, NEW.email, 'registered', NEW.id, now());
  END IF;

  RETURN NEW;
END; $$;

-- ============ REFERRALS ============
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invited_email text,
  status text NOT NULL DEFAULT 'invited',
  registered_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  registered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "referrals_select" ON public.referrals FOR SELECT TO authenticated
  USING (referrer_id = auth.uid() OR public.is_admin());
CREATE POLICY "referrals_insert_own" ON public.referrals FOR INSERT TO authenticated
  WITH CHECK (referrer_id = auth.uid());
CREATE POLICY "referrals_admin_all" ON public.referrals FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ ANTICIPAZIONI ============
CREATE TABLE public.previews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content_type text NOT NULL DEFAULT 'news',
  excerpt text,
  body text,
  cover_url text,
  media_url text,
  is_published boolean NOT NULL DEFAULT false,
  member_publish_at timestamptz NOT NULL DEFAULT now(),
  public_publish_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.previews TO authenticated;
GRANT ALL ON public.previews TO service_role;
ALTER TABLE public.previews ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER previews_updated_at BEFORE UPDATE ON public.previews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "previews_member_read" ON public.previews FOR SELECT TO authenticated
  USING ((is_published AND member_publish_at <= now()) OR public.is_admin());
CREATE POLICY "previews_admin_all" ON public.previews FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ VANTAGGI ============
CREATE TABLE public.benefits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  logo_url text,
  description text,
  benefit_type text NOT NULL DEFAULT 'sconto',
  discount_percent integer,
  city text,
  province text,
  address text,
  conditions text,
  expires_at timestamptz,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.benefits TO authenticated;
GRANT ALL ON public.benefits TO service_role;
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER benefits_updated_at BEFORE UPDATE ON public.benefits FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "benefits_member_read" ON public.benefits FOR SELECT TO authenticated
  USING (is_published OR public.is_admin());
CREATE POLICY "benefits_admin_all" ON public.benefits FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.benefit_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  benefit_id uuid NOT NULL REFERENCES public.benefits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE DEFAULT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  status text NOT NULL DEFAULT 'attivo',
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.benefit_redemptions TO authenticated;
GRANT ALL ON public.benefit_redemptions TO service_role;
ALTER TABLE public.benefit_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "redemptions_select" ON public.benefit_redemptions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "redemptions_insert_own" ON public.benefit_redemptions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "redemptions_admin_all" ON public.benefit_redemptions FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ EVENTI MEMBER ============
CREATE TABLE public.member_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cover_url text,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  venue text,
  city text,
  province text,
  member_only boolean NOT NULL DEFAULT false,
  member_price numeric(10,2),
  public_price numeric(10,2),
  capacity integer,
  member_seats integer,
  member_booking_opens_at timestamptz,
  public_booking_opens_at timestamptz,
  perks text[] NOT NULL DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.member_events TO authenticated;
GRANT ALL ON public.member_events TO service_role;
ALTER TABLE public.member_events ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER member_events_updated_at BEFORE UPDATE ON public.member_events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "member_events_read" ON public.member_events FOR SELECT TO authenticated
  USING (is_published OR public.is_admin());
CREATE POLICY "member_events_admin_all" ON public.member_events FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.event_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.member_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seats integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'confermata',
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_bookings TO authenticated;
GRANT ALL ON public.event_bookings TO service_role;
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings_select" ON public.event_bookings FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "bookings_write_own" ON public.event_bookings FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "bookings_update_own" ON public.event_bookings FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin()) WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "bookings_delete_own" ON public.event_bookings FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- ============ CONTENUTI ESCLUSIVI ============
CREATE TABLE public.exclusive_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content_type text NOT NULL DEFAULT 'podcast',
  description text,
  body text,
  cover_url text,
  media_url text,
  download_url text,
  is_published boolean NOT NULL DEFAULT true,
  publish_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.exclusive_contents TO authenticated;
GRANT ALL ON public.exclusive_contents TO service_role;
ALTER TABLE public.exclusive_contents ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER exclusive_contents_updated_at BEFORE UPDATE ON public.exclusive_contents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "exclusive_read" ON public.exclusive_contents FOR SELECT TO authenticated
  USING ((is_published AND publish_at <= now()) OR public.is_admin());
CREATE POLICY "exclusive_admin_all" ON public.exclusive_contents FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ SCOPRI ============
CREATE TABLE public.discoveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Eventi',
  description text,
  image_url text,
  link_url text,
  city text,
  province text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.discoveries TO authenticated;
GRANT ALL ON public.discoveries TO service_role;
ALTER TABLE public.discoveries ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER discoveries_updated_at BEFORE UPDATE ON public.discoveries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "discoveries_read" ON public.discoveries FOR SELECT TO authenticated
  USING (is_published OR public.is_admin());
CREATE POLICY "discoveries_admin_all" ON public.discoveries FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ NOTIFICHE ============
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  notif_type text NOT NULL DEFAULT 'comunicazione',
  link_url text,
  target_province text,
  target_interest text,
  target_role public.app_role,
  is_important boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_read" ON public.notifications FOR SELECT TO authenticated
  USING (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND (notifications.target_province IS NULL OR notifications.target_province = p.province)
        AND (notifications.target_interest IS NULL OR notifications.target_interest = ANY (p.interests))
        AND (notifications.target_role IS NULL OR public.has_role(auth.uid(), notifications.target_role))
    )
  );
CREATE POLICY "notifications_admin_all" ON public.notifications FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.notification_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  read_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (notification_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.notification_reads TO authenticated;
GRANT ALL ON public.notification_reads TO service_role;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_reads_own" ON public.notification_reads FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============ PREFERITI ============
CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id text NOT NULL,
  label text,
  link_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_type, item_id)
);
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_own" ON public.favorites FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============ VERIFICA MEMBER CARD ============
CREATE OR REPLACE FUNCTION public.verify_member_card(_token uuid)
RETURNS TABLE (full_name text, member_id text, membership_status text, member_since timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT trim(coalesce(p.first_name, '') || ' ' || coalesce(p.last_name, '')),
         p.member_id, p.membership_status, p.member_since
  FROM public.profiles p
  WHERE p.qr_token = _token;
$$;
GRANT EXECUTE ON FUNCTION public.verify_member_card(uuid) TO anon, authenticated;