import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface FeaturedPerson {
  id: string;
  name: string;
  title: string;
  annualEarnings: number;
  imageUrl: string;
  initials: string;
  bgGradient: string;
  shockingStat: string;
}

export const featuredPeople: FeaturedPerson[] = [
  { id: 'elon-musk', name: 'Elon Musk', title: 'Tech Billionaire', annualEarnings: 23500000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg', initials: 'EM', bgGradient: 'from-blue-900/50 to-purple-900/50', shockingStat: 'Made $36 billion in a single day' },
  { id: 'taylor-swift', name: 'Taylor Swift', title: 'Pop Icon', annualEarnings: 185000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%284%29.png/220px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%284%29.png', initials: 'TS', bgGradient: 'from-pink-900/50 to-purple-900/50', shockingStat: 'Earns $1.1M per concert performance' },
  { id: 'cristiano-ronaldo', name: 'Cristiano Ronaldo', title: 'Soccer Star', annualEarnings: 260000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg/220px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg', initials: 'CR', bgGradient: 'from-green-900/50 to-emerald-900/50', shockingStat: 'Makes $3.2M per sponsored post' },
  { id: 'lebron-james', name: 'LeBron James', title: 'NBA Legend', annualEarnings: 119500000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/LeBron_James_crop.jpg/220px-LeBron_James_crop.jpg', initials: 'LJ', bgGradient: 'from-orange-900/50 to-red-900/50', shockingStat: 'Makes $125,000 per game played' },
  { id: 'jeff-bezos', name: 'Jeff Bezos', title: 'Amazon Founder', annualEarnings: 8500000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped%29.jpg/220px-Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped%29.jpg', initials: 'JB', bgGradient: 'from-amber-900/50 to-orange-900/50', shockingStat: 'Made $13B in one day during pandemic' },
  { id: 'beyonce', name: 'Beyoncé', title: 'Music Mogul', annualEarnings: 115000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png/220px-Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png', initials: 'B', bgGradient: 'from-yellow-900/50 to-amber-900/50', shockingStat: 'Earns $320K per hour she works' },
  { id: 'lionel-messi', name: 'Lionel Messi', title: 'Soccer Legend', annualEarnings: 135000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/220px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg', initials: 'LM', bgGradient: 'from-sky-900/50 to-blue-900/50', shockingStat: 'Earns $1.5M every time he plays' },
  { id: 'kim-kardashian', name: 'Kim Kardashian', title: 'Media Personality', annualEarnings: 80000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Kim_Kardashian_2023.jpg/220px-Kim_Kardashian_2023.jpg', initials: 'KK', bgGradient: 'from-rose-900/50 to-pink-900/50', shockingStat: 'Earns $1.8M per Instagram post' },
  { id: 'dwayne-johnson', name: 'Dwayne Johnson', title: 'Hollywood Star', annualEarnings: 87500000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Dwayne_Johnson_2014_%28cropped%29.jpg/220px-Dwayne_Johnson_2014_%28cropped%29.jpg', initials: 'DJ', bgGradient: 'from-stone-800/50 to-zinc-900/50', shockingStat: 'Makes $20M+ per movie' },
  { id: 'mrbeast', name: 'MrBeast', title: 'YouTube King', annualEarnings: 82000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/MrBeast_2023_%28cropped%29.jpg/220px-MrBeast_2023_%28cropped%29.jpg', initials: 'MB', bgGradient: 'from-red-900/50 to-rose-900/50', shockingStat: 'Earns $3M per YouTube video' },
  { id: 'kylie-jenner', name: 'Kylie Jenner', title: 'Beauty Mogul', annualEarnings: 65000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Kylie_Jenner_%28cropped%29.jpg/220px-Kylie_Jenner_%28cropped%29.jpg', initials: 'KJ', bgGradient: 'from-fuchsia-900/50 to-pink-900/50', shockingStat: 'Earns $1.8M per Instagram post' },
  { id: 'travis-kelce', name: 'Travis Kelce', title: 'NFL Star', annualEarnings: 34000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Travis_Kelce_2023_%28cropped%29.jpg/220px-Travis_Kelce_2023_%28cropped%29.jpg', initials: 'TK', bgGradient: 'from-red-900/50 to-amber-900/50', shockingStat: 'Earns $2M per playoff game' },
  { id: 'rihanna', name: 'Rihanna', title: 'Music & Beauty Icon', annualEarnings: 75000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Rihanna_Fenty_2018.png/220px-Rihanna_Fenty_2018.png', initials: 'R', bgGradient: 'from-cyan-900/50 to-teal-900/50', shockingStat: 'Fenty Beauty made her a billionaire' },
  { id: 'mark-zuckerberg', name: 'Mark Zuckerberg', title: 'Meta CEO', annualEarnings: 12000000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/220px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg', initials: 'MZ', bgGradient: 'from-blue-900/50 to-indigo-900/50', shockingStat: 'Made $28B in one year from Meta stock' },
  { id: 'oprah-winfrey', name: 'Oprah Winfrey', title: 'Media Mogul', annualEarnings: 75000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Oprah_in_2014.jpg/220px-Oprah_in_2014.jpg', initials: 'OW', bgGradient: 'from-violet-900/50 to-purple-900/50', shockingStat: 'Built a $2.5B empire from nothing' },
  { id: 'tiger-woods', name: 'Tiger Woods', title: 'Golf Legend', annualEarnings: 68000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/TigerWoodsOct2011.jpg/220px-TigerWoodsOct2011.jpg', initials: 'TW', bgGradient: 'from-green-900/50 to-lime-900/50', shockingStat: 'First athlete to earn $1B' },
];

interface FeaturedCelebrityContextType {
  currentIndex: number;
  featured: FeaturedPerson;
  isTransitioning: boolean;
  goToNext: () => void;
  goToPrev: () => void;
  goToIndex: (index: number) => void;
  totalCount: number;
}

const FeaturedCelebrityContext = createContext<FeaturedCelebrityContextType | null>(null);

export const FeaturedCelebrityProvider = ({ children }: { children: ReactNode }) => {
  const [currentIndex, setCurrentIndex] = useState(() => 
    Math.floor(Math.random() * featuredPeople.length)
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % featuredPeople.length);
    window.setTimeout(() => setIsTransitioning(false), 150);
  }, []);

  const goToPrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + featuredPeople.length) % featuredPeople.length);
    window.setTimeout(() => setIsTransitioning(false), 150);
  }, []);

  const goToIndex = useCallback((index: number) => {
    setIsTransitioning(true);
    const len = featuredPeople.length;
    const next = ((index % len) + len) % len;
    setCurrentIndex(next);
    window.setTimeout(() => setIsTransitioning(false), 150);
  }, []);

  // Auto-rotate every 30 seconds, but only when the page is visible
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      } else {
        if (!interval) {
          interval = setInterval(goToNext, 30000);
        }
      }
    };

    // Start interval only if page is visible
    if (!document.hidden) {
      interval = setInterval(goToNext, 30000);
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [goToNext]);

  return (
    <FeaturedCelebrityContext.Provider value={{
      currentIndex,
      featured: featuredPeople[currentIndex],
      isTransitioning,
      goToNext,
      goToPrev,
      goToIndex,
      totalCount: featuredPeople.length,
    }}>
      {children}
    </FeaturedCelebrityContext.Provider>
  );
};

export const useFeaturedCelebrity = () => {
  const context = useContext(FeaturedCelebrityContext);
  if (!context) {
    throw new Error('useFeaturedCelebrity must be used within FeaturedCelebrityProvider');
  }
  return context;
};
