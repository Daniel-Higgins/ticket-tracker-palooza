
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Team, Game, PriceAlertWithGame } from '@/lib/types';
import { fetchUserFavoriteTeams, fetchUserTrackedGames } from '@/utils/api/user';
import { fetchUserPriceAlerts, togglePriceAlert, deletePriceAlert } from '@/utils/api/alerts';
import { PriceAlertForm } from '@/components/account/PriceAlertForm';
import { PriceAlertsList } from '@/components/account/PriceAlertsList';
import { TeamSelector } from '@/components/TeamSelector';
import { GamesList } from '@/components/GamesList';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [favoriteTeams, setFavoriteTeams] = useState<Team[]>([]);
  const [trackedGames, setTrackedGames] = useState<Game[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlertWithGame[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  useEffect(() => {
    // Only redirect if not loading and no user
    if (!isLoading && !user) {
      console.log("No user found, redirecting to home");
      navigate('/');
    } else if (user) {
      console.log("User authenticated:", user.email);
      loadUserData();
    }
  }, [user, isLoading, navigate]);

  const loadUserData = async () => {
    if (!user) return;

    // Load favorite teams
    setLoadingFavorites(true);
    try {
      const teams = await fetchUserFavoriteTeams(user.id);
      setFavoriteTeams(teams);
    } catch (error) {
      console.error('Error loading favorite teams:', error);
    } finally {
      setLoadingFavorites(false);
    }

    // Load tracked games
    setLoadingGames(true);
    try {
      const games = await fetchUserTrackedGames(user.id);
      setTrackedGames(games);
    } catch (error) {
      console.error('Error loading tracked games:', error);
    } finally {
      setLoadingGames(false);
    }

    // Load price alerts
    setLoadingAlerts(true);
    try {
      const alerts = await fetchUserPriceAlerts(user.id);
      setPriceAlerts(alerts);
    } catch (error) {
      console.error('Error loading price alerts:', error);
    } finally {
      setLoadingAlerts(false);
    }
  };

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    if (!user) return;
    
    const success = await togglePriceAlert(alertId, isActive);
    if (success) {
      setPriceAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId ? { ...alert, isActive } : alert
        )
      );
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!user) return;
    
    const success = await deletePriceAlert(alertId);
    if (success) {
      setPriceAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
    }
  };

  const handlePriceAlertCreated = () => {
    // Reload price alerts after new one is created
    if (user) {
      fetchUserPriceAlerts(user.id).then(setPriceAlerts);
    }
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
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Favorite Teams</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      {favoriteTeams.length > 0 ? "Manage" : "Add"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Select Favorite Teams</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <TeamSelector 
                        selectedTeamId={null}
                        onSelectTeam={() => {}}
                        onFavoriteToggle={(teamId) => {
                          loadUserData();
                        }}
                        showFavoriteOption={true}
                        userId={user.id}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {loadingFavorites ? (
                <div className="flex justify-center py-6">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : favoriteTeams.length > 0 ? (
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
                  <Link to="/teams">
                    <Button variant="outline" size="sm" className="w-full">
                      Browse Teams
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Tracked Games Card */}
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Tracked Games</h3>
                {favoriteTeams.length > 0 && (
                  <Link to={`/team/${favoriteTeams[0]?.id}`}>
                    <Button variant="outline" size="sm">
                      Add More
                    </Button>
                  </Link>
                )}
              </div>
              
              {loadingGames ? (
                <div className="flex justify-center py-6">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : trackedGames.length > 0 ? (
                <div className="space-y-3">
                  <GamesList 
                    games={trackedGames.slice(0, 3)} 
                    showTrackOption={true}
                    userId={user.id}
                    onTrackToggle={() => loadUserData()}
                  />
                  {trackedGames.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="ghost" size="sm">
                        View all ({trackedGames.length})
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground mb-4">
                    You're not tracking any games yet.
                  </p>
                  {favoriteTeams.length > 0 ? (
                    <Link to={`/team/${favoriteTeams[0].id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Find Games
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/teams">
                      <Button variant="outline" size="sm" className="w-full">
                        Browse Teams
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
            
            {/* Price Alerts Card */}
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Price Alerts</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Create Alert
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create Price Alert</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <PriceAlertForm 
                        userId={user.id}
                        onAlertCreated={handlePriceAlertCreated}
                        trackedGames={trackedGames}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {loadingAlerts ? (
                <div className="flex justify-center py-6">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : priceAlerts.length > 0 ? (
                <div className="space-y-4">
                  <PriceAlertsList 
                    alerts={priceAlerts.slice(0, 3)} 
                    onToggle={handleToggleAlert}
                    onDelete={handleDeleteAlert}
                  />
                  {priceAlerts.length > 3 && (
                    <div className="text-center pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            View all ({priceAlerts.length})
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>All Price Alerts</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <PriceAlertsList 
                              alerts={priceAlerts} 
                              onToggle={handleToggleAlert}
                              onDelete={handleDeleteAlert}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground mb-4">
                    No price alerts set up.
                  </p>
                  {trackedGames.length > 0 ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          Set Up Alert
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Create Price Alert</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <PriceAlertForm 
                            userId={user.id}
                            onAlertCreated={handlePriceAlertCreated}
                            trackedGames={trackedGames}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      Track a game first
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Price Updates */}
          <div className="glass-card p-6 mb-8">
            <h2 className="text-xl font-medium mb-4">Recent Price Updates</h2>
            {trackedGames.length > 0 ? (
              <div className="space-y-3">
                {trackedGames.slice(0, 3).map(game => (
                  <div key={game.id} className="p-3 border border-border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <img src={game.homeTeam.logo || '/placeholder.svg'} alt={game.homeTeam.name} className="w-6 h-6 mr-2" />
                        <span>{game.homeTeam.name}</span>
                        <span className="mx-2 text-muted-foreground">vs</span>
                        <img src={game.awayTeam.logo || '/placeholder.svg'} alt={game.awayTeam.name} className="w-6 h-6 mr-2" />
                        <span>{game.awayTeam.name}</span>
                      </div>
                      <Badge variant={Math.random() > 0.5 ? "destructive" : "default"}>
                        {Math.random() > 0.5 ? "↑ $12" : "↓ $8"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {game.date} at {game.time} • {game.venue}
                    </div>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm" className="w-full">View Price History</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No recent price updates to display. Track teams and games to see price changes.
                </p>
              </div>
            )}
          </div>
          
          {/* Account Settings */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-medium mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border border-border rounded-md">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-muted-foreground text-sm">
                    Receive email alerts for price drops and game reminders
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <label htmlFor="notifications" className="text-sm">
                    {true ? "Enabled" : "Disabled"}
                  </label>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border border-border rounded-md">
                <div>
                  <h3 className="font-medium">Price Display Settings</h3>
                  <p className="text-muted-foreground text-sm">
                    Configure how ticket prices are displayed
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Price Display Settings</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Currency</h3>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="w-16">USD</Button>
                          <Button variant="ghost" size="sm" className="w-16">EUR</Button>
                          <Button variant="ghost" size="sm" className="w-16">CAD</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Include Fees</h3>
                        <div className="flex items-center space-x-2">
                          <Switch id="include-fees" defaultChecked />
                          <label htmlFor="include-fees" className="text-sm">
                            Show prices with fees included
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Price Change Display</h3>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">Percentage</Button>
                          <Button variant="ghost" size="sm">Absolute</Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
