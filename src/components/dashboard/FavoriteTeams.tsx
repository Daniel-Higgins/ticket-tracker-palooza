
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserFavoriteTeams } from '@/utils/api/user/favorites';
import { Team } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { TeamSelector } from '@/components/TeamSelector';
import { DashboardCard } from './DashboardCard';
import { toast } from '@/hooks/use-toast';

interface FavoriteTeamsProps {
  userId: string;
  onDataUpdated?: () => void;
}

export function FavoriteTeams({ userId, onDataUpdated }: FavoriteTeamsProps) {
  const [favoriteTeams, setFavoriteTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavoriteTeams = async () => {
    setLoading(true);
    try {
      const teams = await fetchUserFavoriteTeams(userId);
      setFavoriteTeams(teams);
    } catch (error) {
      console.error('Error loading favorite teams:', error);
      toast({
        title: "Error loading favorites",
        description: "We couldn't load your favorite teams",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavoriteTeams();
  }, [userId]);

  const handleFavoriteToggle = () => {
    loadFavoriteTeams();
    if (onDataUpdated) onDataUpdated();
  };

  const favoriteTeamsContent = (
    <>
      {favoriteTeams.length > 0 ? (
        <div className="space-y-3">
          {favoriteTeams.map(team => (
            <div key={team.id} className="flex items-center p-2 border border-border rounded-md">
              {team.logo && (
                <img 
                  src={team.logo} 
                  alt={team.name} 
                  className="w-8 h-8 mr-3"
                />
              )}
              <span className="font-medium">{team.name}</span>
              <Link to={`/team/${team.id}`} className="ml-auto">
                <Button variant="ghost" size="sm">View</Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center">
          <p className="text-muted-foreground mb-4">
            You haven't added any favorite teams yet.
          </p>
          <TeamSelector
            selectedTeamId={null}
            onSelectTeam={() => {}}
            showFavoriteOption={true}
            userId={userId}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>
      )}
    </>
  );

  const teamSelectorDialog = (
    <TeamSelector 
      selectedTeamId={null}
      onSelectTeam={() => {}}
      onFavoriteToggle={handleFavoriteToggle}
      showFavoriteOption={true}
      userId={userId}
    />
  );

  return (
    <DashboardCard 
      title="Favorite Teams"
      loading={loading}
      dialogTitle="Select Favorite Teams"
      dialogContent={teamSelectorDialog}
      actionLabel={favoriteTeams.length > 0 ? "Manage" : "Add"}
    >
      {favoriteTeamsContent}
    </DashboardCard>
  );
}
