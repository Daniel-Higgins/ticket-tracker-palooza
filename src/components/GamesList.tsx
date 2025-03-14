
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { fetchTeamGames } from '@/utils/api';
import { Game } from '@/lib/types';
import { GameItem } from '@/components/games/GameItem';
import { GamesLoading } from '@/components/games/GamesLoading';
import { EmptyGames } from '@/components/games/EmptyGames';
import { useGameTracking } from '@/hooks/useGameTracking';

interface GamesListProps {
  teamId?: string;
  games?: Game[];
  showTrackOption?: boolean;
  userId?: string;
  onTrackToggle?: () => Promise<void>;
  teamStadiums?: Record<string, string>;
}

export function GamesList({ 
  teamId, 
  games: propGames, 
  showTrackOption, 
  userId, 
  onTrackToggle, 
  teamStadiums 
}: GamesListProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);
  const [includeFees, setIncludeFees] = useState(true);

  const { 
    trackedGameIds, 
    trackingLoading, 
    handleTrackToggle,
    isGameTracked
  } = useGameTracking(games, userId, onTrackToggle);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      
      if (propGames && propGames.length > 0) {
        setGames(propGames);
        
        if (propGames.length > 0) {
          setExpandedGameId(propGames[0].id);
        }
        
        setLoading(false);
        return;
      }
      
      if (teamId) {
        const gamesData = await fetchTeamGames(teamId);
        setGames(gamesData);
        
        if (gamesData.length > 0) {
          setExpandedGameId(gamesData[0].id);
        }
      }
      
      setLoading(false);
    };

    loadGames();
  }, [teamId, propGames]);

  const toggleGameExpand = (gameId: string) => {
    setExpandedGameId(expandedGameId === gameId ? null : gameId);
  };

  if (loading) {
    return <GamesLoading />;
  }

  if (games.length === 0) {
    return <EmptyGames />;
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
        <GameItem
          key={game.id}
          game={game}
          expandedGameId={expandedGameId}
          toggleGameExpand={toggleGameExpand}
          includeFees={includeFees}
          showTrackOption={showTrackOption}
          userId={userId}
          isTracked={isGameTracked(game.id)}
          onTrackToggle={handleTrackToggle}
          trackingLoading={trackingLoading}
          teamStadiums={teamStadiums}
        />
      ))}
    </div>
  );
}
