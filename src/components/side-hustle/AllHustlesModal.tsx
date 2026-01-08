import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';

export interface SideHustle {
  name: string;
  emoji: string;
  avgBuyPrice: number;
  avgSellPrice: number;
  salesPerMonth: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  tips: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

const CATEGORIES: Category[] = [
  { id: 'digital', name: 'Digital & Online', emoji: '💻', description: 'Work from anywhere, scale infinitely' },
  { id: 'flipping', name: 'Product Flipping', emoji: '🔄', description: 'Buy low, sell high' },
  { id: 'services', name: 'Local Services', emoji: '🏠', description: 'In-person work, premium pricing' },
  { id: 'creative', name: 'Creative & Content', emoji: '🎨', description: 'Monetize your creativity' },
  { id: 'passive', name: 'Passive Income', emoji: '💤', description: 'Build once, earn forever' },
];

interface AllHustlesModalProps {
  hustles: SideHustle[];
  onSelectHustle: (hustle: SideHustle) => void;
}

const AllHustlesModal = ({ hustles, onSelectHustle }: AllHustlesModalProps) => {
  const [open, setOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getHustlesByCategory = (categoryId: string) => {
    return hustles.filter(h => h.category === categoryId);
  };

  const handleSelectHustle = (hustle: SideHustle) => {
    onSelectHustle(hustle);
    setOpen(false);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Layers className="h-4 w-4" />
          See All Hustles
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            🚀 All Side Hustles
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            {hustles.length} ways to build your empire. Tap a category to explore.
          </p>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {CATEGORIES.map((category) => {
            const categoryHustles = getHustlesByCategory(category.id);
            const isExpanded = expandedCategory === category.id;
            
            if (categoryHustles.length === 0) return null;

            return (
              <Card key={category.id} className="overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-primary/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{categoryHustles.length} options</span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <CardContent className="pt-0 pb-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-border/50">
                      {categoryHustles.map((hustle) => (
                        <button
                          key={hustle.name}
                          onClick={() => handleSelectHustle(hustle)}
                          className="p-3 rounded-lg border border-border/50 text-left transition-all hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02]"
                        >
                          <span className="text-2xl block mb-1">{hustle.emoji}</span>
                          <span className="text-sm font-medium block truncate text-foreground">{hustle.name}</span>
                          <span className={`text-xs font-medium ${
                            hustle.difficulty === 'Easy' ? 'text-green-500' :
                            hustle.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'
                          }`}>{hustle.difficulty}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllHustlesModal;
