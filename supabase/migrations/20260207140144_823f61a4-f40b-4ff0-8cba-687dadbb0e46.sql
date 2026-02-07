-- Create a function to send welcome notification on user signup
CREATE OR REPLACE FUNCTION public.send_welcome_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Insert a welcome notification for the new user
  INSERT INTO public.user_notifications (user_id, type, title, message, action_url, metadata)
  VALUES (
    NEW.user_id,
    'welcome',
    '👋 Welcome to Wealth Perspective!',
    'Explore mind-blowing celebrity earnings, compare your salary to moguls, and discover how the ultra-wealthy really live. Start with a free search!',
    '/',
    jsonb_build_object(
      'tips', ARRAY[
        'Try searching for your favorite celebrity',
        'Use Reality Check to compare your earnings',
        'Check out Mogul Markets to paper trade like the pros'
      ]
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to fire on user_access insert
CREATE TRIGGER on_user_signup_welcome_notification
  AFTER INSERT ON public.user_access
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_notification();