-- Create a user notifications table for affiliate approvals and other alerts
CREATE TABLE public.user_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL, -- 'affiliate_approved', 'referral_converted', 'payout_sent', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT, -- optional link to navigate to
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own notifications" 
ON public.user_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.user_notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Admins can create notifications for any user
CREATE POLICY "Admins can create notifications" 
ON public.user_notifications 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create index for efficient lookups
CREATE INDEX idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX idx_user_notifications_read ON public.user_notifications(user_id, read);

-- Create a function to auto-notify affiliates when approved
CREATE OR REPLACE FUNCTION public.notify_affiliate_on_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if status changed to 'approved' and user_id exists
  IF NEW.status = 'approved' AND OLD.status != 'approved' AND NEW.user_id IS NOT NULL THEN
    INSERT INTO public.user_notifications (user_id, type, title, message, action_url)
    VALUES (
      NEW.user_id,
      'affiliate_approved',
      '🎉 Congratulations, Mogul!',
      'Your affiliate application has been approved! You can now start sharing your link and earning commissions.',
      '/affiliate-dashboard'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on affiliates table
CREATE TRIGGER on_affiliate_approved
AFTER UPDATE ON public.affiliates
FOR EACH ROW
EXECUTE FUNCTION public.notify_affiliate_on_approval();