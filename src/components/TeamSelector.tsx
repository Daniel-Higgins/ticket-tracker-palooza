
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchTeams } from '@/utils/api/team';
import { isTeamFavorite, addFavoriteTeam, removeFavoriteTeam } from '@/utils/api/user/favorites';
import { Team } from '@/lib/types';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TeamSelectorProps {
  selectedTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  showFavoriteOption?: boolean;
  userId?: string;
  onFavoriteToggle?: (teamId: string) => void;
}

export function TeamSelector({ 
  selectedTeamId, 
  onSelectTeam, 
  showFavoriteOption = false,
  userId,
  onFavoriteToggle
}: TeamSelectorProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        console.log("Loading teams data");
        const teamsData = await fetchTeams();
        console.log("Teams loaded:", teamsData.length);
        setTeams(teamsData);
      } catch (error) {
        console.error("Error loading teams:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  useEffect(() => {
    // Load favorite status for each team if userId is provided
    const loadFavorites = async () => {
      if (!userId || !showFavoriteOption || teams.length === 0) return;
      
      console.log("Loading favorite status for teams with userId:", userId);
      const favStatus: Record<string, boolean> = {};
      for (const team of teams) {
        favStatus[team.id] = await isTeamFavorite(userId, team.id);
      }
      console.log("Favorites status loaded:", favStatus);
      setFavorites(favStatus);
    };

    loadFavorites();
  }, [teams, userId, showFavoriteOption]);

  const handleTeamChange = async (teamId: string) => {
    console.log(`Team selected: ${teamId}`);
    onSelectTeam(teamId);
    
    // If favorites are enabled and user is logged in, automatically favorite the selected team
    if (showFavoriteOption && userId) {
      try {
        console.log(`Auto-favoriting team: ${teamId} for user: ${userId}`);
        await addFavoriteTeam(userId, teamId);
        
        // Update local state
        setFavorites(prev => ({
          ...prev,
          [teamId]: true
        }));
        
        toast({
          title: "Team added to favorites",
          description: "You'll see updates for this team on your dashboard"
        });
        
        // Call the callback if provided
        if (onFavoriteToggle) {
          console.log("Calling onFavoriteToggle callback");
          onFavoriteToggle(teamId);
        }
      } catch (error) {
        console.error('Error adding favorite team:', error);
        toast({
          title: "Error",
          description: "Could not automatically favorite team",
          variant: "destructive"
        });
      }
    }
  };

  const handleImageError = (teamId: string) => {
    setImgErrors(prev => ({
      ...prev,
      [teamId]: true
    }));
  };

  const handleToggleFavorite = async (e: React.MouseEvent | null, teamId: string) => {
    if (e) e.stopPropagation();
    if (!userId) return;
    
    console.log(`Toggling favorite for team: ${teamId}`);
    setToggleLoading(teamId);
    try {
      if (favorites[teamId]) {
        console.log(`Removing team ${teamId} from favorites`);
        await removeFavoriteTeam(userId, teamId);
        toast({
          title: "Team removed from favorites",
          description: "Team has been removed from your favorites"
        });
      } else {
        console.log(`Adding team ${teamId} to favorites`);
        await addFavoriteTeam(userId, teamId);
        toast({
          title: "Team added to favorites",
          description: "You'll see updates for this team on your dashboard"
        });
      }
      
      // Update local state
      setFavorites(prev => ({
        ...prev,
        [teamId]: !prev[teamId]
      }));
      
      // Call the callback if provided
      if (onFavoriteToggle) {
        console.log("Calling onFavoriteToggle callback after toggle");
        onFavoriteToggle(teamId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Could not update favorite status",
        variant: "destructive"
      });
    } finally {
      setToggleLoading(null);
    }
  };

  if (loading) {
    return <Skeleton className="h-10 w-full max-w-xs" />;
  }

  return (
    <div className="w-full max-w-xs animate-fade-in">
      <Select onValueChange={handleTeamChange} value={selectedTeamId || undefined}>
        <SelectTrigger className="w-full glass">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent className="glass">
          <SelectGroup>
            <SelectLabel>MLB Teams</SelectLabel>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  {!imgErrors[team.id] ? (
                    <img 
                      src={team.logo} 
                      alt={team.name} 
                      className="w-5 h-5 mr-2"
                      onError={() => handleImageError(team.id)}
                    />
                  ) : (
                    <div className="w-5 h-5 mr-2 flex items-center justify-center bg-gray-200 rounded-full text-xs">
                      {team.shortName?.substring(0, 1) || team.name.substring(0, 1)}
                    </div>
                  )}
                  {team.name}
                </div>
                {showFavoriteOption && userId && (
                  <Button 
                    variant={favorites[team.id] ? "default" : "ghost"} 
                    size="icon" 
                    className="h-6 w-6 ml-2"
                    onClick={(e) => handleToggleFavorite(e, team.id)}
                    disabled={toggleLoading === team.id}
                  >
                    <Heart className={`h-4 w-4 ${favorites[team.id] ? 'fill-current' : ''}`} />
                  </Button>
                )}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
