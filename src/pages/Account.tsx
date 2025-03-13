
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceAlertsList } from '@/components/account/PriceAlertsList';
import { updateUserPreferences } from '@/utils/api/user';
import { Bell, Settings, CreditCard } from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';

export default function Account() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [includeFees, setIncludeFees] = useState(true);
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    // If finished loading and no user, redirect to home
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);
  
  const handleSavePreferences = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateUserPreferences(user.id, {
        includeFees,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-24 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading your account...</p>
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
            <h1 className="text-2xl font-bold mb-6">Sign In to View Your Account</h1>
            <p className="text-muted-foreground mb-8">
              Manage your preferences, alerts, and payment information.
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
          <h1 className="text-3xl font-bold mb-6">Your Account</h1>
          
          <Tabs defaultValue="alerts">
            <TabsList className="mb-8">
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Price Alerts
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="alerts" className="animate-in fade-in-50">
              <PriceAlertsList />
            </TabsContent>
            
            <TabsContent value="preferences" className="animate-in fade-in-50">
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-6">Display Settings</h2>
                
                <div className="space-y-8">
                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="fees">Show Prices with Fees</Label>
                      <p className="text-sm text-muted-foreground">
                        Display ticket prices with service fees included
                      </p>
                    </div>
                    <Switch 
                      id="fees" 
                      checked={includeFees}
                      onCheckedChange={setIncludeFees}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="maxPrice">Maximum Price Filter</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-muted-foreground">$</span>
                      </div>
                      <Input
                        id="maxPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="No maximum"
                        className="pl-7"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Only show tickets below this price (leave blank for no maximum)
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleSavePreferences} 
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="payment" className="animate-in fade-in-50">
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
                
                <div className="bg-muted/50 rounded-lg p-8 text-center">
                  <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Payment Methods Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any payment methods to your account.
                  </p>
                  <Button disabled className="opacity-70">
                    Coming Soon
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
