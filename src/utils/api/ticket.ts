import { TicketCategory, TicketSource, TicketPriceByCategory } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

// Demo ticket categories
const demoCategories: TicketCategory[] = [
  {
    id: "cat-1",
    name: "Premium",
    description: "Best seats with club access and included food & beverages"
  },
  {
    id: "cat-2",
    name: "Field Level",
    description: "Excellent views close to the action"
  },
  {
    id: "cat-3",
    name: "Mezzanine",
    description: "Great views from the middle level"
  },
  {
    id: "cat-4",
    name: "Upper Deck",
    description: "Affordable seats with a stadium overview"
  }
];

// Demo ticket sources
const demoSources: TicketSource[] = [
  {
    id: "source-1",
    name: "TicketMaster",
    logo: "https://play-lh.googleusercontent.com/EHnhJQUb0jkWzbvbk-sjJOzTGWEnDJsX9oJTPZxRwoAQAEGQ6HBlxSunOgFyhjDUvw",
    url: "https://www.ticketmaster.com"
  },
  {
    id: "source-2",
    name: "StubHub",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3a/StubHub_2021.png",
    url: "https://www.stubhub.com"
  },
  {
    id: "source-3",
    name: "SeatGeek",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/SeatGeek_Logo.png",
    url: "https://www.seatgeek.com"
  },
  {
    id: "source-4",
    name: "GameTime",
    logo: "https://play-lh.googleusercontent.com/5UPz6VlzCEzXqZgL9_6KUQPnE9-8U8mREuz45-v5tJzmqQCnLJUraxcXJbPcyV-y8G8",
    url: "https://gametime.co"
  }
];

// Demo ticket pricing by game
const demoPricing: Record<string, TicketPriceByCategory[]> = {
  "game-1": [
    {
      category: demoCategories[0],
      prices: [
        {
          id: "price-1",
          gameId: "game-1",
          ticketCategoryId: "cat-1",
          sourceId: "source-1",
          price: 280.00,
          serviceFee: 42.00,
          totalPrice: 322.00,
          url: "https://www.ticketmaster.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[0],
          displayPrice: 322.00
        },
        {
          id: "price-2",
          gameId: "game-1",
          ticketCategoryId: "cat-1",
          sourceId: "source-2",
          price: 295.00,
          serviceFee: 45.00,
          totalPrice: 340.00,
          url: "https://www.stubhub.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[1],
          displayPrice: 340.00
        }
      ]
    },
    {
      category: demoCategories[1],
      prices: [
        {
          id: "price-3",
          gameId: "game-1",
          ticketCategoryId: "cat-2",
          sourceId: "source-1",
          price: 165.00,
          serviceFee: 25.00,
          totalPrice: 190.00,
          url: "https://www.ticketmaster.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[0],
          displayPrice: 190.00
        },
        {
          id: "price-4",
          gameId: "game-1",
          ticketCategoryId: "cat-2",
          sourceId: "source-3",
          price: 155.00,
          serviceFee: 28.00,
          totalPrice: 183.00,
          url: "https://www.seatgeek.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[2],
          displayPrice: 183.00
        }
      ]
    },
    {
      category: demoCategories[2],
      prices: [
        {
          id: "price-5",
          gameId: "game-1",
          ticketCategoryId: "cat-3",
          sourceId: "source-4",
          price: 95.00,
          serviceFee: 18.00,
          totalPrice: 113.00,
          url: "https://gametime.co",
          lastUpdated: new Date().toISOString(),
          source: demoSources[3],
          displayPrice: 113.00
        }
      ]
    },
    {
      category: demoCategories[3],
      prices: [
        {
          id: "price-6",
          gameId: "game-1",
          ticketCategoryId: "cat-4",
          sourceId: "source-2",
          price: 45.00,
          serviceFee: 12.50,
          totalPrice: 57.50,
          url: "https://www.stubhub.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[1],
          displayPrice: 57.50
        },
        {
          id: "price-7",
          gameId: "game-1",
          ticketCategoryId: "cat-4",
          sourceId: "source-3",
          price: 48.00,
          serviceFee: 11.00,
          totalPrice: 59.00,
          url: "https://www.seatgeek.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[2],
          displayPrice: 59.00
        }
      ]
    }
  ],
  "game-2": [
    {
      category: demoCategories[0],
      prices: [
        {
          id: "price-8",
          gameId: "game-2",
          ticketCategoryId: "cat-1",
          sourceId: "source-1",
          price: 240.00,
          serviceFee: 36.00,
          totalPrice: 276.00,
          url: "https://www.ticketmaster.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[0],
          displayPrice: 276.00
        }
      ]
    },
    {
      category: demoCategories[1],
      prices: [
        {
          id: "price-9",
          gameId: "game-2",
          ticketCategoryId: "cat-2",
          sourceId: "source-2",
          price: 145.00,
          serviceFee: 24.00,
          totalPrice: 169.00,
          url: "https://www.stubhub.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[1],
          displayPrice: 169.00
        },
        {
          id: "price-10",
          gameId: "game-2",
          ticketCategoryId: "cat-2",
          sourceId: "source-4",
          price: 138.00,
          serviceFee: 22.00,
          totalPrice: 160.00,
          url: "https://gametime.co",
          lastUpdated: new Date().toISOString(),
          source: demoSources[3],
          displayPrice: 160.00
        }
      ]
    },
    {
      category: demoCategories[3],
      prices: [
        {
          id: "price-11",
          gameId: "game-2",
          ticketCategoryId: "cat-4",
          sourceId: "source-3",
          price: 35.00,
          serviceFee: 9.00,
          totalPrice: 44.00,
          url: "https://www.seatgeek.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[2],
          displayPrice: 44.00
        }
      ]
    }
  ],
  "game-3": [
    {
      category: demoCategories[1],
      prices: [
        {
          id: "price-12",
          gameId: "game-3",
          ticketCategoryId: "cat-2",
          sourceId: "source-2",
          price: 185.00,
          serviceFee: 32.00,
          totalPrice: 217.00,
          url: "https://www.stubhub.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[1],
          displayPrice: 217.00
        }
      ]
    },
    {
      category: demoCategories[2],
      prices: [
        {
          id: "price-13",
          gameId: "game-3",
          ticketCategoryId: "cat-3",
          sourceId: "source-1",
          price: 110.00,
          serviceFee: 20.00,
          totalPrice: 130.00,
          url: "https://www.ticketmaster.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[0],
          displayPrice: 130.00
        },
        {
          id: "price-14",
          gameId: "game-3",
          ticketCategoryId: "cat-3",
          sourceId: "source-3",
          price: 108.00,
          serviceFee: 18.50,
          totalPrice: 126.50,
          url: "https://www.seatgeek.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[2],
          displayPrice: 126.50
        }
      ]
    },
    {
      category: demoCategories[3],
      prices: [
        {
          id: "price-15",
          gameId: "game-3",
          ticketCategoryId: "cat-4",
          sourceId: "source-4",
          price: 52.00,
          serviceFee: 13.00,
          totalPrice: 65.00,
          url: "https://gametime.co",
          lastUpdated: new Date().toISOString(),
          source: demoSources[3],
          displayPrice: 65.00
        }
      ]
    }
  ]
};

// Fetch ticket categories
export const fetchTicketCategories = async (): Promise<TicketCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('ticket_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data;
    }
    
    // Return demo data if no database data
    return demoCategories;
  } catch (error) {
    console.error('Error fetching ticket categories:', error);
    toast({
      title: "Using demo data",
      description: "Failed to load ticket categories from server",
      variant: "default"
    });
    return demoCategories;
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
    
    if (data && data.length > 0) {
      return data;
    }
    
    // Return demo data if no database data
    return demoSources;
  } catch (error) {
    console.error('Error fetching ticket sources:', error);
    toast({
      title: "Using demo data",
      description: "Failed to load ticket vendors from server",
      variant: "default"
    });
    return demoSources;
  }
};

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
