import { useEffect, useLayoutEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeaturedTicker from '@/components/home/FeaturedTicker';
import SearchBarWithAutocomplete from '@/components/home/SearchBarWithAutocomplete';
import QuickActions from '@/components/home/QuickActions';
import TrendingSearches from '@/components/home/TrendingSearches';
import CompactCategories from '@/components/home/CompactCategories';
import DailyWealthFact from '@/components/home/DailyWealthFact';
import WealthWisdomPromo from '@/components/home/WealthWisdomPromo';
import RichHabits from '@/components/home/RichHabits';
import ExitIntentPopup from '@/components/effects/ExitIntentPopup';
import DailyCelebritySpotlight from '@/components/engagement/DailyCelebritySpotlight';
import SocialProofNotifications from '@/components/engagement/SocialProofNotifications';
import OnboardingTour from '@/components/onboarding/OnboardingTour';

const Index = () => {
  // Scroll to top immediately on any navigation to this page (including back)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Also handle popstate (back/forward button) which may not trigger remount
  useEffect(() => {
    const handlePopState = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <OnboardingTour />
      <ExitIntentPopup />
      <SocialProofNotifications />

      <main className="flex-1 animate-fade-in">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container relative">
            <div className="text-center mb-10 animate-fade-in">
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                See Wealth in <span className="gradient-gold-text">Perspective</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Master the game of money. Explore wealth, build side income, and trade like a mogul.
              </p>
            </div>

            <SearchBarWithAutocomplete />
            <div className="mt-2">
              <DailyWealthFact />
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="container mb-6">
          <div className="space-y-1">
            <DailyCelebritySpotlight />
            <FeaturedTicker />
          </div>
        </section>

        {/* Trending Now */}
        <section className="container mb-6">
          <TrendingSearches />
        </section>

        {/* Browse Categories - Horizontal Scroll */}
        <section className="container mb-8">
          <h2 className="font-serif text-lg font-bold mb-3">Browse by Category</h2>
          <CompactCategories />
        </section>

        {/* Mogul Tools - Stacked List */}
        <section className="container mb-8">
          <h2 className="font-serif text-lg font-bold mb-3">Mogul Tools</h2>
          <QuickActions />
        </section>

        {/* Rich Habits Quote */}
        <section className="container mb-8">
          <RichHabits />
        </section>

        {/* Wealth Wisdom Promo */}
        <section className="container pb-16">
          <WealthWisdomPromo />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
