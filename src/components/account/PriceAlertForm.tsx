
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Game, TicketCategory } from '@/lib/types';
import { createPriceAlert } from '@/utils/api/alerts';
import { fetchTicketCategories } from '@/utils/api/ticket/categories';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface PriceAlertFormProps {
  userId: string;
  onAlertCreated: () => void;
  trackedGames?: Game[];
  game?: Game;
}

export function PriceAlertForm({ userId, onAlertCreated, trackedGames, game }: PriceAlertFormProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(game || null);
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load ticket categories
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchTicketCategories();
      setCategories(data);
    };
    
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGame) {
      toast({
        title: "No game selected",
        description: "Please select a game for your price alert",
        variant: "destructive"
      });
      return;
    }
    
    if (!targetPrice || parseFloat(targetPrice) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid target price",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await createPriceAlert(
        userId,
        selectedGame.id,
        parseFloat(targetPrice),
        categoryId || undefined
      );
      
      if (success) {
        setTargetPrice('');
        setCategoryId('');
        onAlertCreated();
      }
    } catch (error) {
      console.error('Error creating alert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Create Price Alert</h3>
        <p className="text-sm text-muted-foreground">
          Get notified when tickets drop below your target price.
        </p>
      </div>
      
      {!game && trackedGames && (
        <div className="space-y-2">
          <Label htmlFor="game">Select Game</Label>
          <Select 
            value={selectedGame?.id} 
            onValueChange={(gameId) => {
              const game = trackedGames.find(g => g.id === gameId);
              setSelectedGame(game || null);
            }}
          >
            <SelectTrigger id="game">
              <SelectValue placeholder="Choose a game" />
            </SelectTrigger>
            <SelectContent>
              {trackedGames.map((game) => (
                <SelectItem key={game.id} value={game.id}>
                  {game.homeTeam.name} vs {game.awayTeam.name} ({game.date})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="price">Target Price</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-muted-foreground">$</span>
          </div>
          <Input
            id="price"
            type="number"
            min="1"
            step="0.01"
            placeholder="75.00"
            className="pl-7"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Section (Optional)</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Any section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any section</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Limit your alert to a specific seating section, or leave blank to be notified about any section.
        </p>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading || !selectedGame}>
        {isLoading ? 'Creating Alert...' : 'Create Alert'}
      </Button>
    </form>
  );
}
