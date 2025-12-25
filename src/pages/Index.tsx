import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeaturedTicker from '@/components/home/FeaturedTicker';
import SearchBarWithAutocomplete from '@/components/home/SearchBarWithAutocomplete';
import CategoryCard from '@/components/home/CategoryCard';
import QuickActions from '@/components/home/QuickActions';
import TrendingSearches from '@/components/home/TrendingSearches';
import DailyWealthFact from '@/components/home/DailyWealthFact';
import WealthWisdomPromo from '@/components/home/WealthWisdomPromo';
import RichHabits from '@/components/home/RichHabits';
import ExitIntentPopup from '@/components/effects/ExitIntentPopup';
import DailyCelebritySpotlight from '@/components/engagement/DailyCelebritySpotlight';
import SocialProofNotifications from '@/components/engagement/SocialProofNotifications';
import { categories } from '@/lib/categories';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <ExitIntentPopup />
      <SocialProofNotifications />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container relative">
            <div className="text-center mb-10 animate-fade-in">
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                See Wealth in <span className="gradient-gold-text">Perspective</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Mind-blowing comparisons that make celebrity earnings tangible.
              </p>
            </div>

            <SearchBarWithAutocomplete />
            <div className="mt-2">
              <DailyWealthFact />
            </div>
          </div>
        </section>

        {/* Featured Section - Stacked */}
        <section className="container mb-12">
          <div className="space-y-1">
            <DailyCelebritySpotlight />
            <FeaturedTicker />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container mb-8">
          <h2 className="font-serif text-2xl font-bold mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <QuickActions />
          </div>
        </section>

        {/* Rich Habits Quote */}
        <section className="container mb-8">
          <RichHabits />
        </section>

        {/* Wealth Wisdom Promo */}
        <section className="container mb-12">
          <WealthWisdomPromo />
        </section>

        {/* Trending */}
        <section className="container mb-12">
          <TrendingSearches />
        </section>

        {/* Categories */}
        <section className="container pb-16">
          <h2 className="font-serif text-2xl font-bold mb-5">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
