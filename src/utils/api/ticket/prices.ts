import { TicketPriceByCategory } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";
import { fetchTicketCategories } from './categories';
import { demoPricing } from './demo-pricing';

// Fetch ticket prices for a specific game
export const fetchTicketPrices = async (
  gameId: string,
  includeFees: boolean = true
): Promise<TicketPriceByCategory[]> => {
  try {
    // If we have demo data for this game, return it immediately
    if (demoPricing[gameId]) {
      console.log(`Using demo pricing data for game ${gameId}`);
      
      // Update displayPrice based on includeFees setting
      return demoPricing[gameId].map(category => ({
        ...category,
        prices: category.prices.map(price => ({
          ...price,
          displayPrice: includeFees ? price.totalPrice : price.price
        }))
      }));
    }
    
    // Otherwise try to fetch from Supabase
    const categories = await fetchTicketCategories();
    
    const { data, error } = await supabase
      .from('ticket_prices')
      .select(`
        *,
        source:sourceId(*)
      `)
      .eq('gameId', gameId);
    
    if (error) throw error;
    
    // If we have data from Supabase, process it
    if (data && data.length > 0) {
      const pricesByCategory: TicketPriceByCategory[] = categories.map(category => {
        // Filter prices for this category
        const prices = data
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
    }
    
    // If no data found, return empty array
    console.log(`No pricing data found for game ${gameId}`);
    return [];
  } catch (error) {
    console.error('Error fetching ticket prices:', error);
    toast({
      title: "Using demo data",
      description: "Failed to load ticket pricing from server",
      variant: "default"
    });
    
    // If we have demo data for this game, return it as fallback
    if (demoPricing[gameId]) {
      // Update displayPrice based on includeFees setting
      return demoPricing[gameId].map(category => ({
        ...category,
        prices: category.prices.map(price => ({
          ...price,
          displayPrice: includeFees ? price.totalPrice : price.price
        }))
      }));
    }
    
    return [];
  }
};
