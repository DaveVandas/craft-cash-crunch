-- Add tax compliance fields to affiliates table for 1099 reporting
ALTER TABLE public.affiliates 
  ADD COLUMN IF NOT EXISTS legal_name TEXT,
  ADD COLUMN IF NOT EXISTS street_address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state_province TEXT,
  ADD COLUMN IF NOT EXISTS postal_code TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US',
  ADD COLUMN IF NOT EXISTS tax_id_collected BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS w9_submitted_at TIMESTAMP WITH TIME ZONE;

-- Add comment explaining these fields
COMMENT ON COLUMN public.affiliates.legal_name IS 'Legal name as it appears on tax documents (for 1099 reporting)';
COMMENT ON COLUMN public.affiliates.street_address IS 'Mailing address for 1099 forms';
COMMENT ON COLUMN public.affiliates.tax_id_collected IS 'Whether SSN/EIN has been collected via secure form (stored externally)';
COMMENT ON COLUMN public.affiliates.w9_submitted_at IS 'Timestamp when W-9 form was submitted';