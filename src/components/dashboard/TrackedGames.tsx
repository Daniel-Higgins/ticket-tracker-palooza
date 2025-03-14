
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserTrackedGames } from '@/utils/api/user/trackedGames';
import { Game } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { GamesList } from '@/components/GamesList';
import { DashboardCard } from './DashboardCard';

interface TrackedGamesProps {
  userId: string;
  favoriteTeams: any[];
  onDataUpdated?: () => void;
}

export function TrackedGames({ userId, favoriteTeams, onDataUpdated }: TrackedGamesProps) {
  const [trackedGames, setTrackedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTrackedGames = async () => {
    setLoading(true);
    try {
      const games = await fetchUserTrackedGames(userId);
      setTrackedGames(games);
    } catch (error) {
      console.error('Error loading tracked games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrackedGames();
  }, [userId]);

  const handleTrackToggle = async () => {
    await loadTrackedGames();
    if (onDataUpdated) onDataUpdated();
  };

  const trackedGamesContent = (
    <>
      {trackedGames.length > 0 ? (
        <div className="space-y-3">
          <GamesList 
            games={trackedGames.slice(0, 3)} 
            showTrackOption={true}
            userId={userId}
            onTrackToggle={handleTrackToggle}
          />
          {trackedGames.length > 3 && (
            <div className="text-center pt-2">
              <Button variant="ghost" size="sm">
                View all ({trackedGames.length})
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-4 text-center">
          <p className="text-muted-foreground mb-4">
            You're not tracking any games yet.
          </p>
          {favoriteTeams.length > 0 ? (
            <Link to={`/team/${favoriteTeams[0].id}`}>
              <Button variant="outline" size="sm" className="w-full">
                Find Games
              </Button>
            </Link>
          ) : (
            <Link to="/teams">
              <Button variant="outline" size="sm" className="w-full">
                Browse Teams
              </Button>
            </Link>
          )}
        </div>
      )}
    </>
  );

  return (
    <DashboardCard 
      title="Tracked Games"
      loading={loading}
      actionLabel={favoriteTeams.length > 0 ? "Add More" : undefined}
      onAction={favoriteTeams.length > 0 ? () => window.location.href = `/team/${favoriteTeams[0]?.id}` : undefined}
    >
      {trackedGamesContent}
    </DashboardCard>
  );
}
