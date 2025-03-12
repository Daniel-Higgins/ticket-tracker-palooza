
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
import { fetchTeams } from '@/utils/ticketApi';
import { Team } from '@/lib/types';

export function TeamSelector() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleTeamChange = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  if (loading) {
    return <Skeleton className="h-10 w-full max-w-xs" />;
  }

  return (
    <div className="w-full max-w-xs animate-fade-in">
      <Select onValueChange={handleTeamChange}>
        <SelectTrigger className="w-full glass">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent className="glass">
          <SelectGroup>
            <SelectLabel>MLB Teams</SelectLabel>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id} className="flex items-center">
                <div className="flex items-center">
                  <img 
                    src={team.logo} 
                    alt={team.name} 
                    className="w-5 h-5 mr-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {team.name}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
