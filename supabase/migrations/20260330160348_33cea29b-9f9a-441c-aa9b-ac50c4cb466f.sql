
-- Harden track_share RPC with platform/feature allowlists
CREATE OR REPLACE FUNCTION public.track_share(
  p_feature text,
  p_platform text,
  p_share_type text DEFAULT 'link'::text,
  p_context jsonb DEFAULT '{}'::jsonb,
  p_device_type text DEFAULT NULL::text,
  p_referrer text DEFAULT NULL::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_session_id TEXT;
  valid_platforms TEXT[] := ARRAY['twitter','facebook','whatsapp','linkedin','instagram','tiktok','native','copy','save-image'];
  valid_features TEXT[] := ARRAY['compare','calculator','quiz','mogul-markets','profile','invite','affiliate','trades','celebrity-portfolios','wealth-wisdom','landing','side-hustle','mogul-academy'];
  valid_share_types TEXT[] := ARRAY['link','image','text'];
BEGIN
  -- Validate platform
  IF NOT (p_platform = ANY(valid_platforms)) THEN
    RAISE EXCEPTION 'Invalid platform: %', p_platform;
  END IF;

  -- Validate feature
  IF NOT (p_feature = ANY(valid_features)) THEN
    RAISE EXCEPTION 'Invalid feature: %', p_feature;
  END IF;

  -- Validate share_type
  IF NOT (p_share_type = ANY(valid_share_types)) THEN
    RAISE EXCEPTION 'Invalid share_type: %', p_share_type;
  END IF;

  -- Validate device_type if provided
  IF p_device_type IS NOT NULL AND NOT (p_device_type = ANY(ARRAY['mobile','tablet','desktop'])) THEN
    p_device_type := NULL;
  END IF;

  -- Truncate referrer to prevent abuse
  IF p_referrer IS NOT NULL AND length(p_referrer) > 500 THEN
    p_referrer := left(p_referrer, 500);
  END IF;

  -- Get session ID from request context
  BEGIN
    v_session_id := get_request_session_id();
  EXCEPTION WHEN OTHERS THEN
    v_session_id := NULL;
  END;

  INSERT INTO share_analytics (feature, platform, share_type, context, user_id, session_id, device_type, referrer)
  VALUES (
    p_feature,
    p_platform,
    p_share_type,
    p_context,
    auth.uid(),
    v_session_id,
    p_device_type,
    p_referrer
  );
END;
$$;

-- Harden track_story_share RPC with platform allowlist and input length limits
CREATE OR REPLACE FUNCTION public.track_story_share(
  p_story_id text,
  p_story_title text,
  p_platform text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  valid_platforms TEXT[] := ARRAY['twitter','facebook','whatsapp','linkedin','instagram','tiktok','native','copy','save-image'];
BEGIN
  -- Validate platform
  IF NOT (p_platform = ANY(valid_platforms)) THEN
    RAISE EXCEPTION 'Invalid platform: %', p_platform;
  END IF;

  -- Validate story_id length
  IF p_story_id IS NULL OR length(p_story_id) > 255 THEN
    RAISE EXCEPTION 'Invalid story_id';
  END IF;

  -- Truncate story_title
  IF p_story_title IS NOT NULL AND length(p_story_title) > 500 THEN
    p_story_title := left(p_story_title, 500);
  END IF;

  INSERT INTO public.story_share_analytics (story_id, story_title, platform)
  VALUES (p_story_id, p_story_title, p_platform);
END;
$$;
