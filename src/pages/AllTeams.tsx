
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchTeams } from '@/utils/api';
import { Team } from '@/lib/types';
import { Search } from 'lucide-react';

export default function AllTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadTeams = async () => {
      setLoading(true);
      const teamsData = await fetchTeams();
      setTeams(teamsData);
      setFilteredTeams(teamsData);
      setLoading(false);
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
          team.city.toLowerCase().includes(query)
      );
      setFilteredTeams(filtered);
    }
  }, [searchQuery, teams]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1e3a]">
      <Header />
      
      <main className="flex-1 container py-24 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">MLB Teams</h1>
          
          <div className="relative mb-10 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search teams..."
              className="glass pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 30 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl bg-white/10" />
              ))}
            </div>
          ) : filteredTeams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <Link key={team.id} to={`/teams/${team.id}`}>
                  <div 
                    className="glass-card p-6 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg animate-fade-in"
                    style={{
                      animationDelay: `${
                        filteredTeams.indexOf(team) * 0.05
                      }s`,
                    }}
                  >
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-16 h-16 object-contain mb-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <h3 className="font-semibold text-lg">{team.name}</h3>
                    <p className="text-muted-foreground text-sm">{team.city}</p>
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
