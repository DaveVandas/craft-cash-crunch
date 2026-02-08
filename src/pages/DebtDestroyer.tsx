import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import PaywallGate from '@/components/paywall/PaywallGate';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import PageMeta from '@/components/seo/PageMeta';
import FeaturePromoShare from '@/components/share/FeaturePromoShare';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumericInput } from '@/components/ui/numeric-input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Skull,
  Target,
  Flame,
  TrendingDown,
  DollarSign,
  Clock,
  Zap,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Crown,
  Rocket,
  Plus,
  Trash2,
  Calculator
} from 'lucide-react';
import { formatCurrency } from '@/lib/earnings';

interface DebtItem {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

const PRESET_DEBTS = [
  { name: 'Credit Card', balance: 5000, interestRate: 22.99, minimumPayment: 150 },
  { name: 'Car Loan', balance: 18000, interestRate: 6.5, minimumPayment: 350 },
  { name: 'Student Loan', balance: 35000, interestRate: 5.5, minimumPayment: 400 },
  { name: 'Personal Loan', balance: 8000, interestRate: 12, minimumPayment: 200 },
];

const MOTIVATIONAL_QUOTES = [
  { quote: "Debt is the slavery of the free.", author: "Publilius Syrus" },
  { quote: "The borrower is slave to the lender.", author: "Proverbs 22:7" },
  { quote: "Debt is normal. Be weird.", author: "Dave Ramsey" },
  { quote: "Interest works against you or for you. Choose wisely.", author: "Unknown" },
  { quote: "Every dollar of debt destroyed is a dollar of freedom earned.", author: "The Mogul" },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

const DebtDestroyer = () => {
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: generateId(), ...PRESET_DEBTS[0] }
  ]);
  const [extraPayment, setExtraPayment] = useState(200);
  const [displayedQuote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addDebt = (preset?: typeof PRESET_DEBTS[0]) => {
    const newDebt = preset 
      ? { id: generateId(), ...preset }
      : { id: generateId(), name: 'New Debt', balance: 1000, interestRate: 10, minimumPayment: 50 };
    setDebts([...debts, newDebt]);
  };

  const removeDebt = (id: string) => {
    if (debts.length > 1) {
      setDebts(debts.filter(d => d.id !== id));
    }
  };

  const updateDebt = (id: string, field: keyof DebtItem, value: string | number) => {
    setDebts(debts.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  // Calculate minimum payment timeline (paying only minimums)
  const minimumPaymentTimeline = useMemo(() => {
    let totalMonths = 0;
    let totalInterestPaid = 0;
    let totalPaid = 0;
    let hasUnpayableDebt = false;

    debts.forEach(debt => {
      if (debt.balance <= 0 || debt.minimumPayment <= 0) return;
      
      let balance = debt.balance;
      let months = 0;
      let interestPaid = 0;
      const monthlyRate = debt.interestRate / 100 / 12;

      // Check if minimum payment covers at least the interest
      const firstMonthInterest = balance * monthlyRate;
      if (debt.minimumPayment <= firstMonthInterest) {
        hasUnpayableDebt = true;
      }

      while (balance > 0.01 && months < 360) {
        const interest = balance * monthlyRate;
        interestPaid += interest;
        const payment = Math.min(debt.minimumPayment, balance + interest);
        balance = Math.max(0, balance + interest - payment);
        totalPaid += payment;
        months++;
      }

      // If there's still a balance after 360 months, add it to what needs to be paid
      if (balance > 0.01) {
        totalPaid += balance; // Would need to pay off remaining balance eventually
      }

      totalMonths = Math.max(totalMonths, months);
      totalInterestPaid += interestPaid;
    });

    return { months: totalMonths, interestPaid: totalInterestPaid, totalPaid, hasUnpayableDebt };
  }, [debts]);

  // Calculate avalanche method (highest interest first) with extra payment
  const avalancheTimeline = useMemo(() => {
    const debtsCopy = debts.map(d => ({ ...d, currentBalance: d.balance }));
    let months = 0;
    let totalInterestPaid = 0;
    let totalPaid = 0;
    const payoffOrder: string[] = [];
    const monthlyData: { month: number; totalBalance: number; interestPaid: number }[] = [];

    while (debtsCopy.some(d => d.currentBalance > 0) && months < 360) {
      months++;
      let monthInterest = 0;
      let extraAvailable = extraPayment;

      // Apply minimum payments and calculate interest
      debtsCopy.forEach(debt => {
        if (debt.currentBalance > 0) {
          const monthlyRate = debt.interestRate / 100 / 12;
          const interest = debt.currentBalance * monthlyRate;
          monthInterest += interest;
          debt.currentBalance += interest;
          
          const minPayment = Math.min(debt.minimumPayment, debt.currentBalance);
          debt.currentBalance -= minPayment;
          totalPaid += minPayment;
        }
      });

      // Apply extra payment to highest interest debt
      const sortedDebts = [...debtsCopy]
        .filter(d => d.currentBalance > 0)
        .sort((a, b) => b.interestRate - a.interestRate);

      for (const debt of sortedDebts) {
        if (extraAvailable > 0 && debt.currentBalance > 0) {
          const extraApplied = Math.min(extraAvailable, debt.currentBalance);
          debt.currentBalance -= extraApplied;
          extraAvailable -= extraApplied;
          totalPaid += extraApplied;

          if (debt.currentBalance <= 0 && !payoffOrder.includes(debt.name)) {
            payoffOrder.push(debt.name);
          }
        }
      }

      totalInterestPaid += monthInterest;
      
      const totalBalance = debtsCopy.reduce((sum, d) => sum + Math.max(0, d.currentBalance), 0);
      monthlyData.push({ month: months, totalBalance, interestPaid: totalInterestPaid });
    }

    return { months, interestPaid: totalInterestPaid, totalPaid, payoffOrder, monthlyData };
  }, [debts, extraPayment]);

  // Calculate snowball method (lowest balance first) with extra payment
  const snowballTimeline = useMemo(() => {
    const debtsCopy = debts.map(d => ({ ...d, currentBalance: d.balance }));
    let months = 0;
    let totalInterestPaid = 0;
    let totalPaid = 0;
    const payoffOrder: string[] = [];

    while (debtsCopy.some(d => d.currentBalance > 0) && months < 360) {
      months++;
      let extraAvailable = extraPayment;

      // Apply minimum payments and calculate interest
      debtsCopy.forEach(debt => {
        if (debt.currentBalance > 0) {
          const monthlyRate = debt.interestRate / 100 / 12;
          const interest = debt.currentBalance * monthlyRate;
          totalInterestPaid += interest;
          debt.currentBalance += interest;
          
          const minPayment = Math.min(debt.minimumPayment, debt.currentBalance);
          debt.currentBalance -= minPayment;
          totalPaid += minPayment;
        }
      });

      // Apply extra payment to lowest balance debt
      const sortedDebts = [...debtsCopy]
        .filter(d => d.currentBalance > 0)
        .sort((a, b) => a.currentBalance - b.currentBalance);

      for (const debt of sortedDebts) {
        if (extraAvailable > 0 && debt.currentBalance > 0) {
          const extraApplied = Math.min(extraAvailable, debt.currentBalance);
          debt.currentBalance -= extraApplied;
          extraAvailable -= extraApplied;
          totalPaid += extraApplied;

          if (debt.currentBalance <= 0 && !payoffOrder.includes(debt.name)) {
            payoffOrder.push(debt.name);
          }
        }
      }
    }

    return { months, interestPaid: totalInterestPaid, totalPaid, payoffOrder };
  }, [debts, extraPayment]);

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinimumPayments = debts.reduce((sum, d) => sum + d.minimumPayment, 0);
  const interestSaved = minimumPaymentTimeline.interestPaid - avalancheTimeline.interestPaid;
  const monthsSaved = minimumPaymentTimeline.months - avalancheTimeline.months;

  const formatMonths = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${months} months`;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years}y ${remainingMonths}m`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageMeta
        title="Debt Destroyer"
        description="Crush your debt with our calculator. See exactly how much interest you're paying and find your fastest path to freedom!"
        image="/og-debt-destroyer.png"
        path="/debt-destroyer"
      />
      <Header />
      
      <main className="flex-1 container py-10 md:py-12 pb-24 md:pb-12">
        <PaywallGate>
          {/* Breadcrumb with Share */}
          <div className="flex items-center justify-between mb-6 max-w-6xl mx-auto">
            <Breadcrumb currentPage="Debt Destroyer" />
            <FeaturePromoShare feature="debtDestroyer" size="sm" showLabel />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-4">
              <Skull className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Debt Destroyer</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Crush Your <span className="text-red-400">Debt</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed mb-6">
              See exactly how much interest you&apos;re <span className="text-red-400 font-semibold">really paying</span> and 
              how fast you can break free with the right strategy.
            </p>
            
            {/* Motivational Quote */}
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 max-w-xl mx-auto">
              <p className="text-base md:text-lg italic text-foreground/90">&quot;{displayedQuote.quote}&quot;</p>
              <p className="text-sm text-muted-foreground mt-2">— {displayedQuote.author}</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* Debt Input Section */}
            <Card className="border-red-500/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Target className="h-6 w-6 text-red-400" />
                  Your Debts
                </CardTitle>
                <CardDescription className="text-base">
                  Add all your debts to see the full picture.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {debts.map((debt, index) => (
                  <div key={debt.id} className="p-4 rounded-xl bg-card/50 border border-border/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <Input
                        value={debt.name}
                        onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                        className="font-semibold text-lg bg-transparent border-none p-0 h-auto focus-visible:ring-0 max-w-[200px]"
                      />
                      {debts.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDebt(debt.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-foreground/60">Balance</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                          <NumericInput
                            value={debt.balance}
                            onChange={(val) => updateDebt(debt.id, 'balance', val)}
                            className="pl-7"
                            allowDecimals={false}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-foreground/60">Interest Rate (%)</Label>
                        <NumericInput
                          value={debt.interestRate}
                          onChange={(val) => updateDebt(debt.id, 'interestRate', val)}
                          allowDecimals={true}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-foreground/60">Min Payment</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                          <NumericInput
                            value={debt.minimumPayment}
                            onChange={(val) => updateDebt(debt.id, 'minimumPayment', val)}
                            className="pl-7"
                            allowDecimals={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Debt Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => addDebt()} className="border-dashed">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Debt
                  </Button>
                  {PRESET_DEBTS.filter(p => !debts.some(d => d.name === p.name)).slice(0, 3).map(preset => (
                    <Button 
                      key={preset.name} 
                      variant="outline" 
                      size="sm"
                      onClick={() => addDebt(preset)}
                      className="text-xs"
                    >
                      + {preset.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
                <CardContent className="p-6 text-center">
                  <TrendingDown className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-foreground/60 mb-1">Total Debt</p>
                  <p className="text-3xl font-bold text-red-400">{formatCurrency(totalDebt)}</p>
                </CardContent>
              </Card>
              
              <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm text-foreground/60 mb-1">Minimum Payments</p>
                  <p className="text-3xl font-bold text-amber-400">{formatCurrency(totalMinimumPayments)}/mo</p>
                </CardContent>
              </Card>
              
              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-foreground/60 mb-1">Extra Attack</p>
                  <p className="text-3xl font-bold gradient-gold-text">+{formatCurrency(extraPayment)}/mo</p>
                </CardContent>
              </Card>
            </div>

            {/* Extra Payment Slider */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Accelerate Your Freedom
                </CardTitle>
                <CardDescription>
                  How much extra can you throw at your debt each month?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Extra Monthly Payment</Label>
                      <span className="font-bold text-primary">{formatCurrency(extraPayment)}</span>
                    </div>
                    <Slider
                      value={[extraPayment]}
                      onValueChange={(v) => setExtraPayment(v[0])}
                      min={0}
                      max={2000}
                      step={50}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>$0</span>
                      <span>$2,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Comparison */}
            <Card className="border-2 border-primary/30">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl md:text-3xl">
                  The <span className="gradient-gold-text">Mogul</span> Difference
                </CardTitle>
                <CardDescription className="text-base">
                  See what happens when you attack debt strategically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="comparison" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="comparison">Comparison</TabsTrigger>
                    <TabsTrigger value="avalanche">Avalanche</TabsTrigger>
                    <TabsTrigger value="snowball">Snowball</TabsTrigger>
                  </TabsList>

                  <TabsContent value="comparison" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Minimum Payments Path */}
                      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                          <h4 className="font-semibold text-lg">Minimum Payments Only</h4>
                        </div>
                        {minimumPaymentTimeline.hasUnpayableDebt && (
                          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 mb-4">
                            <p className="text-sm text-red-300 font-medium">
                              ⚠️ Warning: Your minimum payment doesn't cover the monthly interest on some debts. 
                              The balance will grow forever!
                            </p>
                          </div>
                        )}
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Time to Freedom:</span>
                            <span className="font-bold text-red-400">
                              {minimumPaymentTimeline.months >= 360 ? '30+ years' : formatMonths(minimumPaymentTimeline.months)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Interest Accrued:</span>
                            <span className="font-bold text-red-400">{formatCurrency(minimumPaymentTimeline.interestPaid)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Total to Pay Off:</span>
                            <span className="font-bold">{formatCurrency(minimumPaymentTimeline.totalPaid)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Avalanche Path */}
                      <div className="p-6 rounded-xl bg-primary/10 border border-primary/30">
                        <div className="flex items-center gap-2 mb-4">
                          <Crown className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold text-lg">Mogul Method (Avalanche)</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Time to Freedom:</span>
                            <span className="font-bold gradient-gold-text">{formatMonths(avalancheTimeline.months)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Total Interest Paid:</span>
                            <span className="font-bold gradient-gold-text">{formatCurrency(avalancheTimeline.interestPaid)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Total Paid:</span>
                            <span className="font-bold">{formatCurrency(avalancheTimeline.totalPaid)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Savings Highlight */}
                    <div className="p-6 rounded-xl bg-gradient-to-r from-primary/20 to-amber-500/20 border border-primary/40 text-center">
                      <h4 className="text-lg font-semibold mb-4">Your Mogul Advantage</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-3xl md:text-4xl font-bold gradient-gold-text">{formatCurrency(interestSaved)}</p>
                          <p className="text-sm text-foreground/70 mt-1">Interest Saved</p>
                        </div>
                        <div>
                          <p className="text-3xl md:text-4xl font-bold gradient-gold-text">{formatMonths(monthsSaved)}</p>
                          <p className="text-sm text-foreground/70 mt-1">Faster Freedom</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="avalanche" className="space-y-6">
                    <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2 mb-4">
                        <Flame className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-lg">Avalanche Method</h4>
                      </div>
                      <p className="text-foreground/70 mb-4">
                        Attack the highest interest rate first. Mathematically optimal—saves the most money.
                      </p>
                      
                      <h5 className="font-semibold mb-3">Payoff Order:</h5>
                      <div className="space-y-2">
                        {avalancheTimeline.payoffOrder.map((name, index) => (
                          <div key={name} className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                              {index + 1}
                            </div>
                            <span className="font-medium">{name}</span>
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 ml-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="snowball" className="space-y-6">
                    <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="h-5 w-5 text-blue-400" />
                        <h4 className="font-semibold text-lg">Snowball Method</h4>
                      </div>
                      <p className="text-foreground/70 mb-4">
                        Attack the smallest balance first. Quick wins build momentum and motivation.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-lg bg-card/50 text-center">
                          <p className="text-2xl font-bold text-blue-400">{formatMonths(snowballTimeline.months)}</p>
                          <p className="text-xs text-foreground/60">Time to Freedom</p>
                        </div>
                        <div className="p-4 rounded-lg bg-card/50 text-center">
                          <p className="text-2xl font-bold text-blue-400">{formatCurrency(snowballTimeline.interestPaid)}</p>
                          <p className="text-xs text-foreground/60">Interest Paid</p>
                        </div>
                      </div>

                      <h5 className="font-semibold mb-3">Payoff Order:</h5>
                      <div className="space-y-2">
                        {snowballTimeline.payoffOrder.map((name, index) => (
                          <div key={name} className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                              {index + 1}
                            </div>
                            <span className="font-medium">{name}</span>
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 ml-auto" />
                          </div>
                        ))}
                      </div>

                      {/* Comparison note */}
                      <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <p className="text-sm text-foreground/80">
                          <strong>Note:</strong> Snowball costs you{' '}
                          <span className="text-amber-400 font-semibold">
                            {formatCurrency(snowballTimeline.interestPaid - avalancheTimeline.interestPaid)}
                          </span>{' '}
                          more in interest vs Avalanche, but the psychological wins can be worth it.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Mogul Tips */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Mogul Debt Destruction Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Attack High Interest First
                    </h4>
                    <p className="text-sm text-foreground/70">
                      Credit cards at 20%+ are bleeding you dry. Every dollar there saves you 20¢ per year.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-emerald-400" />
                      Refinance When Possible
                    </h4>
                    <p className="text-sm text-foreground/70">
                      Dropping from 22% to 12% on a $10K balance saves $1,000/year in interest.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-400" />
                      Sell Something Today
                    </h4>
                    <p className="text-sm text-foreground/70">
                      That stuff collecting dust? Sell it and make a lump-sum payment. Instant progress.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Rocket className="h-4 w-4 text-blue-400" />
                      Stack Your Income
                    </h4>
                    <p className="text-sm text-foreground/70">
                      Every raise, bonus, or side hustle dollar goes to debt. Live like you did last year.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </PaywallGate>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
};

export default DebtDestroyer;
