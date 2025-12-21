import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaywallGate from '@/components/paywall/PaywallGate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wrench, 
  Zap, 
  Droplets, 
  Flame, 
  HardHat, 
  Factory, 
  Car, 
  Cpu,
  TrendingUp,
  GraduationCap,
  DollarSign,
  Clock,
  Wallet,
  Target,
  Crown,
  Rocket,
  ChevronRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { formatCurrency, formatCompactCurrency } from '@/lib/earnings';

interface TradeData {
  name: string;
  icon: React.ElementType;
  color: string;
  apprenticeWage: number;
  journeymanWage: number;
  masterWage: number;
  apprenticeshipYears: number;
  description: string;
  demandLevel: 'High' | 'Very High' | 'Extreme';
  growthRate: number;
}

const TRADES: TradeData[] = [
  {
    name: 'Electrician',
    icon: Zap,
    color: 'text-yellow-400',
    apprenticeWage: 38000,
    journeymanWage: 65000,
    masterWage: 95000,
    apprenticeshipYears: 4,
    description: 'Power the world. Residential to industrial.',
    demandLevel: 'Extreme',
    growthRate: 9
  },
  {
    name: 'Plumber',
    icon: Droplets,
    color: 'text-blue-400',
    apprenticeWage: 36000,
    journeymanWage: 62000,
    masterWage: 90000,
    apprenticeshipYears: 4,
    description: 'Essential service. Recession-proof.',
    demandLevel: 'Very High',
    growthRate: 5
  },
  {
    name: 'HVAC Technician',
    icon: Flame,
    color: 'text-orange-400',
    apprenticeWage: 35000,
    journeymanWage: 58000,
    masterWage: 85000,
    apprenticeshipYears: 3,
    description: 'Climate control specialist. Year-round demand.',
    demandLevel: 'Extreme',
    growthRate: 13
  },
  {
    name: 'Welder',
    icon: Factory,
    color: 'text-red-400',
    apprenticeWage: 34000,
    journeymanWage: 55000,
    masterWage: 80000,
    apprenticeshipYears: 3,
    description: 'Create with fire. Industrial to artistic.',
    demandLevel: 'High',
    growthRate: 4
  },
  {
    name: 'Carpenter',
    icon: HardHat,
    color: 'text-amber-500',
    apprenticeWage: 32000,
    journeymanWage: 52000,
    masterWage: 75000,
    apprenticeshipYears: 4,
    description: 'Build the future. Residential to commercial.',
    demandLevel: 'High',
    growthRate: 2
  },
  {
    name: 'Auto Mechanic',
    icon: Car,
    color: 'text-emerald-400',
    apprenticeWage: 30000,
    journeymanWage: 50000,
    masterWage: 72000,
    apprenticeshipYears: 2,
    description: 'Keep America moving. EV specialization rising.',
    demandLevel: 'High',
    growthRate: 4
  },
  {
    name: 'Industrial Mechanic',
    icon: Wrench,
    color: 'text-purple-400',
    apprenticeWage: 40000,
    journeymanWage: 68000,
    masterWage: 98000,
    apprenticeshipYears: 4,
    description: 'Factory automation. High-tech machinery.',
    demandLevel: 'Very High',
    growthRate: 16
  },
  {
    name: 'IT Technician',
    icon: Cpu,
    color: 'text-cyan-400',
    apprenticeWage: 42000,
    journeymanWage: 70000,
    masterWage: 105000,
    apprenticeshipYears: 2,
    description: 'Network and systems. No degree required.',
    demandLevel: 'Extreme',
    growthRate: 22
  }
];

const COLLEGE_COSTS = {
  avgTuitionPerYear: 25000,
  avgRoomBoard: 12000,
  avgBooks: 1200,
  avgYears: 4,
  avgStartingSalary: 55000,
  avgDebt: 35000,
  debtInterestRate: 6.8
};

const INSPIRATIONAL_QUOTES = [
  { quote: "The trades built this country. They'll build your wealth too.", author: "Mike Rowe" },
  { quote: "College is the most expensive alarm clock in the world.", author: "Unknown" },
  { quote: "While they're paying off debt, you're building equity.", author: "Dave Ramsey" },
  { quote: "A degree doesn't guarantee success. Skills do.", author: "Gary Vaynerchuk" },
  { quote: "The demand for skilled trades will never go away.", author: "Warren Buffett" },
  { quote: "Work with your hands, build with your mind, profit with both.", author: "Unknown" }
];

const Trades = () => {
  const [selectedTrade, setSelectedTrade] = useState<TradeData>(TRADES[0]);
  const [investmentPercent, setInvestmentPercent] = useState(15);
  const [yearsToProject, setYearsToProject] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [displayedQuote] = useState(() => INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate career progression for trades
  const tradeProgression = useMemo(() => {
    const years = [];
    let totalEarned = 0;
    let totalInvested = 0;
    let investmentValue = 0;
    
    for (let year = 1; year <= yearsToProject; year++) {
      let salary: number;
      let stage: string;
      
      if (year <= selectedTrade.apprenticeshipYears) {
        salary = selectedTrade.apprenticeWage + (year - 1) * 2000;
        stage = 'Apprentice';
      } else if (year <= selectedTrade.apprenticeshipYears + 5) {
        salary = selectedTrade.journeymanWage + (year - selectedTrade.apprenticeshipYears - 1) * 3000;
        stage = 'Journeyman';
      } else {
        salary = selectedTrade.masterWage + (year - selectedTrade.apprenticeshipYears - 6) * 2000;
        stage = 'Master';
      }
      
      totalEarned += salary;
      const yearlyInvestment = salary * (investmentPercent / 100);
      totalInvested += yearlyInvestment;
      investmentValue = (investmentValue + yearlyInvestment) * (1 + annualReturn / 100);
      
      years.push({
        year,
        age: 18 + year - 1,
        salary,
        stage,
        totalEarned,
        totalInvested,
        investmentValue
      });
    }
    
    return years;
  }, [selectedTrade, investmentPercent, yearsToProject, annualReturn]);

  // Calculate college path for comparison
  const collegeProgression = useMemo(() => {
    const years = [];
    let totalEarned = 0;
    let totalInvested = 0;
    let investmentValue = 0;
    let debt = COLLEGE_COSTS.avgDebt;
    
    for (let year = 1; year <= yearsToProject; year++) {
      let salary: number;
      let stage: string;
      
      if (year <= COLLEGE_COSTS.avgYears) {
        // In college - no income, accumulating debt
        salary = 0;
        stage = 'College Student';
        debt += (COLLEGE_COSTS.avgTuitionPerYear + COLLEGE_COSTS.avgRoomBoard + COLLEGE_COSTS.avgBooks);
      } else {
        // Working after college
        const yearsWorking = year - COLLEGE_COSTS.avgYears;
        salary = COLLEGE_COSTS.avgStartingSalary * Math.pow(1.03, yearsWorking - 1);
        stage = yearsWorking <= 3 ? 'Entry Level' : yearsWorking <= 8 ? 'Mid-Level' : 'Senior';
        
        // Pay down debt first
        if (debt > 0) {
          const debtPayment = Math.min(salary * 0.1, debt);
          debt = debt * (1 + COLLEGE_COSTS.debtInterestRate / 100) - debtPayment;
          salary -= debtPayment;
        }
      }
      
      totalEarned += Math.max(0, salary);
      const yearlyInvestment = Math.max(0, salary) * (investmentPercent / 100);
      totalInvested += yearlyInvestment;
      investmentValue = (investmentValue + yearlyInvestment) * (1 + annualReturn / 100);
      
      years.push({
        year,
        age: 18 + year - 1,
        salary: Math.max(0, salary),
        stage,
        totalEarned,
        totalInvested,
        investmentValue,
        remainingDebt: Math.max(0, debt)
      });
    }
    
    return years;
  }, [investmentPercent, yearsToProject, annualReturn]);

  const finalTradeData = tradeProgression[tradeProgression.length - 1];
  const finalCollegeData = collegeProgression[collegeProgression.length - 1];
  const wealthAdvantage = finalTradeData.investmentValue - finalCollegeData.investmentValue;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-10 md:py-12">
        <PaywallGate>
          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <Crown className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">The Mogul Path</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Who Needs <span className="gradient-gold-text">College?</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed mb-6">
              Skip the debt. Master a trade. Start investing at 18 while your peers are cramming for finals. 
              <span className="text-primary font-semibold"> The math doesn&apos;t lie.</span>
            </p>
            
            {/* Inspirational Quote */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 max-w-xl mx-auto">
              <p className="text-base md:text-lg italic text-foreground/90">&quot;{displayedQuote.quote}&quot;</p>
              <p className="text-sm text-muted-foreground mt-2">— {displayedQuote.author}</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* Trade Selector */}
            <Card className="border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Wrench className="h-6 w-6 text-primary" />
                  Choose Your Trade
                </CardTitle>
                <CardDescription className="text-base">
                  Real wages. Real progression. Real wealth building.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TRADES.map((trade) => {
                    const Icon = trade.icon;
                    return (
                      <button
                        key={trade.name}
                        onClick={() => setSelectedTrade(trade)}
                        className={`p-4 rounded-xl border text-left transition-all hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02] ${
                          selectedTrade.name === trade.name 
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                            : 'border-border/50 bg-card/50'
                        }`}
                      >
                        <Icon className={`h-8 w-8 mb-2 ${trade.color}`} />
                        <span className="text-sm font-semibold block truncate text-foreground">{trade.name}</span>
                        <span className={`text-xs font-medium ${
                          trade.demandLevel === 'Extreme' ? 'text-red-400' :
                          trade.demandLevel === 'Very High' ? 'text-orange-400' : 'text-green-400'
                        }`}>🔥 {trade.demandLevel} Demand</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Trade Details */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Trade Info Card */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-amber-500/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-card border border-border/50 ${selectedTrade.color}`}>
                      <selectedTrade.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{selectedTrade.name}</CardTitle>
                      <CardDescription className="text-base">{selectedTrade.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Career Progression */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground/70 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Career Progression
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Apprentice (Year 1-{selectedTrade.apprenticeshipYears})</span>
                        </div>
                        <span className="font-bold text-foreground">{formatCurrency(selectedTrade.apprenticeWage)}/yr</span>
                      </div>
                      <div className="flex justify-center">
                        <ChevronRight className="h-5 w-5 text-primary rotate-90" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Journeyman (Year {selectedTrade.apprenticeshipYears + 1}+)</span>
                        </div>
                        <span className="font-bold text-primary">{formatCurrency(selectedTrade.journeymanWage)}/yr</span>
                      </div>
                      <div className="flex justify-center">
                        <ChevronRight className="h-5 w-5 text-primary rotate-90" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold">Master (Year {selectedTrade.apprenticeshipYears + 6}+)</span>
                        </div>
                        <span className="font-bold gradient-gold-text text-lg">{formatCurrency(selectedTrade.masterWage)}/yr</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-card/50 border border-border/30 text-center">
                      <p className="text-xs text-foreground/60 mb-1">Apprenticeship</p>
                      <p className="text-xl font-bold text-foreground">{selectedTrade.apprenticeshipYears} yrs</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/30 text-center">
                      <p className="text-xs text-foreground/60 mb-1">Job Growth</p>
                      <p className="text-xl font-bold text-emerald-400">+{selectedTrade.growthRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Calculator */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-primary" />
                    Compound Your Advantage
                  </CardTitle>
                  <CardDescription>
                    Start at 18, not 22. Four years of early investing = massive advantage.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">Invest {investmentPercent}% of Income</Label>
                    <Slider
                      value={[investmentPercent]}
                      onValueChange={(v) => setInvestmentPercent(v[0])}
                      min={5}
                      max={30}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5%</span>
                      <span>30%</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Project {yearsToProject} Years Forward</Label>
                    <Slider
                      value={[yearsToProject]}
                      onValueChange={(v) => setYearsToProject(v[0])}
                      min={10}
                      max={40}
                      step={5}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>10 yrs</span>
                      <span>40 yrs</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Expected Return: {annualReturn}%</Label>
                    <Slider
                      value={[annualReturn]}
                      onValueChange={(v) => setAnnualReturn(v[0])}
                      min={6}
                      max={12}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>6% (Conservative)</span>
                      <span>12% (Aggressive)</span>
                    </div>
                  </div>

                  {/* Trade Projection */}
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                    <p className="text-xs text-foreground/60 mb-1">Your Investment Portfolio at Age {18 + yearsToProject - 1}</p>
                    <p className="text-3xl font-bold gradient-gold-text">{formatCurrency(finalTradeData.investmentValue)}</p>
                    <p className="text-sm text-foreground/70 mt-1">
                      From {formatCurrency(finalTradeData.totalInvested)} invested
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* College vs Trades Comparison */}
            <Card className="border-2 border-primary/30">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl md:text-3xl">
                  The <span className="gradient-gold-text">Real</span> Comparison
                </CardTitle>
                <CardDescription className="text-base">
                  Same starting age. Same investment rate. Wildly different outcomes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="facts">Hard Facts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Trade Path */}
                      <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-amber-500/10 border border-primary/30">
                        <div className="flex items-center gap-2 mb-4">
                          <Wrench className="h-6 w-6 text-primary" />
                          <h3 className="text-xl font-bold">Trade Path</h3>
                          <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">WINNER</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Start earning at</span>
                            <span className="font-bold">Age 18</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Student debt</span>
                            <span className="font-bold text-emerald-400">$0</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Total earned ({yearsToProject} yrs)</span>
                            <span className="font-bold">{formatCompactCurrency(finalTradeData.totalEarned)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-border/30">
                            <span className="text-foreground/70">Portfolio at {18 + yearsToProject - 1}</span>
                            <span className="font-bold text-xl gradient-gold-text">{formatCurrency(finalTradeData.investmentValue)}</span>
                          </div>
                        </div>
                      </div>

                      {/* College Path */}
                      <div className="p-6 rounded-xl bg-card/50 border border-border/50">
                        <div className="flex items-center gap-2 mb-4">
                          <GraduationCap className="h-6 w-6 text-muted-foreground" />
                          <h3 className="text-xl font-bold text-foreground/70">College Path</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Start earning at</span>
                            <span className="font-bold">Age 22</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Student debt</span>
                            <span className="font-bold text-red-400">~{formatCurrency(COLLEGE_COSTS.avgDebt + (COLLEGE_COSTS.avgTuitionPerYear + COLLEGE_COSTS.avgRoomBoard) * 4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Total earned ({yearsToProject} yrs)</span>
                            <span className="font-bold">{formatCompactCurrency(finalCollegeData.totalEarned)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-border/30">
                            <span className="text-foreground/70">Portfolio at {18 + yearsToProject - 1}</span>
                            <span className="font-bold text-xl">{formatCurrency(finalCollegeData.investmentValue)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Advantage Banner */}
                    <div className="p-6 rounded-xl bg-gradient-to-r from-primary/20 via-amber-500/20 to-primary/20 border border-primary/40 text-center">
                      <p className="text-sm text-foreground/70 mb-2">Your Wealth Advantage Choosing Trades</p>
                      <p className="text-4xl md:text-5xl font-bold gradient-gold-text">
                        +{formatCurrency(Math.max(0, wealthAdvantage))}
                      </p>
                      <p className="text-sm text-foreground/70 mt-2">
                        By age {18 + yearsToProject - 1}, that&apos;s {((wealthAdvantage / finalCollegeData.investmentValue) * 100).toFixed(0)}% more wealth
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="text-left p-3">Age</th>
                            <th className="text-left p-3">Trade Path</th>
                            <th className="text-right p-3">Trade Salary</th>
                            <th className="text-left p-3">College Path</th>
                            <th className="text-right p-3">College Salary</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tradeProgression.slice(0, 15).map((trade, i) => {
                            const college = collegeProgression[i];
                            return (
                              <tr key={trade.year} className="border-b border-border/20 hover:bg-card/50">
                                <td className="p-3 font-semibold">{trade.age}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    trade.stage === 'Apprentice' ? 'bg-blue-500/20 text-blue-400' :
                                    trade.stage === 'Journeyman' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-primary/20 text-primary'
                                  }`}>
                                    {trade.stage}
                                  </span>
                                </td>
                                <td className="p-3 text-right font-mono text-emerald-400">
                                  {formatCurrency(trade.salary)}
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    college.stage === 'College Student' ? 'bg-red-500/20 text-red-400' :
                                    college.stage === 'Entry Level' ? 'bg-gray-500/20 text-gray-400' :
                                    'bg-blue-500/20 text-blue-400'
                                  }`}>
                                    {college.stage}
                                  </span>
                                </td>
                                <td className="p-3 text-right font-mono">
                                  {college.salary > 0 ? formatCurrency(college.salary) : (
                                    <span className="text-red-400">-{formatCurrency(COLLEGE_COSTS.avgTuitionPerYear + COLLEGE_COSTS.avgRoomBoard)}</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Showing first 15 years • Trade workers earn while college students pay
                    </p>
                  </TabsContent>

                  <TabsContent value="facts" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Trade Advantages */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2 text-primary">
                          <CheckCircle2 className="h-5 w-5" />
                          Trade Path Advantages
                        </h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>Earn while you learn - get paid during apprenticeship</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>Zero student debt - start at $0, not -$100K</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>4-year head start on compound interest</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>Job security - trades can&apos;t be outsourced</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>Clear path to six figures without management</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>Start your own business with marketable skills</span>
                          </li>
                        </ul>
                      </div>

                      {/* College Disadvantages */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2 text-red-400">
                          <XCircle className="h-5 w-5" />
                          College Path Drawbacks
                        </h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span>4 years of $0 income + accumulating debt</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span>Average debt: {formatCurrency(COLLEGE_COSTS.avgDebt + (COLLEGE_COSTS.avgTuitionPerYear + COLLEGE_COSTS.avgRoomBoard) * 4)}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span>Interest compounds against you for years</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span>No guarantee of job in your field</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span>Many degrees have poor ROI</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span>Years behind on wealth building</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Line */}
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center mt-6">
                      <p className="text-lg font-semibold">
                        💎 The Bottom Line: <span className="gradient-gold-text">Time in the market beats timing the market.</span>
                      </p>
                      <p className="text-sm text-foreground/70 mt-2">
                        Starting 4 years earlier with zero debt creates a wealth gap that&apos;s nearly impossible to close.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center py-8">
              <p className="text-lg text-foreground/80 mb-4">
                Ready to explore more wealth-building strategies?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                  <a href="/side-hustle">
                    <Rocket className="h-5 w-5 mr-2" />
                    Explore Side Hustles
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="/calculator">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Reality Check Calculator
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </PaywallGate>
      </main>
      
      <Footer />
    </div>
  );
};

export default Trades;
