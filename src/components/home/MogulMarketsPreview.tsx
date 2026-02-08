import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, TrendingUp, TrendingDown, ChevronRight, DollarSign, MessageCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PremiumShareIconButton from '@/components/share/PremiumShareIconButton';
import { useTradingPortfolio } from '@/hooks/useTradingPortfolio';
import { formatCurrency } from '@/lib/earnings';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  TwitterIcon,
  FacebookIcon,
  WhatsAppIcon,
  LinkedInIcon,
  InstagramIcon,
  TikTokIcon,
} from '@/components/share/ShareMenuDropdown';

const TRENDING_TICKERS = [
  { symbol: 'AAPL', name: 'Apple', change: 2.4 },
  { symbol: 'TSLA', name: 'Tesla', change: -1.2 },
  { symbol: 'NVDA', name: 'NVIDIA', change: 5.1 },
  { symbol: 'META', name: 'Meta', change: 1.8 },
];

const SITE_URL = "https://earningsexplorer.shop";

const MogulMarketsPreview = () => {
  const { portfolio, isLoading } = useTradingPortfolio();
  
  const portfolioValue = portfolio?.positions?.reduce((total, pos) => {
    const currentPrice = pos.current_price || pos.avg_cost_per_share;
    return total + (pos.shares * currentPrice);
  }, 0) || 0;
  
  const totalValue = (portfolio?.cash_balance || 10000) + portfolioValue;
  const totalGainLoss = totalValue - 10000; // Starting amount
  const hasActivity = portfolio && (portfolio.positions?.length > 0 || portfolio.orders?.length > 0);

  const shareText = `📈 Paper trading on Mogul Markets!\n\n${hasActivity ? `💰 Portfolio: ${formatCurrency(totalValue)}\n📊 P&L: ${totalGainLoss >= 0 ? '+' : ''}${formatCurrency(totalGainLoss)}` : '💵 Start with $10,000 in paper money'}\n\n🔥 Trade risk-free at ${SITE_URL}/mogul-markets`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mogul Markets',
          text: shareText,
          url: `${SITE_URL}/mogul-markets`,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyText();
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/mogul-markets`)}&quote=${encodeURIComponent('📈 Paper trading on Mogul Markets!')}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${SITE_URL}/mogul-markets`)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleInstagramShare = () => {
    handleCopyText();
    toast.success('Text copied! Open Instagram and paste in your story or post.');
  };

  const handleTikTokShare = () => {
    handleCopyText();
    toast.success('Text copied! Open TikTok and paste in your video caption.');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-amber-500/5 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crown className="h-5 w-5 text-primary" />
            <span className="font-serif">Mogul <span className="gradient-gold-text">Markets</span></span>
            <Badge variant="outline" className="border-primary/30 text-primary text-xs animate-pulse">
              NEW
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-muted-foreground hidden sm:inline">Live</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <PremiumShareIconButton iconOnly />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
                  <MessageCircle className="h-4 w-4" />
                  <span className="ml-2">Text / Message</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer">
                  <WhatsAppIcon />
                  <span className="ml-2">WhatsApp</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTwitterShare} className="cursor-pointer">
                  <TwitterIcon />
                  <span className="ml-2">X (Twitter)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFacebookShare} className="cursor-pointer">
                  <FacebookIcon />
                  <span className="ml-2">Facebook</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLinkedInShare} className="cursor-pointer">
                  <LinkedInIcon />
                  <span className="ml-2">LinkedIn</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleInstagramShare} className="cursor-pointer">
                  <InstagramIcon />
                  <span className="ml-2">Instagram</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTikTokShare} className="cursor-pointer">
                  <TikTokIcon />
                  <span className="ml-2">TikTok</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyText} className="cursor-pointer">
                  <Copy className="h-4 w-4" />
                  <span className="ml-2">Copy Text</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Paper trade stocks risk-free</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini Ticker */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TRENDING_TICKERS.map((ticker) => (
            <div 
              key={ticker.symbol}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-border/50 whitespace-nowrap"
            >
              <span className="font-mono font-semibold text-sm">{ticker.symbol}</span>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${
                ticker.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {ticker.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {ticker.change >= 0 ? '+' : ''}{ticker.change}%
              </span>
            </div>
          ))}
        </div>

        {/* Portfolio Preview or CTA */}
        {!isLoading && hasActivity ? (
          <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Your Portfolio</p>
                <p className="text-xl font-bold font-mono">{formatCurrency(totalValue)}</p>
              </div>
              <div className={`text-right ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <p className="text-xs">P&L</p>
                <p className="font-semibold">
                  {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {portfolio?.positions?.length || 0} positions • {portfolio?.orders?.length || 0} trades
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-amber-500/5 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Start with $10,000</p>
                <p className="text-xs text-muted-foreground">Paper money to practice trading</p>
              </div>
            </div>
          </div>
        )}
        
        <Link to="/mogul-markets">
          <Button className="w-full gap-2 bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90">
            <span>{hasActivity ? 'Continue Trading' : 'Start Trading'}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default MogulMarketsPreview;
