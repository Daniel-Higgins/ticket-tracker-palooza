
import { useState, useEffect } from 'react';
import { fetchUserPriceAlerts, deletePriceAlert, togglePriceAlert } from '@/utils/api/alerts';
import { PriceAlertWithGame, Game } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PriceAlertsList } from '@/components/account/PriceAlertsList';
import { PriceAlertForm } from '@/components/account/PriceAlertForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DashboardCard } from './DashboardCard';

interface PriceAlertsProps {
  userId: string;
  trackedGames: Game[];
  onDataUpdated?: () => void;
}

export function PriceAlerts({ userId, trackedGames, onDataUpdated }: PriceAlertsProps) {
  const [priceAlerts, setPriceAlerts] = useState<PriceAlertWithGame[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPriceAlerts = async () => {
    setLoading(true);
    try {
      const alerts = await fetchUserPriceAlerts(userId);
      setPriceAlerts(alerts);
    } catch (error) {
      console.error('Error loading price alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPriceAlerts();
  }, [userId]);

  const handleAlertCreated = () => {
    loadPriceAlerts();
    if (onDataUpdated) onDataUpdated();
  };

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
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
    const success = await deletePriceAlert(alertId);
    if (success) {
      setPriceAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
    }
  };

  const priceAlertsContent = (
    <>
      {priceAlerts.length > 0 ? (
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
                    userId={userId}
                    onAlertCreated={handleAlertCreated}
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
    </>
  );

  const createAlertForm = (
    <PriceAlertForm 
      userId={userId}
      onAlertCreated={handleAlertCreated}
      trackedGames={trackedGames}
    />
  );

  return (
    <DashboardCard 
      title="Price Alerts"
      loading={loading}
      dialogTitle="Create Price Alert"
      dialogContent={createAlertForm}
      actionLabel="Create Alert"
    >
      {priceAlertsContent}
    </DashboardCard>
  );
}
