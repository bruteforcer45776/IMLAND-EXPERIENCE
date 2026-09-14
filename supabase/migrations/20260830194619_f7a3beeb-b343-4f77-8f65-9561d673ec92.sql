-- Bozze: l'autore può creare una segnalazione in bozza o inviata
DROP POLICY IF EXISTS territory_alerts_owner_insert ON public.territory_alerts;
CREATE POLICY territory_alerts_owner_insert
ON public.territory_alerts FOR INSERT TO authenticated
WITH CHECK (
  reporter_id = auth.uid()
  AND status IN ('draft', 'received')
  AND state IN ('draft', 'submitted')
);

-- L'autore può modificare la propria segnalazione solo finché è bozza
-- o quando la redazione ha chiesto informazioni aggiuntive.
DROP POLICY IF EXISTS territory_alerts_owner_update ON public.territory_alerts;
CREATE POLICY territory_alerts_owner_update
ON public.territory_alerts FOR UPDATE TO authenticated
USING (reporter_id = auth.uid() AND state IN ('draft', 'needs_information'))
WITH CHECK (
  reporter_id = auth.uid()
  AND state IN ('draft', 'submitted')
  AND status IN ('draft', 'received')
);

-- L'autore può eliminare solo le proprie bozze
DROP POLICY IF EXISTS territory_alerts_owner_delete ON public.territory_alerts;
CREATE POLICY territory_alerts_owner_delete
ON public.territory_alerts FOR DELETE TO authenticated
USING (reporter_id = auth.uid() AND state = 'draft');

CREATE INDEX IF NOT EXISTS territory_alerts_state_idx ON public.territory_alerts (state, created_at DESC);
CREATE INDEX IF NOT EXISTS territory_alerts_reporter_idx ON public.territory_alerts (reporter_id, created_at DESC);

-- Allegati: l'autore può cancellare i propri allegati finché la segnalazione è modificabile
DROP POLICY IF EXISTS alert_attachments_owner_delete ON public.alert_attachments;
CREATE POLICY alert_attachments_owner_delete
ON public.alert_attachments FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.territory_alerts a
    WHERE a.id = alert_attachments.alert_id
      AND a.reporter_id = auth.uid()
      AND a.state IN ('draft', 'needs_information')
  )
);

-- File allegati nel bucket privato: cartella per utente
DROP POLICY IF EXISTS "alert attachments owner read" ON storage.objects;
CREATE POLICY "alert attachments owner read"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'alert-attachments'
  AND (auth.uid()::text = (storage.foldername(name))[1] OR private.is_admin())
);

DROP POLICY IF EXISTS "alert attachments owner insert" ON storage.objects;
CREATE POLICY "alert attachments owner insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'alert-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "alert attachments owner delete" ON storage.objects;
CREATE POLICY "alert attachments owner delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'alert-attachments'
  AND (auth.uid()::text = (storage.foldername(name))[1] OR private.is_admin())
);
