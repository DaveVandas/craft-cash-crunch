import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Loader2, MessageSquare, Heart, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BetaFeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-1 transition-transform hover:scale-110 focus:outline-none"
        >
          <Star 
            className={`h-6 w-6 transition-colors ${
              star <= value 
                ? 'fill-primary text-primary' 
                : 'text-muted-foreground/40'
            }`}
          />
        </button>
      ))}
    </div>
  </div>
);

const ThankYouDialog = ({ open, onClose, firstName }: { open: boolean; onClose: () => void; firstName: string }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md text-center">
      <div className="flex flex-col items-center py-6 space-y-4">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-10 w-10 text-primary fill-primary animate-pulse" />
          </div>
          <Sparkles className="h-6 w-6 text-primary absolute -top-1 -right-1 animate-bounce" />
        </div>
        
        <DialogTitle className="text-2xl">
          Thank You{firstName ? `, ${firstName}` : ''}! 🎉
        </DialogTitle>
        
        <DialogDescription className="text-base space-y-3">
          <p>
            Your feedback means the world to us! Every insight you share helps shape the future of Wealth Perspective.
          </p>
          <p className="text-primary font-medium">
            You're not just a tester — you're a valued partner in building something amazing.
          </p>
        </DialogDescription>

        <Button onClick={onClose} className="mt-4 px-8">
          Continue Exploring
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

const BetaFeedbackModal = ({ open, onOpenChange }: BetaFeedbackModalProps) => {
  const [overallRating, setOverallRating] = useState(0);
  const [experienceRating, setExperienceRating] = useState(0);
  const [whatLiked, setWhatLiked] = useState('');
  const [whatToImprove, setWhatToImprove] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try to get display name from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.display_name) {
          // Get first name only
          setFirstName(profile.display_name.split(' ')[0]);
        } else if (user.email) {
          // Fall back to email prefix
          setFirstName(user.email.split('@')[0].split('.')[0]);
        }
      }
    };
    
    if (open) {
      fetchUserName();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (overallRating === 0 || experienceRating === 0) {
      toast.error('Please provide both ratings');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('beta-feedback', {
        body: {
          action: 'submit',
          overallRating,
          experienceRating,
          whatLiked,
          whatToImprove,
          additionalComments,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Close the feedback modal and show thank you
      onOpenChange(false);
      setShowThankYou(true);
      
      // Reset form
      setOverallRating(0);
      setExperienceRating(0);
      setWhatLiked('');
      setWhatToImprove('');
      setAdditionalComments('');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Beta Feedback
            </DialogTitle>
            <DialogDescription>
              Help us improve! Your feedback shapes the final product.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <StarRating 
              value={overallRating} 
              onChange={setOverallRating} 
              label="Overall, how would you rate this app?" 
            />

            <StarRating 
              value={experienceRating} 
              onChange={setExperienceRating} 
              label="How was your user experience?" 
            />

            <div className="space-y-2">
              <Label htmlFor="whatLiked">What did you like most?</Label>
              <Textarea
                id="whatLiked"
                value={whatLiked}
                onChange={(e) => setWhatLiked(e.target.value)}
                placeholder="Tell us what features or aspects you enjoyed..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatToImprove">What could be improved?</Label>
              <Textarea
                id="whatToImprove"
                value={whatToImprove}
                onChange={(e) => setWhatToImprove(e.target.value)}
                placeholder="Share any issues, bugs, or suggestions..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalComments">Any other comments? (optional)</Label>
              <Textarea
                id="additionalComments"
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder="Anything else you'd like to share..."
                className="min-h-[60px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || overallRating === 0 || experienceRating === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ThankYouDialog 
        open={showThankYou} 
        onClose={() => setShowThankYou(false)} 
        firstName={firstName}
      />
    </>
  );
};

export default BetaFeedbackModal;