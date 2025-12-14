import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProfileHero from '@/components/profile/ProfileHero';
import EarningsTicker from '@/components/profile/EarningsTicker';
import ComparisonGrid from '@/components/profile/ComparisonGrid';
import ShareCard from '@/components/share/ShareCard';
import { useCelebrityData } from '@/hooks/useCelebrityData';
import { useAuth } from '@/contexts/AuthContext';
import { Celebrity } from '@/lib/types';
import { slugToName } from '@/lib/validation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchCelebrity, loading } = useCelebrityData();
  const { user } = useAuth();
  const [celebrity, setCelebrity] = useState<Celebrity | null>(null);
  const [validationError, setValidationError] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    if (id) {
      // Check if user is authenticated first
      if (!user) {
        setAuthRequired(true);
        setCelebrity(null);
        return;
      }
      
      setAuthRequired(false);
      
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
  }, [id, fetchCelebrity, user]);

  if (loading) {
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

  if (authRequired) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16">
          <Card className="max-w-md mx-auto border-primary/30 bg-card/50">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="font-semibold text-xl mb-2">Sign In Required</h3>
              <p className="text-muted-foreground mb-6">
                Create a free account to view celebrity earnings and comparisons.
              </p>
              <Button onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary/90">
                Sign In / Sign Up
              </Button>
            </CardContent>
          </Card>
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <ProfileHero celebrity={celebrity} />
        <div className="container py-8 space-y-8">
          <EarningsTicker annualEarnings={celebrity.annualEarnings} name={celebrity.name} />
          <ComparisonGrid annualEarnings={celebrity.annualEarnings} name={celebrity.name} />
          <ShareCard celebrity={celebrity} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
