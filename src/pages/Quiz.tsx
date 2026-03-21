import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import PaywallGate from '@/components/paywall/PaywallGate';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import PageMeta from '@/components/seo/PageMeta';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Trophy, RotateCcw, CheckCircle, XCircle, Flame, Zap, Crown, Sparkles, Play, Loader2 } from 'lucide-react';
import quizLoadingMogul from '@/assets/quiz-loading-mogul.png';
import { formatLargeCurrency } from '@/lib/earnings';
import { useShareCard } from '@/hooks/useShareCard';
import ShareMenuDropdown from '@/components/share/ShareMenuDropdown';
import FeaturePromoShare from '@/components/share/FeaturePromoShare';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSound } from '@/contexts/SoundContext';
// Enhanced question interface supporting multiple question types
type QuestionType = 'time_to_earn' | 'net_worth_comparison' | 'income_source' | 'wealth_fact';

interface QuizQuestion {
  questionType?: QuestionType;
  questionText?: string;
  celebrity: string;
  celebrity2?: string;
  emoji: string;
  emoji2?: string;
  category: string;
  correctAnswer?: string;
  correctTime?: string; // Legacy field for fallback questions
  options: string[];
  explanation?: string;
  educationalFact?: string;
  // Legacy fields for fallback
  itemName?: string;
  itemEmoji?: string;
  itemValue?: number;
  annualEarnings?: number;
  funFact?: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    celebrity: 'Elon Musk',
    emoji: '🚀',
    category: 'Tech Titan',
    correctTime: '12 minutes',
    options: ['12 minutes', '2 hours', '1 day', '1 week'],
    itemName: 'Tesla Model 3',
    itemEmoji: '🚗',
    itemValue: 40000,
    annualEarnings: 2000000000,
    funFact: "Elon could buy a new Tesla every 12 minutes and still have billions left over!"
  },
  {
    celebrity: 'Taylor Swift',
    emoji: '🎤',
    category: 'Pop Royalty',
    correctTime: '3 hours',
    options: ['15 minutes', '3 hours', '1 day', '3 days'],
    itemName: 'Luxury Rolex',
    itemEmoji: '⌚',
    itemValue: 15000,
    annualEarnings: 185000000,
    funFact: "Taylor's Eras Tour made her a billionaire — one concert at a time!"
  },
  {
    celebrity: 'LeBron James',
    emoji: '🏀',
    category: 'Sports Legend',
    correctTime: '45 minutes',
    options: ['10 minutes', '45 minutes', '4 hours', '1 day'],
    itemName: 'iPhone 15 Pro Max',
    itemEmoji: '📱',
    itemValue: 1200,
    annualEarnings: 120000000,
    funFact: "LeBron earns more per game than most people earn in a lifetime!"
  },
  {
    celebrity: 'Jeff Bezos',
    emoji: '📦',
    category: 'E-Commerce King',
    correctTime: '8 seconds',
    options: ['8 seconds', '2 minutes', '30 minutes', '2 hours'],
    itemName: 'Average monthly rent',
    itemEmoji: '🏠',
    itemValue: 2000,
    annualEarnings: 8500000000,
    funFact: "Jeff makes your rent money in the time it takes to sneeze!"
  },
  {
    celebrity: 'Beyoncé',
    emoji: '👑',
    category: 'Music Mogul',
    correctTime: '2 hours',
    options: ['30 minutes', '2 hours', '8 hours', '2 days'],
    itemName: 'Designer handbag',
    itemEmoji: '👜',
    itemValue: 5000,
    annualEarnings: 80000000,
    funFact: "Queen Bey's net worth could buy every Birkin bag ever made!"
  },
  {
    celebrity: 'Cristiano Ronaldo',
    emoji: '⚽',
    category: 'Football Icon',
    correctTime: '20 minutes',
    options: ['5 minutes', '20 minutes', '2 hours', '1 day'],
    itemName: 'PS5 Bundle',
    itemEmoji: '🎮',
    itemValue: 600,
    annualEarnings: 260000000,
    funFact: "CR7 earns more from one Instagram post than most people earn in a year!"
  },
  {
    celebrity: 'Oprah Winfrey',
    emoji: '📺',
    category: 'Media Queen',
    correctTime: '4 hours',
    options: ['1 hour', '4 hours', '12 hours', '2 days'],
    itemName: 'MacBook Pro',
    itemEmoji: '💻',
    itemValue: 3000,
    annualEarnings: 275000000,
    funFact: "Oprah built a billion-dollar empire starting from nothing!"
  },
  {
    celebrity: 'MrBeast',
    emoji: '🎬',
    category: 'YouTube King',
    correctTime: '25 minutes',
    options: ['5 minutes', '25 minutes', '3 hours', '1 day'],
    itemName: 'GoPro Camera',
    itemEmoji: '📸',
    itemValue: 500,
    annualEarnings: 82000000,
    funFact: "MrBeast reinvests almost everything — that's the mogul mindset!"
  },
];

const STREAK_MESSAGES = [
  { streak: 2, message: "Double kill! 🔥", color: "text-amber-400" },
  { streak: 3, message: "Hat trick! 🎩", color: "text-amber-500" },
  { streak: 4, message: "On fire! 🔥🔥", color: "text-orange-500" },
  { streak: 5, message: "UNSTOPPABLE! 💪", color: "text-red-500" },
];

const RESULT_TITLES = [
  { min: 0, max: 20, title: "Wealth Rookie", emoji: "🌱", desc: "The wealth gap is mind-blowing, right? Keep exploring!" },
  { min: 21, max: 40, title: "Money Curious", emoji: "🤔", desc: "You're getting the picture — these numbers are wild!" },
  { min: 41, max: 60, title: "Wealth Watcher", emoji: "👀", desc: "Not bad! You've got a decent sense of mega-wealth." },
  { min: 61, max: 80, title: "Fortune Tracker", emoji: "📊", desc: "Impressive! You really know your billionaires!" },
  { min: 81, max: 99, title: "Money Master", emoji: "💰", desc: "Almost perfect! You've got wealth wisdom!" },
  { min: 100, max: 100, title: "Wealth Wizard", emoji: "🧙‍♂️", desc: "PERFECT SCORE! You're basically a financial oracle!" },
];

const Quiz = () => {
  const { play: playSound } = useSound();
  const [gameState, setGameState] = useState<'intro' | 'loading' | 'playing' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [showStreakMessage, setShowStreakMessage] = useState(false);
  // Ref-based guard to prevent double-click race condition
  const answerLockedRef = useRef(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const resultsCardRef = useRef<HTMLDivElement>(null);

  // Only scroll on initial mount, not on quiz start
  useEffect(() => {
    if (gameState === 'intro') {
      window.scrollTo(0, 0);
    }
  }, []);

  // Safety reset: when we advance to a new question, clear any prior selection
  // and blur focus so the previously-clicked button doesn't appear "selected".
  useEffect(() => {
    if (gameState !== 'playing') return;

    setSelectedAnswer(null);
    setIsCorrect(null);

    if (typeof document !== 'undefined') {
      (document.activeElement as HTMLElement | null)?.blur?.();
    }
  }, [currentQuestion, gameState]);

  const getResultTitle = () => {
    const percentage = shuffledQuestions.length > 0 ? (score / shuffledQuestions.length) * 100 : 0;
    return RESULT_TITLES.find(r => percentage >= r.min && percentage <= r.max) || RESULT_TITLES[0];
  };

  const getShareText = () => {
    const result = getResultTitle();
    return `🎯 I'm a "${result.title}" ${result.emoji}\n\nScored ${score}/${shuffledQuestions.length} on the Wealth Quiz!\n💰 ${totalPoints} points\n\nCan you beat me?`;
  };

  const shareUrl = 'https://earningsexplorer.shop/quiz';
  const imageName = `wealth-quiz-${getResultTitle().title.replace(/\s+/g, '-').toLowerCase()}`;

  const {
    isGeneratingImage,
    handleCopyLink,
    handleTwitterShare,
    handleFacebookShare,
    handleWhatsAppShare,
    handleLinkedInShare,
    handleSaveImage,
    handleTextShare,
    handleInstagramShare,
    handleTikTokShare,
  } = useShareCard({
    cardRef: resultsCardRef as React.RefObject<HTMLDivElement>,
    shareText: getShareText(),
    shareUrl,
    imageName,
    title: 'Wealth Quiz Results',
  });

  const startQuiz = async () => {
    setGameState('loading');
    setUsedFallback(false);
    
    try {
      // Try to fetch AI-validated questions from Perplexity
      const { data, error } = await supabase.functions.invoke('generate-quiz-questions', {
        body: { count: 5 },
      });
      
      if (!error && data?.questions?.length >= 3) {
        setShuffledQuestions(data.questions);
      } else {
        // Fall back to static questions
        const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
        setShuffledQuestions(shuffled);
        setUsedFallback(true);
      }
    } catch (_err) {
      // Fall back to static questions
      // Fall back to static questions
      const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
      setShuffledQuestions(shuffled);
      setUsedFallback(true);
    }
    
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setTotalPoints(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameState('playing');
  };

  // Get the correct answer - handles both new and legacy formats
  const getCorrectAnswer = (q: QuizQuestion): string => {
    return q.correctAnswer || q.correctTime || '';
  };

  const handleAnswer = (answer: string) => {
    // Use ref for synchronous guard - state check alone has a race condition
    // where two rapid clicks both see selectedAnswer as null before re-render
    if (answerLockedRef.current || selectedAnswer) return;
    answerLockedRef.current = true;

    setSelectedAnswer(answer);
    const correctAnswer = getCorrectAnswer(shuffledQuestions[currentQuestion]);
    const correct = answer === correctAnswer;
    
    // IMPORTANT: Set isCorrect state so UI displays correctly
    setIsCorrect(correct);
    
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(score + 1);
      
      // Play correct sound, or streak sound for streaks >= 2
      if (newStreak >= 2) {
        playSound('streak');
      } else {
        playSound('correct');
      }
      
      // Points with streak multiplier
      const basePoints = 100;
      const multiplier = Math.min(newStreak, 5);
      const points = basePoints * multiplier;
      setTotalPoints(totalPoints + points);
      
      if (newStreak >= 2) {
        setShowStreakMessage(true);
        setTimeout(() => setShowStreakMessage(false), 1000);
      }
    } else {
      setStreak(0);
      playSound('incorrect');
    }

    // Longer delay for wrong answers to read the fun fact
    const delay = correct ? 2000 : 3500;
    
    setTimeout(() => {
      // Unlock for next question
      answerLockedRef.current = false;
      
      if (currentQuestion < shuffledQuestions.length - 1) {
        // Reset selection state BEFORE changing question
        setSelectedAnswer(null);
        setIsCorrect(null);

        // Prevent focus styling from making the next question look pre-selected
        if (typeof document !== 'undefined') {
          (document.activeElement as HTMLElement | null)?.blur?.();
        }

        setCurrentQuestion((q) => q + 1);
      } else {
        // Play victory sound when quiz completes
        playSound('quizComplete');
        setGameState('result');
      }
    }, delay);
  };

  const getStreakMessage = () => {
    return STREAK_MESSAGES.find(s => s.streak === streak) || STREAK_MESSAGES[STREAK_MESSAGES.length - 1];
  };
  const question = shuffledQuestions[currentQuestion];
  const progress = shuffledQuestions.length > 0 ? ((currentQuestion + 1) / shuffledQuestions.length) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageMeta
        title="Wealth Quiz"
        description="Think you know how fast billionaires make money? Test your mogul IQ with our wealth quiz!"
        image="/og-quiz.png"
        path="/quiz"
      />
      <Header />

      <main className="flex-1 container py-8 pb-24 md:pb-8">
        <PaywallGate>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Breadcrumb currentPage="Wealth Quiz" />
            <FeaturePromoShare feature="wealthQuiz" size="sm" showLabel />
          </div>
          
          {/* INTRO SCREEN */}
          {gameState === 'intro' && (
            <div className="text-center animate-fade-in">
              {/* Premium Hero */}
              <div className="relative mb-10">
                {/* Background glow */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/15 rounded-full blur-3xl" />
                </div>
                
                <div className="relative h-28 w-28 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/20 to-amber-500/30 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20 border border-primary/20">
                  <Brain className="h-14 w-14 text-primary" />
                  {/* Sparkle accents */}
                  <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-amber-400 animate-pulse" />
                </div>
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <span className="text-lg">🧠</span>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Wealth Quiz</span>
                </div>
                
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                  How Well Do You Know{' '}
                  <span className="gradient-gold-text">The Rich?</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Think you know how fast the ultra-rich make money? Let's find out! 💰
                </p>
              </div>

              <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 mb-8 shadow-xl shadow-primary/5">
                <CardContent className="p-6 md:p-8">
                  <h3 className="font-semibold text-lg mb-6 flex items-center justify-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    How It Works
                  </h3>
                  <div className="grid gap-5 text-left">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0 shadow-lg shadow-primary/10">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <div>
                        <p className="font-semibold">Answer Questions</p>
                        <p className="text-sm text-muted-foreground">Net worth battles, income breakdowns, wealth facts & more!</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-500/10 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
                        <Flame className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-semibold">Build Streaks</p>
                        <p className="text-sm text-muted-foreground">Consecutive correct answers = bonus points!</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
                        <Trophy className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-semibold">Learn Wealth Wisdom</p>
                        <p className="text-sm text-muted-foreground">Discover how the ultra-rich build their fortunes!</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={startQuiz} 
                size="lg" 
                className="h-14 px-12 text-lg bg-gradient-to-r from-primary via-primary to-amber-500 hover:from-primary/90 hover:via-primary/80 hover:to-amber-500/90 shadow-xl shadow-primary/30 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Quiz
              </Button>
            </div>
          )}

          {/* LOADING STATE */}
          {gameState === 'loading' && (
            <div className="text-center animate-fade-in py-16">
              <div className="relative mx-auto mb-6 w-40 h-40">
                <img 
                  src={quizLoadingMogul} 
                  alt="Quiz Mogul thinking" 
                  className="w-full h-full object-contain animate-pulse"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              </div>
              <h2 className="font-serif text-2xl font-bold mb-2">
                Preparing Your Challenge...
              </h2>
              <p className="text-muted-foreground">
                The Mogul is picking the toughest questions 🤔
              </p>
            </div>
          )}

          {/* PLAYING STATE */}
          {gameState === 'playing' && question && (
            <>
              {/* Header Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Score: </span>
                    <span className="font-bold text-primary">{score}</span>
                  </div>
                  {streak >= 2 && (
                    <div className="flex items-center gap-1 text-amber-500 animate-pulse">
                      <Flame className="h-4 w-4" />
                      <span className="text-sm font-bold">{streak}x</span>
                    </div>
                  )}
                </div>
                <div className="text-sm font-mono bg-primary/10 px-3 py-1 rounded-full">
                  <Zap className="h-3 w-3 inline mr-1 text-primary" />
                  {totalPoints} pts
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Question {currentQuestion + 1} of {shuffledQuestions.length}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Streak Message Overlay */}
              {showStreakMessage && streak >= 2 && (
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                  <div className={`text-4xl font-bold animate-scale-in ${getStreakMessage().color}`}>
                    {getStreakMessage().message}
                  </div>
                </div>
              )}

              {/* Question Card */}
              <Card className="border-border/50 bg-card/80 backdrop-blur overflow-hidden">
                <CardContent className="p-6">
                  {/* Celebrity Header - Adaptive for comparison questions */}
                  {question.questionType === 'net_worth_comparison' && question.celebrity2 ? (
                    <div className="flex items-center justify-center gap-4 mb-6 p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <div className="text-center">
                        <span className="text-3xl block mb-1">{question.emoji}</span>
                        <p className="font-bold text-sm text-foreground">{question.celebrity}</p>
                      </div>
                      <span className="text-2xl font-bold text-primary">VS</span>
                      <div className="text-center">
                        <span className="text-3xl block mb-1">{question.emoji2}</span>
                        <p className="font-bold text-sm text-foreground">{question.celebrity2}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <span className="text-4xl">{question.emoji}</span>
                      <div>
                        <p className="font-bold text-lg text-foreground">{question.celebrity}</p>
                        <p className="text-sm text-primary">{question.category}</p>
                      </div>
                    </div>
                  )}

                  {/* Question Text - Adaptive for different question types */}
                  <h2 className="text-xl md:text-2xl font-bold mb-2 text-foreground">
                    {question.questionText ? (
                      question.questionText
                    ) : (
                      <>How long to earn a {question.itemEmoji} <span className="text-primary">{question.itemName}</span>?</>
                    )}
                  </h2>
                  
                  {/* Subtitle - only for time_to_earn with item value */}
                  {question.itemValue && (
                    <p className="text-sm text-muted-foreground mb-6">
                      (Worth {formatLargeCurrency(question.itemValue)})
                    </p>
                  )}
                  
                  {!question.itemValue && <div className="mb-6" />}

                  <div className="grid grid-cols-2 gap-3">
                    {question.options.map((option) => {
                      const correctAnswer = getCorrectAnswer(question);
                      let buttonClass = 'h-auto py-4 text-base font-medium transition-all duration-300 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0';
                      if (selectedAnswer) {
                        if (option === correctAnswer) {
                          buttonClass += ' bg-success/20 border-success text-success scale-105';
                        } else if (option === selectedAnswer && !isCorrect) {
                          buttonClass += ' bg-destructive/20 border-destructive text-destructive scale-95 opacity-60';
                        } else {
                          buttonClass += ' opacity-40';
                        }
                      } else {
                        buttonClass += ' hover:bg-transparent hover:text-foreground [@media(hover:hover)]:hover:border-primary/50 [@media(hover:hover)]:hover:bg-primary/5 [@media(hover:hover)]:hover:scale-[1.02]';
                      }

                      return (
                        <Button
                          key={`${currentQuestion}-${option}`}
                          variant="outline"
                          className={buttonClass}
                          onClick={() => handleAnswer(option)}
                          disabled={!!selectedAnswer}
                        >
                          {option}
                          {selectedAnswer && option === correctAnswer && (
                            <CheckCircle className="ml-2 h-5 w-5" />
                          )}
                          {selectedAnswer && option === selectedAnswer && !isCorrect && (
                            <XCircle className="ml-2 h-5 w-5" />
                          )}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Feedback - Enhanced for educational facts */}
                  {selectedAnswer && (
                    <div className={`mt-5 p-4 rounded-xl animate-fade-in ${isCorrect ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'}`}>
                      <p className={`font-bold text-lg mb-1 ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                        {isCorrect ? '🎉 Correct!' : `❌ Nope! It's ${getCorrectAnswer(question)}`}
                      </p>
                      <p className="text-sm text-foreground/70 mb-2">
                        {question.explanation || question.funFact}
                      </p>
                      {question.educationalFact && (
                        <p className="text-xs text-primary/80 border-t border-border/30 pt-2 mt-2">
                          💡 {question.educationalFact}
                        </p>
                      )}
                      {isCorrect && streak >= 2 && (
                        <p className="text-sm text-amber-400 mt-2 font-medium">
                          🔥 {streak}x streak bonus: +{100 * Math.min(streak, 5)} pts!
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* RESULTS SCREEN */}
          {gameState === 'result' && (
            <div className="animate-fade-in space-y-4">
              {/* Results Card - Capturable for sharing */}
              <div ref={resultsCardRef}>
                <Card className="border-2 border-primary/40 bg-[#0a0a0f] overflow-hidden shadow-2xl">
                  <CardContent className="p-6 md:p-8 text-center">
                    {/* Header Badge */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Brain className="h-5 w-5 text-primary" />
                      <span className="text-primary font-semibold text-sm tracking-wide uppercase">Wealth Quiz Results</span>
                    </div>

                    {/* Result Badge */}
                    <div className="relative mb-5">
                      <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-primary via-amber-500 to-primary flex items-center justify-center mx-auto shadow-lg shadow-primary/30">
                        <span className="text-4xl md:text-5xl">{getResultTitle().emoji}</span>
                      </div>
                      {score === shuffledQuestions.length && (
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                          <Crown className="h-7 w-7 text-amber-400 animate-pulse drop-shadow-lg" />
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-primary font-semibold mb-1 uppercase tracking-wider">You are a...</p>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-primary leading-tight px-2">
                      {getResultTitle().title}
                    </h2>
                    <p className="text-sm text-gray-300 mb-5 px-4 leading-relaxed">{getResultTitle().desc}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="p-3 md:p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
                        <p className="text-2xl md:text-3xl font-bold text-primary">{score}/{shuffledQuestions.length}</p>
                        <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-wide">Correct</p>
                      </div>
                      <div className="p-3 md:p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30">
                        <p className="text-2xl md:text-3xl font-bold text-amber-400">{totalPoints}</p>
                        <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-wide">Points</p>
                      </div>
                    </div>

                    {/* Branding Footer */}
                    <div className="text-center pt-3 border-t border-gray-700">
                      <p className="text-gray-500 text-xs font-medium">💎 earningsexplorer.shop</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 justify-center">
                <ShareMenuDropdown
                  isGeneratingImage={isGeneratingImage}
                  onTextShare={handleTextShare}
                  onWhatsAppShare={handleWhatsAppShare}
                  onTwitterShare={handleTwitterShare}
                  onFacebookShare={handleFacebookShare}
                  onLinkedInShare={handleLinkedInShare}
                  onInstagramShare={handleInstagramShare}
                  onTikTokShare={handleTikTokShare}
                  onSaveImage={handleSaveImage}
                  onCopyLink={handleCopyLink}
                  buttonText="Share Results"
                />
                <Button onClick={startQuiz} variant="outline" size="lg" className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
              </div>

              <div className="pt-4 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Want to explore more wealth comparisons?
                </p>
                <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                  <Sparkles className="h-4 w-4" />
                  Browse Celebrity Profiles
                </Link>
              </div>
            </div>
          )}
        </div>
        </PaywallGate>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Quiz;
