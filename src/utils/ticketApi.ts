
import { Game, Team, TicketPriceByCategory, TicketCategory, TicketSource, TicketPrice } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

// Fetch all MLB teams
export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching teams:', error);
    toast({
      title: "Data Error",
      description: "Failed to load teams data",
      variant: "destructive"
    });
    return [];
  }
};

// Fetch future games for a team
export const fetchTeamGames = async (teamId: string): Promise<Game[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('games')
      .select(`
        *,
        homeTeam:homeTeamId(*),
        awayTeam:awayTeamId(*)
      `)
      .or(`homeTeamId.eq.${teamId},awayTeamId.eq.${teamId}`)
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(10);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching team games:', error);
    toast({
      title: "Data Error",
      description: "Failed to load game data",
      variant: "destructive"
    });
    return [];
  }
};

// Fetch ticket categories
export const fetchTicketCategories = async (): Promise<TicketCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('ticket_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching ticket categories:', error);
    toast({
      title: "Data Error",
      description: "Failed to load ticket categories",
      variant: "destructive"
    });
    return [];
  }
};

// Fetch ticket sources (vendors)
export const fetchTicketSources = async (): Promise<TicketSource[]> => {
  try {
    const { data, error } = await supabase
      .from('ticket_sources')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching ticket sources:', error);
    toast({
      title: "Data Error",
      description: "Failed to load ticket sources",
      variant: "destructive"
    });
    return [];
  }
};

// Fetch ticket prices for a specific game
export const fetchTicketPrices = async (
  gameId: string,
  includeFees: boolean = true
): Promise<TicketPriceByCategory[]> => {
  try {
    // Fetch categories first
    const categories = await fetchTicketCategories();
    
    // Fetch all prices for this game
    const { data, error } = await supabase
      .from('ticket_prices')
      .select(`
        *,
        source:sourceId(*)
      `)
      .eq('gameId', gameId);
    
    if (error) throw error;
    
    const pricesByCategory: TicketPriceByCategory[] = categories.map(category => {
      // Filter prices for this category
      const prices = (data || [])
        .filter(price => price.ticketCategoryId === category.id)
        .map(price => ({
          ...price,
          // Use total price or base price depending on includeFees setting
          displayPrice: includeFees ? price.totalPrice : price.price
        }))
        // Sort by price (lowest first)
        .sort((a, b) => (a.displayPrice || 0) - (b.displayPrice || 0));
      
      return {
        category,
        prices
      };
    });
    
    // Only return categories that have prices
    return pricesByCategory.filter(item => item.prices.length > 0);
  } catch (error) {
    console.error('Error fetching ticket prices:', error);
    toast({
      title: "Data Error",
      description: "Failed to load ticket pricing data",
      variant: "destructive"
    });
    return [];
  }
};

// Save a user's favorite team
export const saveUserFavoriteTeam = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .upsert({ userId, teamId });
    
    if (error) throw error;
    toast({
      title: "Success",
      description: "Team saved to favorites"
    });
    return true;
  } catch (error) {
    console.error('Error saving favorite team:', error);
    toast({
      title: "Error",
      description: "Failed to save team to favorites",
      variant: "destructive"
    });
    return false;
  }
};

// Update user preferences
export const updateUserPreferences = async (
  userId: string, 
  preferences: { includeFees: boolean; maxPrice?: number; preferredSources?: string[] }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({ 
        userId, 
        ...preferences
      });
    
    if (error) throw error;
    toast({
      title: "Success",
      description: "Preferences updated"
    });
    return true;
  } catch (error) {
    console.error('Error updating preferences:', error);
    toast({
      title: "Error",
      description: "Failed to update preferences",
      variant: "destructive"
    });
    return false;
  }
};
