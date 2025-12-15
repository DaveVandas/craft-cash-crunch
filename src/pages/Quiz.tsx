import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Trophy, Share2, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { formatLargeCurrency } from '@/lib/earnings';

interface QuizQuestion {
  celebrity: string;
  slug: string;
  category: string;
  correctTime: string;
  options: string[];
  itemName: string;
  itemValue: number;
  annualEarnings: number;
}

// Pre-defined quiz questions
const quizQuestions: QuizQuestion[] = [
  {
    celebrity: 'Elon Musk',
    slug: 'elon-musk',
    category: 'Tech',
    correctTime: '12 minutes',
    options: ['12 minutes', '2 hours', '1 day', '1 week'],
    itemName: 'Tesla Model 3',
    itemValue: 40000,
    annualEarnings: 2000000000,
  },
  {
    celebrity: 'Taylor Swift',
    slug: 'taylor-swift',
    category: 'Music',
    correctTime: '3 hours',
    options: ['15 minutes', '3 hours', '1 day', '3 days'],
    itemName: 'Luxury Rolex',
    itemValue: 15000,
    annualEarnings: 185000000,
  },
  {
    celebrity: 'LeBron James',
    slug: 'lebron-james',
    category: 'Sports',
    correctTime: '45 minutes',
    options: ['10 minutes', '45 minutes', '4 hours', '1 day'],
    itemName: 'iPhone 15 Pro Max',
    itemValue: 1200,
    annualEarnings: 120000000,
  },
  {
    celebrity: 'Jeff Bezos',
    slug: 'jeff-bezos',
    category: 'Tech',
    correctTime: '8 seconds',
    options: ['8 seconds', '2 minutes', '30 minutes', '2 hours'],
    itemName: 'Average monthly rent',
    itemValue: 2000,
    annualEarnings: 8500000000,
  },
  {
    celebrity: 'Beyoncé',
    slug: 'beyonce',
    category: 'Music',
    correctTime: '2 hours',
    options: ['30 minutes', '2 hours', '8 hours', '2 days'],
    itemName: 'Designer handbag',
    itemValue: 5000,
    annualEarnings: 80000000,
  },
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    // Shuffle questions on mount
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledQuestions(shuffled);
  }, []);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Already answered

    setSelectedAnswer(answer);
    const correct = answer === shuffledQuestions[currentQuestion].correctTime;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const getScoreMessage = () => {
    const percentage = (score / shuffledQuestions.length) * 100;
    if (percentage === 100) return "Perfect! You're a wealth wizard! 🧙‍♂️";
    if (percentage >= 80) return "Impressive! You know your billionaires! 💰";
    if (percentage >= 60) return "Not bad! Keep exploring wealth facts! 📈";
    if (percentage >= 40) return "Room for improvement! Try again! 🎯";
    return "The wealth gap is shocking, isn't it? 😱";
  };

  const handleShare = async () => {
    const shareText = `I scored ${score}/${shuffledQuestions.length} on the Wealth Perspective Quiz! 💰 Can you beat my score?`;
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

  if (shuffledQuestions.length === 0) {
    return null; // Loading
  }

  const question = shuffledQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          {!showResult ? (
            <>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Question {currentQuestion + 1} of {shuffledQuestions.length}</span>
                  <span>Score: {score}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question Card */}
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{question.category}</span>
                  </div>

                  <h2 className="font-serif text-xl md:text-2xl font-bold mb-6">
                    How long does it take <span className="text-primary">{question.celebrity}</span> to earn enough for a{' '}
                    <span className="text-primary">{question.itemName}</span>?
                  </h2>

                  <p className="text-sm text-muted-foreground mb-6">
                    ({question.itemName} costs {formatLargeCurrency(question.itemValue)})
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {question.options.map((option) => {
                      let buttonClass = 'h-auto py-4 text-base';
                      if (selectedAnswer) {
                        if (option === question.correctTime) {
                          buttonClass += ' bg-green-500/20 border-green-500 text-green-500';
                        } else if (option === selectedAnswer && !isCorrect) {
                          buttonClass += ' bg-red-500/20 border-red-500 text-red-500';
                        }
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
                            <CheckCircle className="ml-2 h-4 w-4" />
                          )}
                          {selectedAnswer && option === selectedAnswer && !isCorrect && (
                            <XCircle className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      );
                    })}
                  </div>

                  {selectedAnswer && (
                    <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      <p className={`font-medium ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                        {isCorrect ? 'Correct! 🎉' : `Wrong! The answer was ${question.correctTime}`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            /* Results Card */
            <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5">
              <CardContent className="p-8 text-center">
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>

                <h2 className="font-serif text-3xl font-bold mb-2">Quiz Complete!</h2>
                
                <div className="text-5xl font-bold gradient-gold-text my-6">
                  {score}/{shuffledQuestions.length}
                </div>

                <p className="text-lg text-muted-foreground mb-6">
                  {getScoreMessage()}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={restartQuiz} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Play Again
                  </Button>
                  <Button onClick={handleShare} className="bg-primary hover:bg-primary/90">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Results
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Want to explore more wealth comparisons?
                  </p>
                  <Link to="/" className="text-primary hover:underline text-sm font-medium">
                    Browse Celebrity Profiles →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Quiz;
