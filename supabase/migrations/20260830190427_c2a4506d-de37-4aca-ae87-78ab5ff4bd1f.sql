CREATE POLICY "cv_own_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cv-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "cv_own_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'cv-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "cv_own_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'cv-uploads' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'cv-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "cv_own_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cv-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "cv_company_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'cv-uploads' AND EXISTS (
      SELECT 1 FROM public.job_applications a
      JOIN public.job_posts p ON p.id = a.job_id
      WHERE a.cv_path = storage.objects.name AND p.company_id = auth.uid()
    )
  );

CREATE POLICY "cv_admin_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'cv-uploads' AND private.is_admin());