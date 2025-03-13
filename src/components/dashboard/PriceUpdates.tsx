
import { Game } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PriceUpdatesProps {
  trackedGames: Game[];
}

export function PriceUpdates({ trackedGames }: PriceUpdatesProps) {
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
              <Badge variant={Math.random() > 0.5 ? "destructive" : "default"}>
                {Math.random() > 0.5 ? "↑ $12" : "↓ $8"}
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
