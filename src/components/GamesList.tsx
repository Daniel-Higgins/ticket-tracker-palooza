
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Calendar, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { fetchTeamGames } from '@/utils/api';
import { Game } from '@/lib/types';
import { TicketPriceCard } from '@/components/TicketPriceCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface GamesListProps {
  teamId: string;
}

export function GamesList({ teamId }: GamesListProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);
  const [includeFees, setIncludeFees] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      const gamesData = await fetchTeamGames(teamId);
      setGames(gamesData);
      
      // Automatically expand the first game if there are games
      if (gamesData.length > 0) {
        setExpandedGameId(gamesData[0].id);
      }
      
      setLoading(false);
    };

    if (teamId) {
      loadGames();
    }
  }, [teamId]);

  const toggleGameExpand = (gameId: string) => {
    setExpandedGameId(expandedGameId === gameId ? null : gameId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  if (loading) {
    return (
      <div className="space-y-6 w-full max-w-4xl mx-auto mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-border/50">
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <h3 className="text-xl font-medium mb-2">No upcoming games found</h3>
        <p className="text-muted-foreground mb-6">
          There are no scheduled games for this team in the near future.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto mt-8">
      <div className="flex justify-end items-center gap-2 px-4">
        <Switch
          id="include-fees"
          checked={includeFees}
          onCheckedChange={setIncludeFees}
        />
        <Label htmlFor="include-fees" className="text-sm">
          Include fees
        </Label>
      </div>
      
      {games.map((game) => (
        <div
          key={game.id}
          className="glass-card overflow-hidden transition-all duration-300 animate-fade-in"
        >
          <div
            className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer"
            onClick={() => toggleGameExpand(game.id)}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(game.date)}</span>
                <span>•</span>
                <span>{game.time}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <img
                    src={game.awayTeam.logo}
                    alt={game.awayTeam.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="font-medium ml-2">{game.awayTeam.shortName}</span>
                </div>
                
                <span className="text-muted-foreground">@</span>
                
                <div className="flex items-center">
                  <img
                    src={game.homeTeam.logo}
                    alt={game.homeTeam.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="font-medium ml-2">{game.homeTeam.shortName}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <MapPin className="h-4 w-4" />
                <span>{game.venue}</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full p-2 mt-4 sm:mt-0"
            >
              {expandedGameId === game.id ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          {expandedGameId === game.id && (
            <div className="border-t border-border/50 p-4 sm:p-6 animate-slide-up">
              <TicketPriceCard 
                gameId={game.id} 
                includeFees={includeFees} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
