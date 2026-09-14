CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role); $$;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'); $$;

CREATE OR REPLACE FUNCTION private.verify_member_card(_token uuid)
RETURNS TABLE(full_name text, member_id text, membership_status text, member_since timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT trim(coalesce(p.first_name,'') || ' ' || coalesce(p.last_name,'')), p.member_id, p.membership_status, p.member_since FROM public.profiles p WHERE p.qr_token = _token; $$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.verify_member_card(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.verify_member_card(uuid) TO service_role;

ALTER POLICY roles_select_own ON public.user_roles USING ((user_id = auth.uid()) OR private.is_admin());
ALTER POLICY roles_admin_write ON public.user_roles USING (private.is_admin()) WITH CHECK (private.is_admin());
ALTER POLICY profiles_select ON public.profiles USING ((id = auth.uid()) OR private.is_admin());
ALTER POLICY profiles_update ON public.profiles USING ((id = auth.uid()) OR private.is_admin()) WITH CHECK ((id = auth.uid()) OR private.is_admin());
ALTER POLICY referrals_select ON public.referrals USING ((referrer_id = auth.uid()) OR private.is_admin());
ALTER POLICY referrals_admin_all ON public.referrals USING (private.is_admin()) WITH CHECK (private.is_admin());
ALTER POLICY previews_member_read ON public.previews USING ((is_published AND (member_publish_at <= now())) OR private.is_admin());
ALTER POLICY previews_admin_all ON public.previews USING (private.is_admin()) WITH CHECK (private.is_admin());
ALTER POLICY benefits_member_read ON public.benefits USING (is_published OR private.is_admin());
ALTER POLICY benefits_admin_all ON public.benefits USING (private.is_admin()) WITH CHECK (private.is_admin());
ALTER POLICY redemptions_select ON public.benefit_redemptions USING ((user_id = auth.uid()) OR private.is_admin());
ALTER POLICY redemptions_admin_all ON public.benefit_redemptions USING (private.is_admin()) WITH CHECK (private.is_admin());
ALTER POLICY member_events_read ON public.member_events USING (is_published OR private.is_admin());
ALTER POLICY member_events_admin_all ON public.member_events USING (private.is_admin()) WITH CHECK (private.is_admin());
ALTER POLICY bookings_select ON public.event_bookings USING ((user_id = auth.uid()) OR private.is_admin());
ALTER POLICY bookings_update_own ON public.event_bookings USING ((user_id = auth.uid()) OR private.is_admin()) WITH CHECK ((user_id = auth.uid()) OR private.is_admin());
ALTER POLICY bookings_delete_own ON public.event_bookings USING ((user_id = auth.uid()) OR private.is_admin());
ALTER POLICY exclusive_read ON public.exclusive_contents USING ((is_published AND (publish_at <= now())) OR private.is_admin());
ALTER POLICY exclusive_admin_all ON public.exclusive_contents USING (private.is_admin()) WITH CHECK (private.is_admin());
ALTER POLICY discoveries_read ON public.discoveries USING (is_published OR private.is_admin());
ALTER POLICY discoveries_admin_all ON public.discoveries USING (private.is_admin()) WITH CHECK (private.is_admin());
ALTER POLICY notifications_read ON public.notifications USING (private.is_admin() OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND (notifications.target_province IS NULL OR notifications.target_province = p.province) AND (notifications.target_interest IS NULL OR notifications.target_interest = ANY (p.interests)) AND (notifications.target_role IS NULL OR private.has_role(auth.uid(), notifications.target_role))));
ALTER POLICY notifications_admin_all ON public.notifications USING (private.is_admin()) WITH CHECK (private.is_admin());

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.verify_member_card(uuid);