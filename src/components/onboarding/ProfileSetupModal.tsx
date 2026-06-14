import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, User, Loader2 } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

interface ProfileSetupModalProps {
  open: boolean;
  onComplete: () => void;
}

const ProfileSetupModal = ({ open, onComplete }: ProfileSetupModalProps) => {
  const [displayName, setDisplayName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { updateProfile, uploadAvatar } = useUserProfile();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      toast.error('Please enter a screen name');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload avatar if selected
      if (avatarFile) {
        const { error: uploadError } = await uploadAvatar(avatarFile);
        if (uploadError) {
          console.error('Avatar upload error:', uploadError);
          toast.error('Failed to upload photo, but saving name...');
        }
      }

      // Update display name
      const { error } = await updateProfile({ display_name: displayName.trim() });
      if (error) {
        toast.error('Failed to save profile');
        return;
      }

      toast.success('Profile set up successfully!');
      // Notify other components (e.g. OnboardingTour) that setup is complete
      window.dispatchEvent(new CustomEvent('profile-setup-complete'));
      onComplete();
    } catch (error) {
      console.error('Profile setup error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-serif">
            Welcome! 👋
          </DialogTitle>
          <DialogDescription className="text-center">
            Set up your profile to get started. Your screen name will appear in Reality Check comparisons.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div 
              className="relative cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="h-24 w-24 ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all">
                <AvatarImage src={avatarPreview || undefined} alt="Your photo" className="object-cover" />
                <AvatarFallback className="bg-primary/10">
                  <User className="h-10 w-10 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg">
                <Camera className="h-4 w-4" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">
              Tap to add a photo (optional)
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Screen Name *</Label>
            <Input
              id="displayName"
              placeholder="What should we call you?"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={30}
              className="text-center text-lg"
            />
            <p className="text-xs text-muted-foreground text-center">
              This will show in your Reality Check comparisons
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={!displayName.trim() || isSubmitting}
            className="w-full h-12 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              "Let's Go! 🚀"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSetupModal;
