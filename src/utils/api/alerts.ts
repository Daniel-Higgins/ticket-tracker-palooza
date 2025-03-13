
import { supabase } from '@/integrations/supabase/client';
import { PriceAlert, PriceAlertWithGame } from '@/lib/types';
import { toast } from "@/hooks/use-toast";
import { fetchTeamGames } from './game';

// Create a new price alert
export const createPriceAlert = async (
  userId: string, 
  gameId: string, 
  targetPrice: number,
  categoryId?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('price_alerts')
      .insert({
        userId,
        gameId,
        targetPrice,
        categoryId,
        isActive: true,
        createdAt: new Date().toISOString()
      });
    
    if (error) throw error;
    
    toast({
      title: "Alert created",
      description: "You'll be notified when prices drop below your target"
    });
    
    return true;
  } catch (error) {
    console.error('Error creating price alert:', error);
    toast({
      title: "Error",
      description: "Failed to create price alert",
      variant: "destructive"
    });
    return false;
  }
};

// Get all price alerts for a user
export const fetchUserPriceAlerts = async (userId: string): Promise<PriceAlertWithGame[]> => {
  try {
    // Get all price alerts for this user
    const { data, error } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return getDemoAlerts(userId);
    }
    
    // For each alert, we need to fetch the game details
    const alertsWithGames: PriceAlertWithGame[] = [];
    
    for (const alert of data) {
      // Get all games from tracked teams
      const teams = await import('./user/favorites').then(m => m.fetchUserFavoriteTeams(userId));
      let allGames: any[] = [];
      
      for (const team of teams) {
        const games = await fetchTeamGames(team.id);
        allGames = [...allGames, ...games];
      }
      
      // Find the game that matches this alert
      const game = allGames.find(g => g.id === alert.gameId);
      
      // If we found the game, add it to the result
      if (game) {
        alertsWithGames.push({
          ...alert,
          game
        });
      }
    }
    
    // If we didn't find any games, return demo data
    if (alertsWithGames.length === 0) {
      return getDemoAlerts(userId);
    }
    
    return alertsWithGames;
  } catch (error) {
    console.error('Error fetching user price alerts:', error);
    return getDemoAlerts(userId);
  }
};

// Delete a price alert
export const deletePriceAlert = async (alertId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('price_alerts')
      .delete()
      .eq('id', alertId);
    
    if (error) throw error;
    
    toast({
      title: "Alert deleted",
      description: "Price alert has been removed"
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting price alert:', error);
    toast({
      title: "Error",
      description: "Failed to delete price alert",
      variant: "destructive"
    });
    return false;
  }
};

// Toggle a price alert's active status
export const togglePriceAlert = async (alertId: string, isActive: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('price_alerts')
      .update({ isActive })
      .eq('id', alertId);
    
    if (error) throw error;
    
    toast({
      title: isActive ? "Alert activated" : "Alert paused",
      description: isActive ? "You'll receive notifications again" : "You won't receive notifications for this alert"
    });
    
    return true;
  } catch (error) {
    console.error('Error toggling price alert:', error);
    toast({
      title: "Error",
      description: "Failed to update price alert",
      variant: "destructive"
    });
    return false;
  }
};

// Demo alerts for testing
const getDemoAlerts = (userId: string): PriceAlertWithGame[] => {
  return [
    {
      id: 'alert-1',
      userId,
      gameId: 'demo-game-1',
      targetPrice: 75,
      isActive: true,
      createdAt: new Date().toISOString(),
      game: {
        id: 'demo-game-1',
        homeTeam: {
          id: '1',
          name: 'Boston Red Sox',
          shortName: 'Red Sox',
          city: 'Boston',
          logo: '/teams/boston.svg',
          primaryColor: '#BD3039',
          secondaryColor: '#0C2340'
        },
        awayTeam: {
          id: '2',
          name: 'New York Yankees',
          shortName: 'Yankees',
          city: 'New York',
          logo: '/teams/ny_yankees.svg',
          primaryColor: '#0C2340',
          secondaryColor: '#FFFFFF'
        },
        date: '2025-04-05',
        time: '19:05',
        venue: 'Fenway Park',
        status: 'scheduled'
      },
      category: {
        id: 'cat-1',
        name: 'Behind the Plate',
        description: 'Premium seats directly behind home plate with perfect views of pitches'
      }
    },
    {
      id: 'alert-2',
      userId,
      gameId: 'demo-game-2',
      targetPrice: 45,
      isActive: true,
      createdAt: new Date().toISOString(),
      game: {
        id: 'demo-game-2',
        homeTeam: {
          id: '3',
          name: 'Chicago Cubs',
          shortName: 'Cubs',
          city: 'Chicago',
          logo: '/teams/chicago_cubs.svg',
          primaryColor: '#0E3386',
          secondaryColor: '#CC3433'
        },
        awayTeam: {
          id: '4',
          name: 'St. Louis Cardinals',
          shortName: 'Cardinals',
          city: 'St. Louis',
          logo: '/teams/st_louis.svg',
          primaryColor: '#C41E3A',
          secondaryColor: '#0C2340'
        },
        date: '2025-04-12',
        time: '13:20',
        venue: 'Wrigley Field',
        status: 'scheduled'
      }
    }
  ];
};
