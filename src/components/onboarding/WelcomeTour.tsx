import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Search, Calculator, TrendingUp, Trophy, Share2, 
  ChevronRight, ChevronLeft, Sparkles, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WelcomeTourProps {
  open: boolean;
  onComplete: () => void;
}

const tourSteps = [
  {
    icon: Sparkles,
    title: "Welcome to Wealth Perspective! 🎉",
    description: "Ready to see how the rich REALLY think about money? Let's take a quick tour of what you can do here.",
    tip: "This will only take 30 seconds!",
    action: null
  },
  {
    icon: Search,
    title: "Search Any Celebrity",
    description: "Search for any celebrity, athlete, or business mogul to see their real-time earnings. Watch money tick up live!",
    tip: "Try searching for 'Elon Musk' or 'Taylor Swift'",
    action: { label: "Try It", path: "/" }
  },
  {
    icon: Calculator,
    title: "Reality Check Calculator",
    description: "Enter your salary and compare it to celebrities. See how long it takes them to earn what you make in a year. It's eye-opening!",
    tip: "Generate a shareable card to post on social media",
    action: { label: "Compare Now", path: "/calculator" }
  },
  {
    icon: TrendingUp,
    title: "Wealth Showdowns",
    description: "Compare two celebrities head-to-head. Who earns faster? Create epic wealth battles and share them with friends!",
    tip: "Try comparing athletes vs. tech moguls",
    action: { label: "Start Showdown", path: "/compare" }
  },
  {
    icon: Trophy,
    title: "Quiz & Learn",
    description: "Test your knowledge about celebrity wealth. Can you guess who earns more? Challenge your friends!",
    tip: "Share your quiz results on social media",
    action: { label: "Take Quiz", path: "/quiz" }
  },
  {
    icon: Share2,
    title: "You're All Set! 🚀",
    description: "You're ready to explore! Pro tip: Save your favorite celebrities and share mind-blowing stats with friends.",
    tip: "Start by searching for someone you admire",
    action: { label: "Start Exploring", path: "/" }
  }
];

const WelcomeTour = ({ open, onComplete }: WelcomeTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleAction = () => {
    const step = tourSteps[currentStep];
    if (step.action?.path) {
      onComplete();
      navigate(step.action.path);
    } else if (currentStep === tourSteps.length - 1) {
      onComplete();
    }
  };

  const step = tourSteps[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Skip tour"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader className="text-center pt-4">
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mb-6">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-6 bg-primary' 
                    : index < currentStep 
                      ? 'w-2 bg-primary/50' 
                      : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <StepIcon className="h-10 w-10 text-primary" />
            </div>
          </div>

          <DialogTitle className="text-2xl font-serif text-center">
            {step.title}
          </DialogTitle>
          <DialogDescription className="text-base text-center mt-2">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        {/* Tip */}
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 my-4">
          <p className="text-sm text-center">
            <span className="font-medium text-primary">💡 Tip: </span>
            {step.tip}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mt-2">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={isFirstStep}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-2">
            {!isLastStep && (
              <Button variant="outline" onClick={handleSkip}>
                Skip Tour
              </Button>
            )}
            
            {step.action ? (
              <Button onClick={handleAction} className="gap-2 shadow-gold">
                {step.action.label}
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNext} className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeTour;
