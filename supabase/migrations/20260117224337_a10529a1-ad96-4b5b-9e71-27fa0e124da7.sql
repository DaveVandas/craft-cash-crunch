-- Add source_variant column to track which landing page converted the user
ALTER TABLE public.user_access 
ADD COLUMN source_variant TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.user_access.source_variant IS 'Tracks which landing page variant the user came from (e.g., landing-a, landing-b, ref, home)';

-- Create an index for efficient querying by affiliate and variant
CREATE INDEX idx_user_access_referred_variant ON public.user_access (referred_by_code, source_variant) 
WHERE referred_by_code IS NOT NULL;