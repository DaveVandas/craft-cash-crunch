import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, ChevronRight, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SideHustle {
  name: string;
  emoji: string;
  avgBuyPrice: number;
  avgSellPrice: number;
  salesPerMonth: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  category: string;
}

// Top hustles that rotate daily - subset for preview
const PREVIEW_HUSTLES: SideHustle[] = [
  { 
    name: 'Wealth Perspective Affiliate', emoji: '💎', avgBuyPrice: 0, avgSellPrice: 1.5, salesPerMonth: 500, difficulty: 'Easy', 
    description: 'Share our app, get paid per signup!', category: 'digital'
  },
  { 
    name: 'Thrift Flipping', emoji: '🏷️', avgBuyPrice: 5, avgSellPrice: 35, salesPerMonth: 20, difficulty: 'Easy', 
    description: 'Goodwill to gold.', category: 'flipping'
  },
  { 
    name: 'Digital Products', emoji: '💻', avgBuyPrice: 0, avgSellPrice: 29, salesPerMonth: 40, difficulty: 'Medium', 
    description: 'Build once, sell infinitely.', category: 'digital'
  },
  { 
    name: 'Tech Flipping', emoji: '📱', avgBuyPrice: 150, avgSellPrice: 300, salesPerMonth: 6, difficulty: 'Medium', 
    description: 'Phones, laptops, tablets.', category: 'flipping'
  },
  { 
    name: 'Pressure Washing', emoji: '💦', avgBuyPrice: 50, avgSellPrice: 250, salesPerMonth: 8, difficulty: 'Easy', 
    description: 'Clean = cash.', category: 'services'
  },
  { 
    name: 'UGC Content Creator', emoji: '📲', avgBuyPrice: 0, avgSellPrice: 200, salesPerMonth: 8, difficulty: 'Medium', 
    description: 'Create TikTok-style ads.', category: 'digital'
  },
];

const SideHustlePreview = () => {
  // Rotate which hustles show based on day (after affiliate which is always first)
  const dayOfYear = Math.floor(Date.now() / 86400000);
  const rotatedHustles = [
    PREVIEW_HUSTLES[0], // Keep affiliate first
    ...PREVIEW_HUSTLES.slice(1).sort((a, b) => {
      const hashA = (a.name.charCodeAt(0) + dayOfYear) % 100;
      const hashB = (b.name.charCodeAt(0) + dayOfYear) % 100;
      return hashA - hashB;
    }).slice(0, 3)
  ];

  const formatProfit = (hustle: SideHustle) => {
    const profit = (hustle.avgSellPrice - hustle.avgBuyPrice) * hustle.salesPerMonth;
    return profit >= 1000 ? `$${(profit / 1000).toFixed(1)}k` : `$${profit.toFixed(0)}`;
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-emerald-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Rocket className="h-5 w-5 text-emerald-500" />
            <span className="font-serif">Side Hustle Ideas</span>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 text-xs">
              <Flame className="h-3 w-3 mr-1" />
              Hot
            </Badge>
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">Quick ways to stack cash on the side</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {rotatedHustles.map((hustle) => (
            <Link 
              key={hustle.name}
              to="/side-hustle"
              className="p-3 rounded-lg border border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-start gap-2">
                <span className="text-2xl">{hustle.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {hustle.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{hustle.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] px-1.5 py-0 ${
                        hustle.difficulty === 'Easy' ? 'border-green-500/30 text-green-500' :
                        hustle.difficulty === 'Medium' ? 'border-amber-500/30 text-amber-500' : 
                        'border-red-500/30 text-red-500'
                      }`}
                    >
                      {hustle.difficulty}
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-500">
                      {formatProfit(hustle)}/mo
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <Link to="/side-hustle">
          <Button variant="outline" className="w-full gap-2 border-primary/30 hover:border-primary hover:bg-primary/5">
            <span>Explore All 30+ Hustles</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SideHustlePreview;
