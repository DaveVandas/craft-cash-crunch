import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

const WealthWisdomPromo = () => {
  return (
    <div className="relative rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-amber-500/5 p-4 md:p-5 overflow-hidden">
      <div className="absolute top-2 right-4 text-3xl opacity-20">📚</div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-serif text-lg font-bold">Wealth Wisdom</h3>
              <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                New
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Weekly rags-to-riches stories from billionaires who started with nothing.
            </p>
          </div>
        </div>
        
        <Link to="/wealth-wisdom" className="shrink-0">
          <Button size="sm" className="group w-full sm:w-auto">
            Read Story
            <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default WealthWisdomPromo;
