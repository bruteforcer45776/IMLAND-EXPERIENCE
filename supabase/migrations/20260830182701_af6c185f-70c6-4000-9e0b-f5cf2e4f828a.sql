DROP POLICY IF EXISTS "news_settings_public_read" ON public.news_settings;
CREATE POLICY "news_settings_admin_read" ON public.news_settings FOR SELECT TO authenticated USING (private.is_admin());