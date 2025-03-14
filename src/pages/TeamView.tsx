
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GamesList } from '@/components/GamesList';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchTeams } from '@/utils/api';
import { Team } from '@/lib/types';
import { toast } from "@/hooks/use-toast";
import { mlbTeams } from '@/utils/staticData';

// Map of team IDs to their home stadiums
const teamStadiums: Record<string, string> = {
  "17": "Fenway Park", // Boston Red Sox
  "18": "Yankee Stadium", // New York Yankees
  "19": "Tropicana Field", // Tampa Bay Rays
  "13": "Dodger Stadium", // Los Angeles Dodgers
  "28": "Oracle Park", // San Francisco Giants
  "10": "Oakland Coliseum", // Oakland Athletics
  // Add other team stadiums as needed
};

export default function TeamView() {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      if (!teamId) return;
      
      setLoading(true);
      try {
        // First try to fetch from API
        const teams = await fetchTeams();
        const foundTeam = teams.find((t) => t.id === teamId);
        setTeam(foundTeam || null);
      } catch (error) {
        console.error('Error loading team data:', error);
        // If API fails, try to find team in static data
        const staticTeam = mlbTeams.find(t => t.id === teamId);
        if (staticTeam) {
          setTeam(staticTeam);
          toast({
            title: "Using offline data",
            description: "Connection to database failed. Using cached team information.",
            variant: "default"
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [teamId]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 container py-16 px-4 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/teams">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 mb-4">
                <ChevronLeft className="h-4 w-4" />
                Back to Teams
              </Button>
            </Link>
            
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : team ? (
              <div className="flex items-center gap-4 animate-fade-in">
                <div className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden bg-primary/10">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center font-bold text-2xl text-primary">${team.name.charAt(0)}</div>`;
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-black">{team.name}</h1>
                  <p className="text-muted-foreground">{team.city}</p>
                  {teamStadiums[teamId || ''] && (
                    <p className="text-muted-foreground">Home Stadium: {teamStadiums[teamId || '']}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-medium mb-2 text-black">Team Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  Sorry, we couldn't find the team you're looking for.
                </p>
                <Link to="/teams">
                  <Button>View All Teams</Button>
                </Link>
              </div>
            )}
          </div>
          
          {team && teamId && (
            <section>
              <h2 className="text-xl font-medium mb-6 text-black">Upcoming Games</h2>
              <GamesList teamId={teamId} teamStadiums={teamStadiums} />
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
