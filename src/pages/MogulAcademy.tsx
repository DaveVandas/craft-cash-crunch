import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { 
  GraduationCap,
  BookOpen,
  TrendingUp,
  Quote,
  Star,
  ChevronRight,
  Lightbulb,
  Target,
  DollarSign,
  BarChart3,
  Rocket,
  ArrowLeft
} from 'lucide-react';
import FeaturePromoShare from '@/components/share/FeaturePromoShare';

interface AcademyLesson {
  id: string;
  lesson_number: number;
  level: string;
  title: string;
  subtitle: string;
  emoji: string;
  intro: string;
  content: string;
  key_points: string[];
  case_study_title: string | null;
  case_study_text: string | null;
  tags: string[];
  published_at: string;
}

const MogulAcademy = () => {
  const [currentLesson, setCurrentLesson] = useState<AcademyLesson | null>(null);
  const [allLessons, setAllLessons] = useState<AcademyLesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('academy_lessons')
        .select('*')
        .eq('is_published', true)
        .order('lesson_number', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const lessons = data.map(l => ({
          ...l,
          key_points: Array.isArray(l.key_points) ? l.key_points as string[] : [],
          tags: Array.isArray(l.tags) ? l.tags as string[] : [],
        }));
        setAllLessons(lessons);
        
        // Current lesson: rotate every 4 days
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (24 * 60 * 60 * 1000));
        const lessonIndex = Math.floor(dayOfYear / 4) % lessons.length;
        setCurrentLesson(lessons[lessonIndex]);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayLesson = selectedLesson || currentLesson;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-emerald-500/10 to-transparent" />
          <div className="absolute top-20 right-10 text-6xl opacity-20 animate-pulse">📚</div>
          <div className="absolute bottom-20 left-10 text-5xl opacity-20 animate-bounce">💡</div>
          
          <div className="container relative">
            <Link to="/mogul-markets" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Mogul Markets
            </Link>
            
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  Free Education
                </Badge>
                <FeaturePromoShare feature="mogulAcademy" size="sm" showLabel />
              </div>
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                Mogul <span className="gradient-gold-text">Academy</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Learn money, markets, and investing — explained so simply a 5th grader could get it.
                New lessons every 4 days. Real stories. Real results.
              </p>
            </div>
          </div>
        </section>
        
        {/* Email signup section - coming soon once email infrastructure is set up */}
        
        {/* Current Lesson */}
        <section className="py-12 md:py-16">
          <div className="container">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            ) : displayLesson ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="h-6 w-6 text-emerald-400" />
                  <h2 className="font-serif text-2xl font-bold">
                    {selectedLesson ? selectedLesson.title : "Today's Lesson"}
                  </h2>
                  {selectedLesson && (
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setSelectedLesson(null)}>
                      ← Back to Today's
                    </Button>
                  )}
                  {!selectedLesson && (
                    <Badge variant="outline" className="ml-auto">
                      <Lightbulb className="h-3 w-3 mr-1 text-amber-500" />
                      {displayLesson.level}
                    </Badge>
                  )}
                </div>
                
                <Card className="border-emerald-500/30 bg-gradient-to-br from-card via-card to-emerald-500/5 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {displayLesson.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-6xl mb-4">{displayLesson.emoji}</div>
                    <CardTitle className="font-serif text-2xl md:text-3xl leading-tight">
                      {displayLesson.title}
                    </CardTitle>
                    <p className="text-lg text-muted-foreground">{displayLesson.subtitle}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <p className="text-lg font-medium text-emerald-400/90 border-l-4 border-emerald-500 pl-4">
                      {displayLesson.intro}
                    </p>
                    
                    <div className="prose prose-invert max-w-none">
                      {displayLesson.content.split('\n\n').map((paragraph: string, i: number) => (
                        <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                          {paragraph.startsWith('**') ? (
                            <span className="font-semibold text-foreground text-lg block mt-6 mb-2">
                              {paragraph.replace(/\*\*/g, '')}
                            </span>
                          ) : (
                            paragraph
                          )}
                        </p>
                      ))}
                    </div>
                    
                    <Separator className="my-8" />
                    
                    {/* Key Points */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Key Takeaways
                      </h3>
                      <div className="grid gap-3">
                        {displayLesson.key_points.map((point: string, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <ChevronRight className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-foreground/90">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Case Study */}
                    {displayLesson.case_study_title && (
                      <div className="relative p-6 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-lg mt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="h-5 w-5 text-amber-500" />
                          <h4 className="font-semibold">Real Story: {displayLesson.case_study_title}</h4>
                        </div>
                        <p className="text-muted-foreground">{displayLesson.case_study_text}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-12">No lessons available yet. Check back soon!</p>
            )}
          </div>
        </section>
        
        {/* Lesson Archive */}
        {allLessons.length > 0 && (
          <section className="py-12 bg-gradient-to-b from-transparent to-emerald-500/5">
            <div className="container">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl font-bold">All Lessons ({allLessons.length})</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allLessons.map((l) => (
                  <Card
                    key={l.id}
                    className={`border-border/50 hover:border-emerald-500/50 transition-colors cursor-pointer group ${
                      displayLesson?.id === l.id ? 'border-emerald-500 bg-emerald-500/5' : ''
                    }`}
                    onClick={() => setSelectedLesson(l)}
                  >
                    <CardContent className="p-4">
                      <div className="text-3xl mb-2">{l.emoji}</div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {l.level}
                      </Badge>
                      <h3 className="font-semibold text-sm group-hover:text-emerald-400 transition-colors">
                        {l.title}
                      </h3>
                      {displayLesson?.id === l.id && (
                        <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                          {selectedLesson?.id === l.id ? 'Viewing' : "Today's Lesson"}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <p className="text-center text-muted-foreground mt-6">
                New AI-generated lessons added automatically every 4 days! 🤖
              </p>
            </div>
          </section>
        )}
        
        {/* CTA Section */}
        <section className="py-12">
          <div className="container">
            <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-emerald-500/10">
              <CardContent className="p-8 text-center">
                <Rocket className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="font-serif text-2xl font-bold mb-2">Ready to Practice?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Put your new knowledge to work! Trade stocks with virtual money on Mogul Markets. No risk, all learning.
                </p>
                <Link to="/mogul-markets">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-emerald-600">
                    Start Trading (Paper Money)
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
};

export default MogulAcademy;
