import { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaywallGate from '@/components/paywall/PaywallGate';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import SearchBarWithAutocomplete from '@/components/home/SearchBarWithAutocomplete';
import { getCategoryById, categories } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const Category = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const category = id ? getCategoryById(id) : undefined;
  const [displayedSuggestions, setDisplayedSuggestions] = useState<string[]>([]);

  // Scroll to top immediately on any navigation (including back button)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  // Shuffle suggestions randomly on every visit
  useEffect(() => {
    if (category) {
      const allSuggestions = getAllSuggestionsForCategory(category.id);
      const shuffled = [...allSuggestions].sort(() => Math.random() - 0.5);
      setDisplayedSuggestions(shuffled.slice(0, 5));
    }
  }, [category]);

  // Navigate to profile with preview data to prevent loading flash
  const handleSuggestionClick = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/profile/${slug}`, {
      state: {
        preview: {
          name,
          netWorth: 'Loading...',
          hourlyEarnings: '$0/hr',
          emoji: '💰',
        },
      },
    });
  };

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <p className="text-muted-foreground mb-6">This category doesn't exist.</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <PaywallGate>
        {/* Hero Section */}
        <section className="relative py-12 md:py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container relative">
            <Breadcrumb currentPage={category.name} />
            
            <div className="flex items-center gap-4 mb-6">
              <div 
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-xl text-4xl",
                  "bg-gradient-to-br", category.gradient,
                  "shadow-lg"
                )}
              >
                {category.icon}
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold">
                  {category.name}
                </h1>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </div>

            <div className="max-w-xl">
              <p className="text-muted-foreground mb-6">
                Search for any {category.name.toLowerCase()} to see their earnings in perspective.
              </p>
              <SearchBarWithAutocomplete placeholder={`Search ${category.name.toLowerCase()}...`} categoryId={category.id} />
            </div>
          </div>
        </section>

        {/* Popular Suggestions */}
        <section className="container pb-16">
          <h2 className="font-serif text-xl font-bold mb-4">Try searching for</h2>
          <div className="flex flex-wrap gap-2">
            {displayedSuggestions.map((suggestion) => (
              <Button 
                key={suggestion} 
                variant="outline" 
                size="sm" 
                className="hover:border-primary/50"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </section>
        </PaywallGate>
      </main>
      <Footer />
    </div>
  );
};

// Extended suggestions pool for each category (rotates from this list)
function getAllSuggestionsForCategory(categoryId: string): string[] {
  const suggestions: Record<string, string[]> = {
    'athletes': ['LeBron James', 'Cristiano Ronaldo', 'Lionel Messi', 'Patrick Mahomes', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo', 'Kylian Mbappé', 'Neymar Jr', 'Tom Brady', 'Serena Williams', 'Roger Federer', 'Tiger Woods', 'Shohei Ohtani', 'Lewis Hamilton'],
    'hollywood': ['Dwayne Johnson', 'Scarlett Johansson', 'Tom Cruise', 'Margot Robbie', 'Leonardo DiCaprio', 'Robert Downey Jr', 'Jennifer Lawrence', 'Brad Pitt', 'Sandra Bullock', 'Ryan Reynolds', 'Chris Hemsworth', 'Gal Gadot', 'Will Smith', 'Denzel Washington', 'Meryl Streep'],
    'musicians': ['Taylor Swift', 'Drake', 'Beyoncé', 'Ed Sheeran', 'Bad Bunny', 'The Weeknd', 'Rihanna', 'Post Malone', 'Travis Scott', 'Harry Styles', 'Billie Eilish', 'Bruno Mars', 'Adele', 'Jay-Z', 'Kanye West'],
    'tech-billionaires': ['Elon Musk', 'Jeff Bezos', 'Mark Zuckerberg', 'Bill Gates', 'Sundar Pichai', 'Tim Cook', 'Larry Page', 'Sergey Brin', 'Jensen Huang', 'Satya Nadella', 'Larry Ellison', 'Steve Ballmer', 'Michael Dell', 'Jack Dorsey', 'Brian Chesky'],
    'politicians': ['Donald Trump', 'Joe Biden', 'Rishi Sunak', 'Emmanuel Macron', 'Barack Obama', 'Vladimir Putin', 'Xi Jinping', 'Justin Trudeau', 'Angela Merkel', 'Boris Johnson', 'Nancy Pelosi', 'Bernie Sanders'],
    'influencers': ['MrBeast', 'Kylie Jenner', 'Charli D\'Amelio', 'Logan Paul', 'PewDiePie', 'Jake Paul', 'Addison Rae', 'David Dobrik', 'Emma Chamberlain', 'Kim Kardashian', 'Khaby Lame', 'Markiplier', 'Ninja', 'Pokimane', 'KSI'],
    'historical': ['John D. Rockefeller', 'Andrew Carnegie', 'Cleopatra', 'Genghis Khan', 'Mansa Musa', 'Henry Ford', 'J.P. Morgan', 'Cornelius Vanderbilt', 'King Solomon', 'Augustus Caesar', 'Akbar I', 'William the Conqueror', 'Mir Osman Ali Khan', 'Jakob Fugger'],
    'royalty': ['King Charles III', 'Prince William', 'Queen Elizabeth II', 'Prince Harry', 'King Salman', 'Mohammed bin Salman', 'Sultan of Brunei', 'King of Thailand', 'Prince Albert II', 'Sheikh Mohammed', 'King Felipe VI', 'Princess Diana'],
    'business-titans': ['Warren Buffett', 'Jamie Dimon', 'Ray Dalio', 'Carl Icahn', 'George Soros', 'Ken Griffin', 'Stephen Schwarzman', 'David Solomon', 'Bernard Arnault', 'Mukesh Ambani', 'Gautam Adani', 'Rupert Murdoch', 'Charles Koch', 'Michael Bloomberg'],
  };
  return suggestions[categoryId] || [];
}

export default Category;
