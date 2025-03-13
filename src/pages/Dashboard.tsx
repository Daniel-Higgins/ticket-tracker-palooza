
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Team, Game, PriceAlertWithGame } from '@/lib/types';
import { FavoriteTeams } from '@/components/dashboard/FavoriteTeams';
import { TrackedGames } from '@/components/dashboard/TrackedGames';
import { PriceAlerts } from '@/components/dashboard/PriceAlerts';
import { PriceUpdates } from '@/components/dashboard/PriceUpdates';
import { AccountSettings } from '@/components/dashboard/AccountSettings';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [favoriteTeams, setFavoriteTeams] = useState<Team[]>([]);
  const [trackedGames, setTrackedGames] = useState<Game[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlertWithGame[]>([]);
  const [isDataRefreshNeeded, setIsDataRefreshNeeded] = useState(false);

  useEffect(() => {
    // Only redirect if not loading and no user
    if (!isLoading && !user) {
      console.log("No user found, redirecting to home");
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  // Force a re-render when a child component updates data
  const handleDataUpdated = () => {
    setIsDataRefreshNeeded(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-24 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not authenticated, show sign-in prompt
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-24 px-4 flex items-center justify-center">
          <div className="glass-card p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold mb-6">Sign In to View Your Dashboard</h1>
            <p className="text-muted-foreground mb-8">
              Track your favorite teams, monitor price changes, and get alerts when prices drop.
            </p>
            <AuthModal 
              trigger={
                <Button size="lg" className="w-full sm:w-auto">
                  Sign In to Continue
                </Button>
              } 
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Favorite Teams Card */}
            <FavoriteTeams 
              userId={user.id} 
              onDataUpdated={handleDataUpdated}
            />
            
            {/* Tracked Games Card */}
            <TrackedGames 
              userId={user.id}
              favoriteTeams={favoriteTeams}
              onDataUpdated={handleDataUpdated}
            />
            
            {/* Price Alerts Card */}
            <PriceAlerts 
              userId={user.id}
              trackedGames={trackedGames}
              onDataUpdated={handleDataUpdated}
            />
          </div>
          
          {/* Recent Price Updates */}
          <PriceUpdates trackedGames={trackedGames} />
          
          {/* Account Settings */}
          <AccountSettings />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
