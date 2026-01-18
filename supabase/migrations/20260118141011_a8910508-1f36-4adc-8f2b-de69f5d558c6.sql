-- Fix 1: Create a public view for affiliates that excludes sensitive fields (email, payout_details)
-- Users should only see their own affiliate data without the email/payment info exposed via direct queries

CREATE OR REPLACE VIEW public.affiliates_public
WITH (security_invoker=on) AS
  SELECT 
    id,
    user_id,
    affiliate_code,
    display_name,
    commission_rate,
    is_vip,
    total_referrals,
    total_earnings,
    pending_payout,
    payout_method,
    status,
    created_at,
    approved_at,
    approved_by,
    updated_at
  FROM public.affiliates;
  -- Excludes: email, payout_details (sensitive data)

-- Fix 2: Create a public view for beta_invites that excludes recipient_email
-- Users who claimed an invite should not see the recipient's email address

CREATE OR REPLACE VIEW public.beta_invites_public
WITH (security_invoker=on) AS
  SELECT 
    id,
    created_by,
    expires_at,
    claimed_by,
    claimed_at,
    created_at,
    invite_code,
    recipient_name,  -- Keep name but exclude email
    status
  FROM public.beta_invites;
  -- Excludes: recipient_email (sensitive data)

-- Note: The base tables retain their RLS policies for admin/service role access
-- Application code should query the _public views for regular users
-- Admins can still access the full tables via their existing policies