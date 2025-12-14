import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/home/SearchBar';
import { getCategoryById, categories } from '@/lib/categories';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const Category = () => {
  const { id } = useParams<{ id: string }>();
  const category = id ? getCategoryById(id) : undefined;

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
        {/* Hero Section */}
        <section className="relative py-12 md:py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container relative">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
            
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
              <SearchBar placeholder={`Search ${category.name.toLowerCase()}...`} />
            </div>
          </div>
        </section>

        {/* Popular Suggestions */}
        <section className="container pb-16">
          <h2 className="font-serif text-xl font-bold mb-4">Try searching for</h2>
          <div className="flex flex-wrap gap-2">
            {getSuggestionsForCategory(category.id).map((suggestion) => (
              <Link 
                key={suggestion} 
                to={`/profile/${suggestion.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Button variant="outline" size="sm" className="hover:border-primary/50">
                  {suggestion}
                </Button>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Sample suggestions for each category
function getSuggestionsForCategory(categoryId: string): string[] {
  const suggestions: Record<string, string[]> = {
    'athletes': ['LeBron James', 'Cristiano Ronaldo', 'Lionel Messi', 'Patrick Mahomes', 'Stephen Curry'],
    'hollywood': ['Dwayne Johnson', 'Scarlett Johansson', 'Tom Cruise', 'Margot Robbie', 'Leonardo DiCaprio'],
    'musicians': ['Taylor Swift', 'Drake', 'Beyoncé', 'Ed Sheeran', 'Bad Bunny'],
    'tech-billionaires': ['Elon Musk', 'Jeff Bezos', 'Mark Zuckerberg', 'Bill Gates', 'Sundar Pichai'],
    'politicians': ['Donald Trump', 'Joe Biden', 'Rishi Sunak', 'Emmanuel Macron'],
    'influencers': ['MrBeast', 'Kylie Jenner', 'Charli D\'Amelio', 'Logan Paul', 'PewDiePie'],
    'historical': ['John D. Rockefeller', 'Andrew Carnegie', 'Cleopatra', 'Genghis Khan', 'Mansa Musa'],
  };
  return suggestions[categoryId] || [];
}

export default Category;
