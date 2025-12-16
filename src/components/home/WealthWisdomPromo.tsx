import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

const WealthWisdomPromo = () => {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-amber-500/10 overflow-hidden relative">
      <div className="absolute top-4 right-4 text-4xl opacity-30">📚</div>
      <CardContent className="p-6">
        <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">
          <Sparkles className="h-3 w-3 mr-1" />
          New Weekly Stories
        </Badge>
        
        <h3 className="font-serif text-xl font-bold mb-2">
          Wealth Wisdom Blog
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4">
          Inspiring rags-to-riches stories. Real lessons from billionaires who started with nothing.
        </p>
        
        <Link to="/wealth-wisdom">
          <Button className="w-full group">
            <BookOpen className="h-4 w-4 mr-2" />
            Read This Week's Story
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default WealthWisdomPromo;