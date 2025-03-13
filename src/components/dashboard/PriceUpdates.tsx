
import { Game } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

interface PriceUpdate {
  gameId: string;
  priceChange: number;
  timestamp: string;
}

interface PriceUpdatesProps {
  trackedGames: Game[];
}

export function PriceUpdates({ trackedGames }: PriceUpdatesProps) {
  const [priceUpdates, setPriceUpdates] = useState<Record<string, number>>({});

  // Simulate price updates for demonstration purposes
  useEffect(() => {
    if (trackedGames.length === 0) return;
    
    // Generate consistent price updates based on game ID
    const updates: Record<string, number> = {};
    trackedGames.forEach(game => {
      // Using the game ID hash to generate a consistent price change
      const gameIdSum = game.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const priceChange = (gameIdSum % 20) - 10; // Range from -10 to +10
      updates[game.id] = priceChange;
    });
    
    setPriceUpdates(updates);
  }, [trackedGames]);

  if (trackedGames.length === 0) {
    return (
      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-medium mb-4">Recent Price Updates</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No recent price updates to display. Track teams and games to see price changes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 mb-8">
      <h2 className="text-xl font-medium mb-4">Recent Price Updates</h2>
      <div className="space-y-3">
        {trackedGames.slice(0, 3).map(game => (
          <div key={game.id} className="p-3 border border-border rounded-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img src={game.homeTeam.logo || '/placeholder.svg'} alt={game.homeTeam.name} className="w-6 h-6 mr-2" />
                <span>{game.homeTeam.name}</span>
                <span className="mx-2 text-muted-foreground">vs</span>
                <img src={game.awayTeam.logo || '/placeholder.svg'} alt={game.awayTeam.name} className="w-6 h-6 mr-2" />
                <span>{game.awayTeam.name}</span>
              </div>
              <Badge variant={priceUpdates[game.id] > 0 ? "destructive" : "default"}>
                {priceUpdates[game.id] > 0 ? `↑ $${Math.abs(priceUpdates[game.id])}` : `↓ $${Math.abs(priceUpdates[game.id])}`}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {game.date} at {game.time} • {game.venue}
            </div>
          </div>
        ))}
        <div className="text-center pt-2">
          <Button variant="outline" size="sm" className="w-full">View Price History</Button>
        </div>
      </div>
    </div>
  );
}
