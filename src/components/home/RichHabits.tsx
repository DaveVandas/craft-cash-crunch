import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

interface RichHabit {
  habit: string;
  source: string;
}

const richHabits: RichHabit[] = [
  { habit: "Wake up early. 90% of executives wake before 6am.", source: "Success Study" },
  { habit: "Read daily. Warren Buffett reads 500 pages a day.", source: "Warren Buffett" },
  { habit: "Pay yourself first. Save before you spend.", source: "The Richest Man in Babylon" },
  { habit: "Network relentlessly. Your net worth equals your network.", source: "Tim Ferriss" },
  { habit: "Think long-term. Compound interest is the 8th wonder.", source: "Albert Einstein" },
  { habit: "Invest in yourself. The best ROI is self-improvement.", source: "Benjamin Franklin" },
  { habit: "Track every dollar. What gets measured gets managed.", source: "Peter Drucker" },
  { habit: "Avoid lifestyle inflation. Live below your means.", source: "Dave Ramsey" },
  { habit: "Take calculated risks. Fortune favors the bold.", source: "Elon Musk" },
  { habit: "Multiple income streams. Never rely on one source.", source: "Robert Kiyosaki" },
  { habit: "Learn to say no. Protect your time fiercely.", source: "Steve Jobs" },
  { habit: "Automate savings. Remove emotion from investing.", source: "Tony Robbins" },
  { habit: "Embrace failure. Every setback is a setup for comeback.", source: "Oprah Winfrey" },
  { habit: "Stay curious. Never stop learning new skills.", source: "Jeff Bezos" },
  { habit: "Think in decades, not days. Patience builds empires.", source: "Naval Ravikant" },
  { habit: "Surround yourself with excellence. You are the average of 5 people.", source: "Jim Rohn" },
  { habit: "Action beats perfection. Start before you feel ready.", source: "Richard Branson" },
  { habit: "Guard your reputation. It takes years to build, seconds to destroy.", source: "Warren Buffett" },
  { habit: "Own assets, not liabilities. Make money work for you.", source: "Rich Dad Poor Dad" },
  { habit: "Stay hungry, stay foolish. Complacency kills success.", source: "Steve Jobs" },
];

const RichHabits = () => {
  const [habit, setHabit] = useState<RichHabit | null>(null);

  useEffect(() => {
    // Pick a random habit on mount (changes each time app opens)
    const randomIndex = Math.floor(Math.random() * richHabits.length);
    setHabit(richHabits[randomIndex]);
  }, []);

  if (!habit) return null;

  return (
    <div className="relative py-6">
      <div className="flex items-start gap-3 max-w-2xl mx-auto px-4">
        <Quote className="h-5 w-5 text-primary/40 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm md:text-base text-foreground/80 italic leading-relaxed">
            {habit.habit}
          </p>
          <p className="text-xs text-muted-foreground">
            — {habit.source}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RichHabits;
