
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserFavoriteTeams, removeFavoriteTeam } from '@/utils/api/user/favorites';
import { Team } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { TeamSelector } from '@/components/TeamSelector';
import { DashboardCard } from './DashboardCard';
import { toast } from '@/hooks/use-toast';
import { Trash } from 'lucide-react';

interface FavoriteTeamsProps {
  userId: string;
  onDataUpdated?: () => void;
}

export function FavoriteTeams({ userId, onDataUpdated }: FavoriteTeamsProps) {
  const [favoriteTeams, setFavoriteTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingTeamId, setRemovingTeamId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadFavoriteTeams = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      console.log("Loading favorite teams for user:", userId);
      const teams = await fetchUserFavoriteTeams(userId);
      console.log("Loaded favorite teams:", teams);
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
    console.log("FavoriteTeams component mounted or userId/refreshTrigger changed:", userId, refreshTrigger);
    loadFavoriteTeams();
  }, [userId, refreshTrigger]);

  const handleFavoriteToggle = (teamId: string) => {
    console.log("FavoriteToggle callback triggered with teamId:", teamId);
    setRefreshTrigger(prev => prev + 1);
    if (onDataUpdated) {
      console.log("Calling parent onDataUpdated callback");
      onDataUpdated();
    }
  };

  const handleTeamSelect = (teamId: string) => {
    console.log("Team selected from selector in FavoriteTeams:", teamId);
    // After the team is selected, we'll refresh to show the updated favorites
    // The actual favoriting happens in the TeamSelector component
    handleFavoriteToggle(teamId);
  };

  const handleRemoveTeam = async (teamId: string) => {
    if (!userId) return;
    
    setRemovingTeamId(teamId);
    try {
      console.log(`Removing team ${teamId} from favorites`);
      const success = await removeFavoriteTeam(userId, teamId);
      
      if (success) {
        console.log(`Team ${teamId} removed successfully`);
        // Update local state by removing the team
        setFavoriteTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
        
        if (onDataUpdated) {
          onDataUpdated();
        }
      }
    } catch (error) {
      console.error('Error removing team from favorites:', error);
      toast({
        title: "Error removing team",
        description: "We couldn't remove this team from your favorites",
        variant: "destructive"
      });
    } finally {
      setRemovingTeamId(null);
    }
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
              <div className="ml-auto flex items-center gap-2">
                <Link to={`/team/${team.id}`}>
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveTeam(team.id)}
                  disabled={removingTeamId === team.id}
                >
                  {removingTeamId === team.id ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              </div>
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
            onSelectTeam={handleTeamSelect}
            showFavoriteOption={true}
            userId={userId}
            onFavoriteToggle={handleFavoriteToggle}
            autoFavoriteOnSelect={true}
          />
        </div>
      )}
    </>
  );

  const teamSelectorDialog = (
    <TeamSelector 
      selectedTeamId={null}
      onSelectTeam={handleTeamSelect}
      onFavoriteToggle={handleFavoriteToggle}
      showFavoriteOption={true}
      userId={userId}
      autoFavoriteOnSelect={true}
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
