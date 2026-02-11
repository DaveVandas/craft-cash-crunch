-- Create a public storage bucket for OG share images
INSERT INTO storage.buckets (id, name, public)
VALUES ('og-images', 'og-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to OG images (crawlers need this)
CREATE POLICY "OG images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'og-images');

-- Allow service role (edge functions) to upload/update OG images
CREATE POLICY "Service role can manage OG images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'og-images');

CREATE POLICY "Service role can update OG images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'og-images');

CREATE POLICY "Service role can delete OG images"
ON storage.objects FOR DELETE
USING (bucket_id = 'og-images');