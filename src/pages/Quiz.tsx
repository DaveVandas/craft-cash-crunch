import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Trophy, Share2, RotateCcw, CheckCircle, XCircle, Flame, Zap, Crown, Sparkles, Play } from 'lucide-react';
import { formatLargeCurrency } from '@/lib/earnings';

interface QuizQuestion {
  celebrity: string;
  emoji: string;
  category: string;
  correctTime: string;
  options: string[];
  itemName: string;
  itemEmoji: string;
  itemValue: number;
  annualEarnings: number;
  funFact: string;
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
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [showStreakMessage, setShowStreakMessage] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const startQuiz = () => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setTotalPoints(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameState('playing');
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const correct = answer === shuffledQuestions[currentQuestion].correctTime;
    setIsCorrect(correct);
    
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(score + 1);
      
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
    }

    setTimeout(() => {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setGameState('result');
      }
    }, 2000);
  };

  const getResultTitle = () => {
    const percentage = (score / shuffledQuestions.length) * 100;
    return RESULT_TITLES.find(r => percentage >= r.min && percentage <= r.max) || RESULT_TITLES[0];
  };

  const getStreakMessage = () => {
    return STREAK_MESSAGES.find(s => s.streak === streak) || STREAK_MESSAGES[STREAK_MESSAGES.length - 1];
  };

  const handleShare = async () => {
    const result = getResultTitle();
    const shareText = `🎯 I'm a "${result.title}" ${result.emoji}\n\nScored ${score}/${shuffledQuestions.length} on the Wealth Quiz!\n💰 ${totalPoints} points\n\nCan you beat me?`;
    const shareUrl = window.location.origin + '/quiz';

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Wealth Quiz Results', text: shareText, url: shareUrl });
      } catch (err) {
        console.error('Share error:', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    }
  };

  const question = shuffledQuestions[currentQuestion];
  const progress = shuffledQuestions.length > 0 ? ((currentQuestion + 1) / shuffledQuestions.length) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* INTRO SCREEN */}
          {gameState === 'intro' && (
            <div className="text-center animate-fade-in">
              <div className="mb-8">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/30 to-amber-500/30 flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Brain className="h-12 w-12 text-primary" />
                </div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                  Wealth <span className="gradient-gold-text">Quiz</span>
                </h1>
                <p className="text-lg text-foreground/70 max-w-md mx-auto">
                  Think you know how fast the ultra-rich make money? Let's find out! 💰
                </p>
              </div>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-amber-500/5 mb-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">How It Works</h3>
                  <div className="grid gap-4 text-left">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Guess the time</p>
                        <p className="text-sm text-muted-foreground">How long does it take a celebrity to earn enough for an item?</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                        <Flame className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">Build streaks</p>
                        <p className="text-sm text-muted-foreground">Consecutive correct answers = bonus points!</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <Trophy className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Get your title</p>
                        <p className="text-sm text-muted-foreground">Earn a rank based on your wealth knowledge!</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={startQuiz} size="lg" className="h-14 px-10 text-lg bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90">
                <Play className="mr-2 h-5 w-5" />
                Start Quiz
              </Button>
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
                  {/* Celebrity Header */}
                  <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <span className="text-4xl">{question.emoji}</span>
                    <div>
                      <p className="font-bold text-lg text-foreground">{question.celebrity}</p>
                      <p className="text-sm text-primary">{question.category}</p>
                    </div>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold mb-2 text-foreground">
                    How long to earn a {question.itemEmoji} <span className="text-primary">{question.itemName}</span>?
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    (Worth {formatLargeCurrency(question.itemValue)})
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {question.options.map((option, index) => {
                      let buttonClass = 'h-auto py-4 text-base font-medium transition-all duration-300';
                      if (selectedAnswer) {
                        if (option === question.correctTime) {
                          buttonClass += ' bg-green-500/20 border-green-500 text-green-400 scale-105';
                        } else if (option === selectedAnswer && !isCorrect) {
                          buttonClass += ' bg-red-500/20 border-red-500 text-red-400 scale-95 opacity-60';
                        } else {
                          buttonClass += ' opacity-40';
                        }
                      } else {
                        buttonClass += ' hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02]';
                      }

                      return (
                        <Button
                          key={option}
                          variant="outline"
                          className={buttonClass}
                          onClick={() => handleAnswer(option)}
                          disabled={!!selectedAnswer}
                        >
                          {option}
                          {selectedAnswer && option === question.correctTime && (
                            <CheckCircle className="ml-2 h-5 w-5" />
                          )}
                          {selectedAnswer && option === selectedAnswer && !isCorrect && (
                            <XCircle className="ml-2 h-5 w-5" />
                          )}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Feedback */}
                  {selectedAnswer && (
                    <div className={`mt-5 p-4 rounded-xl animate-fade-in ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                      <p className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? '🎉 Correct!' : `❌ Nope! It's ${question.correctTime}`}
                      </p>
                      <p className="text-sm text-foreground/70">{question.funFact}</p>
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
            <div className="animate-fade-in">
              <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
                <CardContent className="p-8 text-center">
                  {/* Result Badge */}
                  <div className="relative mb-6">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/30 to-amber-500/30 flex items-center justify-center mx-auto">
                      <span className="text-5xl">{getResultTitle().emoji}</span>
                    </div>
                    {score === shuffledQuestions.length && (
                      <div className="absolute -top-2 -right-2 left-0 right-0 mx-auto w-fit">
                        <Crown className="h-8 w-8 text-amber-400 animate-pulse" />
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-primary font-medium mb-2">You are a...</p>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 gradient-gold-text">
                    {getResultTitle().title}
                  </h2>
                  <p className="text-foreground/70 mb-6">{getResultTitle().desc}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <p className="text-3xl font-bold text-primary">{score}/{shuffledQuestions.length}</p>
                      <p className="text-xs text-muted-foreground">Correct Answers</p>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <p className="text-3xl font-bold text-amber-500">{totalPoints}</p>
                      <p className="text-xs text-muted-foreground">Total Points</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={startQuiz} variant="outline" size="lg">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Play Again
                    </Button>
                    <Button onClick={handleShare} size="lg" className="bg-gradient-to-r from-primary to-amber-500">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Results
                    </Button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">
                      Want to explore more wealth comparisons?
                    </p>
                    <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                      <Sparkles className="h-4 w-4" />
                      Browse Celebrity Profiles
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Quiz;
