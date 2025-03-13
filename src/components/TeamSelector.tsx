
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
import { fetchTeams, isTeamFavorite, addFavoriteTeam, removeFavoriteTeam } from '@/utils/api';
import { Team } from '@/lib/types';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';

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
      setLoading(true);
      const teamsData = await fetchTeams();
      setTeams(teamsData);
      setLoading(false);
    };

    loadTeams();
  }, []);

  useEffect(() => {
    // Load favorite status for each team if userId is provided
    const loadFavorites = async () => {
      if (!userId || !showFavoriteOption) return;
      
      const favStatus: Record<string, boolean> = {};
      for (const team of teams) {
        favStatus[team.id] = await isTeamFavorite(userId, team.id);
      }
      setFavorites(favStatus);
    };

    loadFavorites();
  }, [teams, userId, showFavoriteOption]);

  const handleTeamChange = (teamId: string) => {
    onSelectTeam(teamId);
  };

  const handleImageError = (teamId: string) => {
    setImgErrors(prev => ({
      ...prev,
      [teamId]: true
    }));
  };

  const handleToggleFavorite = async (e: React.MouseEvent, teamId: string) => {
    e.stopPropagation();
    if (!userId) return;
    
    setToggleLoading(teamId);
    try {
      if (favorites[teamId]) {
        await removeFavoriteTeam(userId, teamId);
      } else {
        await addFavoriteTeam(userId, teamId);
      }
      
      // Update local state
      setFavorites(prev => ({
        ...prev,
        [teamId]: !prev[teamId]
      }));
      
      // Call the callback if provided
      if (onFavoriteToggle) {
        onFavoriteToggle(teamId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
                      {team.shortName.substring(0, 1)}
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
