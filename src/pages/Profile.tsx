import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaywallGate from '@/components/paywall/PaywallGate';
import ProfileHero from '@/components/profile/ProfileHero';
import EarningsTicker from '@/components/profile/EarningsTicker';
import ComparisonGrid from '@/components/profile/ComparisonGrid';
import ShareCard from '@/components/share/ShareCard';
import TimeOnPageCounter from '@/components/profile/TimeOnPageCounter';
import MoneyRain from '@/components/effects/MoneyRain';
import { useCelebrityData } from '@/hooks/useCelebrityData';
import { useAuth } from '@/contexts/AuthContext';
import { Celebrity } from '@/lib/types';
import { slugToName } from '@/lib/validation';
import { Skeleton } from '@/components/ui/skeleton';

const ANON_SEARCH_KEY = 'wealth_perspective_anon_searches';

const getAnonSearchCount = (): number => {
  try {
    return parseInt(localStorage.getItem(ANON_SEARCH_KEY) || '0', 10);
  } catch {
    return 0;
  }
};

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchCelebrity, loading } = useCelebrityData();
  const { user, accessInfo, loading: authLoading } = useAuth();
  const [celebrity, setCelebrity] = useState<Celebrity | null>(null);
  const [validationError, setValidationError] = useState(false);

  // Check if user is blocked BEFORE fetching
  const anonSearchCount = getAnonSearchCount();
  const isAnonBlocked = !user && anonSearchCount >= 3;
  const isUserBlocked = user && accessInfo && !accessInfo.hasAccess;
  const shouldBlock = isAnonBlocked || isUserBlocked;

  useEffect(() => {
    // Don't fetch if blocked
    if (shouldBlock || authLoading) return;
    
    if (id) {
      // Validate the URL parameter before making API call
      const validatedName = slugToName(id);

      if (!validatedName) {
        setValidationError(true);
        setCelebrity(null);
        return;
      }

      setValidationError(false);
      fetchCelebrity(validatedName).then(setCelebrity);
    }
  }, [id, fetchCelebrity, shouldBlock, authLoading]);

  // Show paywall FIRST if blocked
  if (shouldBlock && !authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <PaywallGate>
            <div />
          </PaywallGate>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <Skeleton className="h-40 w-full mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-96 w-full" />
        </main>
        <Footer />
      </div>
    );
  }
  if (validationError) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid profile</h1>
          <p className="text-muted-foreground">The profile URL contains invalid characters. Please use the search to find someone.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!celebrity) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Celebrity not found</h1>
          <p className="text-muted-foreground">Try searching for someone else.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Show money rain for billionaires
  const isBillionaire = celebrity.annualEarnings >= 1000000000;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      {isBillionaire && <MoneyRain intensity="light" />}
      <main className="flex-1">
        <PaywallGate>
          <>
            <ProfileHero celebrity={celebrity} />
            <div className="container py-8 space-y-8">
              <EarningsTicker annualEarnings={celebrity.annualEarnings} name={celebrity.name} />
              <ComparisonGrid annualEarnings={celebrity.annualEarnings} name={celebrity.name} />
              <ShareCard celebrity={celebrity} />
            </div>
          </>
        </PaywallGate>
      </main>
      <TimeOnPageCounter annualEarnings={celebrity.annualEarnings} name={celebrity.name} />
      <Footer />
    </div>
  );
};

export default Profile;
