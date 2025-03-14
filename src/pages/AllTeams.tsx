
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchTeams } from '@/utils/api';
import { Team } from '@/lib/types';
import { Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AllTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        const teamsData = await fetchTeams();
        console.log('Loaded team data:', teamsData);
        setTeams(teamsData);
        setFilteredTeams(teamsData);
      } catch (error) {
        console.error('Error loading teams:', error);
        toast({
          title: "Error loading teams",
          description: "Failed to load team data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTeams(teams);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = teams.filter(
        (team) =>
          team.name.toLowerCase().includes(query) ||
          team.city.toLowerCase().includes(query) ||
          team.location?.city.toLowerCase().includes(query) ||
          team.location?.state.toLowerCase().includes(query)
      );
      setFilteredTeams(filtered);
    }
  }, [searchQuery, teams]);

  const handleImageError = (teamId: string) => {
    console.log(`Image error for team ID: ${teamId}`);
    setImageErrors(prev => ({
      ...prev,
      [teamId]: true
    }));
  };

  // Helper function to format location
  const formatLocation = (team: Team) => {
    if (team.location) {
      return `${team.location.city}, ${team.location.state}`;
    }
    return team.city;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 container py-24 px-4 text-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">MLB Teams</h1>
          
          <div className="relative mb-10 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search teams..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 30 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          ) : filteredTeams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <Link key={team.id} to={`/teams/${team.id}`}>
                  <div 
                    className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg animate-fade-in"
                    style={{
                      animationDelay: `${
                        filteredTeams.indexOf(team) * 0.05
                      }s`,
                    }}
                  >
                    {!imageErrors[team.id] ? (
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-16 h-16 object-contain mb-4"
                        onError={() => handleImageError(team.id)}
                        onLoad={() => console.log(`Successfully loaded image for ${team.name}: ${team.logo}`)}
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4 text-lg font-bold">
                        {team.shortName?.substring(0, 1) || team.name.substring(0, 1)}
                      </div>
                    )}
                    <h3 className="font-semibold text-lg">{team.name}</h3>
                    <p className="text-muted-foreground text-sm">{formatLocation(team)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">No Teams Found</h2>
              <p className="text-muted-foreground">
                No teams match your search query. Try a different search term.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
