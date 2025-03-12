
import { TicketCategory, TicketSource, TicketPriceByCategory } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

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
