import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PriceAlertWithGame } from '@/lib/types';
import { fetchUserPriceAlerts, deletePriceAlert, togglePriceAlert } from '@/utils/api/alerts';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PriceAlertsListProps {
  alerts?: PriceAlertWithGame[];
  onToggle?: (alertId: string, isActive: boolean) => Promise<void>;
  onDelete?: (alertId: string) => Promise<void>;
}

export function PriceAlertsList({ alerts: propsAlerts, onToggle, onDelete }: PriceAlertsListProps) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<PriceAlertWithGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadAlerts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await fetchUserPriceAlerts(user.id);
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (propsAlerts) {
      setAlerts(propsAlerts);
      setIsLoading(false);
    } else {
      loadAlerts();
    }
  }, [user, propsAlerts]);
  
  const handleToggle = async (alertId: string, newState: boolean) => {
    if (onToggle) {
      await onToggle(alertId, newState);
    } else {
      const success = await togglePriceAlert(alertId, newState);
      if (success) {
        setAlerts(alerts.map(alert => 
          alert.id === alertId ? { ...alert, isActive: newState } : alert
        ));
      }
    }
  };
  
  const handleDelete = async (alertId: string) => {
    if (onDelete) {
      await onDelete(alertId);
    } else {
      const success = await deletePriceAlert(alertId);
      if (success) {
        setAlerts(alerts.filter(alert => alert.id !== alertId));
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-2 text-muted-foreground">Loading your price alerts...</p>
      </div>
    );
  }
  
  if (alerts.length === 0) {
    return (
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Price Alerts Yet</h3>
        <p className="text-muted-foreground mb-4">
          You haven't set up any price alerts. Create your first alert to get notified when ticket prices drop.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">
                  {alert.game.homeTeam.name} vs {alert.game.awayTeam.name}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(alert.game.date), 'MMM d, yyyy')} at {alert.game.time}
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium">Target: </span>
                  <span className="text-sm">${alert.targetPrice.toFixed(2)}</span>
                  {alert.category && (
                    <span className="text-sm ml-2 text-muted-foreground">
                      ({alert.category.name})
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Switch
                    checked={alert.isActive}
                    onCheckedChange={(checked) => handleToggle(alert.id, checked)}
                    className="mr-2"
                  />
                  <span className="text-xs">
                    {alert.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Price Alert</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this price alert? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(alert.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
