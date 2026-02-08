import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Crown, Bell, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AffiliateWaitlistProps {
  spotsRemaining?: number;
  variant?: 'full' | 'compact';
}

export default function AffiliateWaitlist({ spotsRemaining = 0, variant = 'full' }: AffiliateWaitlistProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('email_subscribers').insert({
        email: email.trim().toLowerCase(),
        source: 'affiliate_waitlist',
        name: null,
      });

      if (error) {
        if (error.code === '23505') {
          toast.success("You're already on the list! We'll notify you when spots open.");
        } else {
          throw error;
        }
      } else {
        toast.success("You're on the waitlist! We'll email you when spots open.");
      }
      
      setSubmitted(true);
    } catch (err) {
      console.error('Error joining waitlist:', err);
      toast.error('Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 via-card to-amber-500/10 border-primary/30">
        <CardContent className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="font-bold text-lg mb-2">You're on the List! 🎉</h3>
          <p className="text-sm text-muted-foreground">
            We'll email you the moment a spot opens up. Keep an eye on your inbox!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-amber-500/10 via-primary/10 to-amber-500/10 rounded-lg p-4 border border-amber-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-4 h-4 text-amber-400" />
          <Badge variant="outline" className="border-amber-500/40 text-amber-400 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Program Full
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Our affiliate program is at capacity. Join the waitlist!
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" size="sm" disabled={isSubmitting}>
            <Bell className="w-4 h-4 mr-1" />
            Notify Me
          </Button>
        </form>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-card to-amber-500/10 border-primary/30">
      <CardContent className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-4">
          <Crown className="w-8 h-8 text-amber-400" />
        </div>
        
        <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Program Currently Full
        </Badge>
        
        <h2 className="text-2xl font-bold mb-2">The Mogul Movement is 🔥</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Our affiliate program has reached capacity! We're capping at 100 moguls to ensure 
          quality support and fast payouts. Join the waitlist and we'll email you the 
          moment a spot opens.
        </p>

        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-center"
            required
          />
          <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
            <Bell className="w-4 h-4" />
            {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-4">
          We'll notify you as soon as a spot becomes available. Don't miss out! 👑
        </p>
      </CardContent>
    </Card>
  );
}
