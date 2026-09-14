CREATE TABLE public.site_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  rating integer NOT NULL,
  note text,
  page_path text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX site_feedback_created_at_idx ON public.site_feedback (created_at DESC);

CREATE OR REPLACE FUNCTION public.validate_site_feedback()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'rating must be between 1 and 5';
  END IF;
  IF NEW.note IS NOT NULL AND length(NEW.note) > 1000 THEN
    RAISE EXCEPTION 'note too long';
  END IF;
  IF NEW.page_path IS NOT NULL AND length(NEW.page_path) > 300 THEN
    RAISE EXCEPTION 'page_path too long';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_site_feedback_trg
BEFORE INSERT OR UPDATE ON public.site_feedback
FOR EACH ROW EXECUTE FUNCTION public.validate_site_feedback();

GRANT INSERT ON public.site_feedback TO anon;
GRANT INSERT, SELECT ON public.site_feedback TO authenticated;
GRANT ALL ON public.site_feedback TO service_role;

ALTER TABLE public.site_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_feedback_anon_insert" ON public.site_feedback
FOR INSERT TO anon WITH CHECK (user_id IS NULL);

CREATE POLICY "site_feedback_auth_insert" ON public.site_feedback
FOR INSERT TO authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "site_feedback_admin_read" ON public.site_feedback
FOR SELECT TO authenticated USING (private.is_admin());

CREATE POLICY "site_feedback_admin_delete" ON public.site_feedback
FOR DELETE TO authenticated USING (private.is_admin());