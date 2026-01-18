-- Create trigger to notify affiliate when commission rate changes
CREATE OR REPLACE FUNCTION public.notify_affiliate_on_commission_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only trigger if commission_rate changed and user_id exists
  IF NEW.commission_rate != OLD.commission_rate AND NEW.user_id IS NOT NULL THEN
    INSERT INTO public.user_notifications (user_id, type, title, message, action_url, metadata)
    VALUES (
      NEW.user_id,
      'commission_updated',
      '💎 Commission Rate Updated!',
      'Great news! Your commission rate has been updated to $' || NEW.commission_rate || ' per signup by the app owner.',
      '/affiliate-dashboard',
      jsonb_build_object('old_rate', OLD.commission_rate, 'new_rate', NEW.commission_rate)
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- Create trigger
DROP TRIGGER IF EXISTS on_affiliate_commission_change ON public.affiliates;
CREATE TRIGGER on_affiliate_commission_change
  AFTER UPDATE ON public.affiliates
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_affiliate_on_commission_change();