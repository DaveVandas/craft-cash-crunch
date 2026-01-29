-- Create a function to notify affiliates when they cross the $500 threshold
CREATE OR REPLACE FUNCTION public.notify_affiliate_w9_threshold()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Only trigger if total_earnings crossed from below 500 to 500 or above
  -- and the affiliate has a user_id (to send notification)
  IF NEW.total_earnings >= 500 
     AND (OLD.total_earnings IS NULL OR OLD.total_earnings < 500)
     AND NEW.user_id IS NOT NULL THEN
    
    INSERT INTO public.user_notifications (user_id, type, title, message, action_url, metadata)
    VALUES (
      NEW.user_id,
      'w9_required',
      '📋 Tax Document Required - W-9 Form',
      'Great news! You''re approaching the $600 IRS reporting threshold. Please download, complete, and submit a W-9 form so we can process your 1099-NEC at year end. Submit your completed W-9 to: hello@wealthperspective.app',
      '/affiliate-dashboard',
      jsonb_build_object(
        'threshold_amount', 500,
        'current_earnings', NEW.total_earnings,
        'irs_form_url', 'https://www.irs.gov/pub/irs-pdf/fw9.pdf',
        'submit_email', 'hello@wealthperspective.app'
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger on affiliates table for W-9 notification
DROP TRIGGER IF EXISTS trigger_w9_threshold_notification ON public.affiliates;
CREATE TRIGGER trigger_w9_threshold_notification
  AFTER UPDATE OF total_earnings ON public.affiliates
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_affiliate_w9_threshold();