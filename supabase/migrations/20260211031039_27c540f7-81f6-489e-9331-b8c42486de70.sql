-- Drop overly permissive storage policies for og-images
DROP POLICY IF EXISTS "Service role can manage OG images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update OG images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete OG images" ON storage.objects;

-- Recreate with service_role restriction
CREATE POLICY "Service role can insert OG images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'og-images' AND auth.role() = 'service_role');

CREATE POLICY "Service role can update OG images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'og-images' AND auth.role() = 'service_role');

CREATE POLICY "Service role can delete OG images"
ON storage.objects FOR DELETE
USING (bucket_id = 'og-images' AND auth.role() = 'service_role');