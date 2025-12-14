-- Create storage bucket for celebrity images
INSERT INTO storage.buckets (id, name, public) VALUES ('celebrity-images', 'celebrity-images', true);

-- Allow public read access to celebrity images
CREATE POLICY "Celebrity images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'celebrity-images');

-- Allow service role to upload images
CREATE POLICY "Service role can upload celebrity images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'celebrity-images');

-- Allow service role to update images
CREATE POLICY "Service role can update celebrity images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'celebrity-images');

-- Create a table to cache celebrity image URLs
CREATE TABLE public.celebrity_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  celebrity_slug TEXT NOT NULL UNIQUE,
  celebrity_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.celebrity_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to cached image URLs
CREATE POLICY "Celebrity images cache is publicly readable" 
ON public.celebrity_images 
FOR SELECT 
USING (true);