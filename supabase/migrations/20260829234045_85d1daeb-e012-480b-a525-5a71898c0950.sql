CREATE TABLE public.account_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_type text NOT NULL CHECK (request_type IN ('export','delete')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','rejected')),
  note text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.account_requests TO authenticated;
GRANT ALL ON public.account_requests TO service_role;

ALTER TABLE public.account_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "account_requests_select" ON public.account_requests
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR private.is_admin());

CREATE POLICY "account_requests_insert_own" ON public.account_requests
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "account_requests_admin_all" ON public.account_requests
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE TRIGGER account_requests_updated_at
  BEFORE UPDATE ON public.account_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();