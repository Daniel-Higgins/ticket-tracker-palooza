
import { useState } from 'react';
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
  game: Game;
  onSuccess: () => void;
}

export function PriceAlertForm({ game, onSuccess }: PriceAlertFormProps) {
  const { user } = useAuth();
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load ticket categories
  useState(() => {
    const loadCategories = async () => {
      const data = await fetchTicketCategories();
      setCategories(data);
    };
    
    loadCategories();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Not signed in",
        description: "You must be signed in to create price alerts",
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
        user.id,
        game.id,
        parseFloat(targetPrice),
        categoryId || undefined
      );
      
      if (success) {
        setTargetPrice('');
        setCategoryId('');
        onSuccess();
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
          Get notified when tickets for {game.homeTeam.name} vs {game.awayTeam.name} drop below your target price.
        </p>
      </div>
      
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
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Alert...' : 'Create Alert'}
      </Button>
    </form>
  );
}
