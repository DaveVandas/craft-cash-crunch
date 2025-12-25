-- Create beta_invites table to track invite codes
CREATE TABLE public.beta_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code text UNIQUE NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_email text,
  recipient_name text,
  expires_at timestamp with time zone NOT NULL,
  claimed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at timestamp with time zone,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'expired')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create beta_feedback table for structured feedback
CREATE TABLE public.beta_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  beta_invite_id uuid REFERENCES public.beta_invites(id) ON DELETE SET NULL,
  overall_rating integer NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  experience_rating integer NOT NULL CHECK (experience_rating >= 1 AND experience_rating <= 5),
  what_liked text,
  what_to_improve text,
  additional_comments text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create beta_sessions table to track time spent
CREATE TABLE public.beta_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  beta_invite_id uuid REFERENCES public.beta_invites(id) ON DELETE SET NULL,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  ended_at timestamp with time zone,
  duration_seconds integer
);

-- Enable RLS on all tables
ALTER TABLE public.beta_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_sessions ENABLE ROW LEVEL SECURITY;

-- Beta invites policies
CREATE POLICY "Admins can view all beta invites"
ON public.beta_invites FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create beta invites"
ON public.beta_invites FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update beta invites"
ON public.beta_invites FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their claimed invite"
ON public.beta_invites FOR SELECT
USING (auth.uid() = claimed_by);

CREATE POLICY "Service role can manage invites"
ON public.beta_invites FOR ALL
USING (auth.role() = 'service_role');

-- Beta feedback policies
CREATE POLICY "Admins can view all feedback"
ON public.beta_feedback FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can submit their own feedback"
ON public.beta_feedback FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
ON public.beta_feedback FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage feedback"
ON public.beta_feedback FOR ALL
USING (auth.role() = 'service_role');

-- Beta sessions policies
CREATE POLICY "Admins can view all sessions"
ON public.beta_sessions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can manage their own sessions"
ON public.beta_sessions FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage sessions"
ON public.beta_sessions FOR ALL
USING (auth.role() = 'service_role');

-- Add beta_invite_id to user_access to link beta users
ALTER TABLE public.user_access ADD COLUMN beta_invite_id uuid REFERENCES public.beta_invites(id) ON DELETE SET NULL;
ALTER TABLE public.user_access ADD COLUMN beta_expires_at timestamp with time zone;