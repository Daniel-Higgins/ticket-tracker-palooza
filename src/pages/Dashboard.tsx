
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If finished loading and no user, redirect to home
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

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
      
      <main className="flex-1 container py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card p-6">
              <h3 className="text-lg font-medium mb-2">Favorite Teams</h3>
              <p className="text-muted-foreground mb-4">
                You haven't added any favorite teams yet.
              </p>
              <Link to="/teams">
                <Button variant="outline" size="sm" className="w-full">
                  Browse Teams
                </Button>
              </Link>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-medium mb-2">Tracked Games</h3>
              <p className="text-muted-foreground mb-4">
                You're not tracking any games yet.
              </p>
              <Link to="/teams">
                <Button variant="outline" size="sm" className="w-full">
                  Find Games
                </Button>
              </Link>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-medium mb-2">Price Alerts</h3>
              <p className="text-muted-foreground mb-4">
                No price alerts set up.
              </p>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
          
          <div className="glass-card p-6 mb-8">
            <h2 className="text-xl font-medium mb-4">Recent Price Updates</h2>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No recent price updates to display. Track teams and games to see price changes.
              </p>
            </div>
          </div>
          
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
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border border-border rounded-md">
                <div>
                  <h3 className="font-medium">Price Display Settings</h3>
                  <p className="text-muted-foreground text-sm">
                    Configure how ticket prices are displayed
                  </p>
                </div>
                <Link to="/settings">
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
