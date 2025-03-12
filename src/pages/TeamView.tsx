
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

export default function TeamView() {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      if (!teamId) return;
      
      setLoading(true);
      const teams = await fetchTeams();
      const foundTeam = teams.find((t) => t.id === teamId);
      setTeam(foundTeam || null);
      setLoading(false);
    };

    loadTeam();
  }, [teamId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-24 px-4">
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
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div>
                  <h1 className="text-3xl font-bold">{team.name}</h1>
                  <p className="text-muted-foreground">{team.city}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-medium mb-2">Team Not Found</h2>
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
              <h2 className="text-xl font-medium mb-6">Upcoming Games</h2>
              <GamesList teamId={teamId} />
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
