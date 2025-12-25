import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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

// Preview data passed from "You Might Also Like" navigation
interface PreviewData {
  name: string;
  netWorth: string;
  hourlyEarnings: string;
  emoji: string;
}

// Parse currency string like "$1.2B" to number
const parseCurrencyString = (str: string): number => {
  const cleaned = str.replace(/[^0-9.BMK]/gi, '');
  const num = parseFloat(cleaned) || 0;
  if (str.includes('B')) return num * 1_000_000_000;
  if (str.includes('M')) return num * 1_000_000;
  if (str.includes('K')) return num * 1_000;
  return num;
};

// Parse hourly earnings like "$14,000/hr" to annual
const parseHourlyToAnnual = (str: string): number => {
  const hourly = parseCurrencyString(str.replace('/hr', ''));
  return hourly * 2080; // ~40hrs/week * 52 weeks
};

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
  const location = useLocation();
  const { fetchCelebrity, loading } = useCelebrityData();
  const { user, accessInfo, loading: authLoading } = useAuth();
  const [celebrity, setCelebrity] = useState<Celebrity | null>(null);
  const [validationError, setValidationError] = useState(false);

  // Get preview data from navigation state (from "You Might Also Like" clicks)
  const preview = (location.state as { preview?: PreviewData })?.preview;

  // Create a preview celebrity for instant display while loading
  const previewCelebrity: Celebrity | null = preview ? {
    id: id || '',
    name: preview.name,
    profession: 'Loading...',
    netWorth: parseCurrencyString(preview.netWorth),
    annualEarnings: parseHourlyToAnnual(preview.hourlyEarnings),
    category: 'hollywood', // Will be updated when full data loads
    source: 'Loading...',
  } : null;

  // Check if user is blocked BEFORE fetching
  const anonSearchCount = getAnonSearchCount();
  const isAnonBlocked = !user && anonSearchCount >= 3;
  const isUserBlocked = user && accessInfo && !accessInfo.hasAccess;
  const shouldBlock = isAnonBlocked || isUserBlocked;

  // Reset celebrity when route changes to show preview immediately
  useEffect(() => {
    setCelebrity(null);
    setValidationError(false);
  }, [id]);

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

  // Use preview data for instant display, or show skeleton if no preview
  const displayCelebrity = celebrity || previewCelebrity;
  const isLoadingWithPreview = loading && previewCelebrity;
  const isLoadingWithoutPreview = (loading || authLoading) && !previewCelebrity;

  if (isLoadingWithoutPreview) {
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

  if (!displayCelebrity) {
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
  const isBillionaire = displayCelebrity.annualEarnings >= 1000000000;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      {isBillionaire && <MoneyRain intensity="light" />}
      <main className="flex-1">
        <PaywallGate>
          <>
            <ProfileHero celebrity={displayCelebrity} isLoading={!!isLoadingWithPreview} />
            <div className="container py-8 space-y-8">
              <EarningsTicker annualEarnings={displayCelebrity.annualEarnings} name={displayCelebrity.name} />
              <ComparisonGrid annualEarnings={displayCelebrity.annualEarnings} name={displayCelebrity.name} />
              <ShareCard celebrity={displayCelebrity} />
            </div>
          </>
        </PaywallGate>
      </main>
      <TimeOnPageCounter annualEarnings={displayCelebrity.annualEarnings} name={displayCelebrity.name} />
      <Footer />
    </div>
  );
};

export default Profile;
