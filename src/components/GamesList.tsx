
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
import { trackGame, untrackGame, isGameTracked } from '@/utils/api/user/trackedGames';
import { toast } from '@/hooks/use-toast';

interface GamesListProps {
  teamId?: string;
  games?: Game[];
  showTrackOption?: boolean;
  userId?: string;
  onTrackToggle?: () => Promise<void>;
}

export function GamesList({ teamId, games: propGames, showTrackOption, userId, onTrackToggle }: GamesListProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);
  const [includeFees, setIncludeFees] = useState(true);
  const [trackedGameIds, setTrackedGameIds] = useState<Set<string>>(new Set());
  const [trackingLoading, setTrackingLoading] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      
      // If games are provided as props, use those
      if (propGames && propGames.length > 0) {
        setGames(propGames);
        
        // Automatically expand the first game if there are games
        if (propGames.length > 0) {
          setExpandedGameId(propGames[0].id);
        }
        
        setLoading(false);
        return;
      }
      
      // Otherwise load games by team ID
      if (teamId) {
        const gamesData = await fetchTeamGames(teamId);
        setGames(gamesData);
        
        // Automatically expand the first game if there are games
        if (gamesData.length > 0) {
          setExpandedGameId(gamesData[0].id);
        }
      }
      
      setLoading(false);
    };

    loadGames();
  }, [teamId, propGames]);

  // Load tracked game status
  useEffect(() => {
    const loadTrackedGames = async () => {
      if (!showTrackOption || !userId) return;

      const tracked = new Set<string>();
      
      // Check tracked status for each game
      for (const game of games) {
        const isTracked = await isGameTracked(userId, game.id);
        if (isTracked) {
          tracked.add(game.id);
        }
      }
      
      setTrackedGameIds(tracked);
    };
    
    loadTrackedGames();
  }, [showTrackOption, userId, games]);

  const toggleGameExpand = (gameId: string) => {
    setExpandedGameId(expandedGameId === gameId ? null : gameId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const handleTrackToggle = async (gameId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to track games",
        variant: "destructive"
      });
      return;
    }
    
    setTrackingLoading(gameId);
    
    try {
      const isCurrentlyTracked = trackedGameIds.has(gameId);
      let success;
      
      if (isCurrentlyTracked) {
        success = await untrackGame(userId, gameId);
        if (success) {
          const newTracked = new Set(trackedGameIds);
          newTracked.delete(gameId);
          setTrackedGameIds(newTracked);
        }
      } else {
        success = await trackGame(userId, gameId);
        if (success) {
          const newTracked = new Set(trackedGameIds);
          newTracked.add(gameId);
          setTrackedGameIds(newTracked);
        }
      }
      
      // Call the onTrackToggle callback if provided
      if (success && onTrackToggle) {
        await onTrackToggle();
      }
    } catch (error) {
      console.error('Error toggling game tracking:', error);
      toast({
        title: "Error",
        description: "Failed to update tracking status",
        variant: "destructive"
      });
    } finally {
      setTrackingLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 w-full max-w-4xl mx-auto mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-border/50 bg-white">
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white">
        <h3 className="text-xl font-medium mb-2 text-gray-900">No upcoming games found</h3>
        <p className="text-gray-600 mb-6">
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
        <Label htmlFor="include-fees" className="text-sm text-gray-800">
          Include fees
        </Label>
      </div>
      
      {games.map((game) => (
        <div
          key={game.id}
          className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden transition-all duration-300 animate-fade-in"
        >
          <div className="flex justify-between items-center px-4 pt-4">
            {showTrackOption && userId && (
              <div className="flex items-center gap-2">
                <Switch
                  id={`track-${game.id}`}
                  checked={trackedGameIds.has(game.id)}
                  onCheckedChange={() => handleTrackToggle(game.id)}
                  disabled={trackingLoading === game.id}
                />
                <Label htmlFor={`track-${game.id}`} className="text-sm text-gray-800">
                  {trackedGameIds.has(game.id) ? "Tracking" : "Track"}
                </Label>
              </div>
            )}
            {!showTrackOption && <div />}
            
            <div>
              <span className="text-xs text-gray-600">
                {trackedGameIds.has(game.id) 
                  ? "You'll receive price updates for this game" 
                  : ""}
              </span>
            </div>
          </div>
          
          <div
            className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer"
            onClick={() => toggleGameExpand(game.id)}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
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
                  <span className="font-medium ml-2 text-gray-900">{game.awayTeam.shortName}</span>
                </div>
                
                <span className="text-gray-600">@</span>
                
                <div className="flex items-center">
                  <img
                    src={game.homeTeam.logo}
                    alt={game.homeTeam.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="font-medium ml-2 text-gray-900">{game.homeTeam.shortName}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <MapPin className="h-4 w-4" />
                <span>{game.venue}</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full p-2 mt-4 sm:mt-0 text-gray-700"
            >
              {expandedGameId === game.id ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          {expandedGameId === game.id && (
            <div className="border-t border-border/50 p-4 sm:p-6 animate-slide-up bg-white">
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
