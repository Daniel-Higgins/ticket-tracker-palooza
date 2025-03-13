
import { TicketCategory, TicketSource, TicketPriceByCategory } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

// Demo ticket categories - updated to baseball-specific locations in requested order
const demoCategories: TicketCategory[] = [
  {
    id: "cat-7",
    name: "Cheapest Available",
    description: "Most affordable tickets available for this game"
  },
  {
    id: "cat-3",
    name: "Behind Dugouts",
    description: "Great seats behind the team dugouts with player access"
  },
  {
    id: "cat-4",
    name: "Home Run Territory",
    description: "Outfield sections with chances to catch home run balls"
  },
  {
    id: "cat-5",
    name: "Fair Territory",
    description: "Seating along the foul lines with potential for foul ball catches"
  },
  {
    id: "cat-2",
    name: "Field Level",
    description: "Excellent views close to the action along the baselines"
  },
  {
    id: "cat-6",
    name: "Behind the Diamond",
    description: "Central view of the entire infield and pitcher's mound"
  },
  {
    id: "cat-1",
    name: "Behind the Plate",
    description: "Premium seats directly behind home plate with perfect views of pitches"
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

// Update the demo pricing to include all categories for each game
const demoPricing: Record<string, TicketPriceByCategory[]> = {
  "game-1": [
    {
      category: demoCategories[6], // Behind the Plate
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
      category: demoCategories[4], // Field Level
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
      category: demoCategories[1], // Behind Dugouts
      prices: [
        {
          id: "price-5",
          gameId: "game-1",
          ticketCategoryId: "cat-3",
          sourceId: "source-4",
          price: 110.00,
          serviceFee: 20.00,
          totalPrice: 130.00,
          url: "https://gametime.co",
          lastUpdated: new Date().toISOString(),
          source: demoSources[3],
          displayPrice: 130.00
        },
        {
          id: "price-21",
          gameId: "game-1",
          ticketCategoryId: "cat-3",
          sourceId: "source-2",
          price: 115.00,
          serviceFee: 22.00,
          totalPrice: 137.00,
          url: "https://www.stubhub.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[1],
          displayPrice: 137.00
        }
      ]
    },
    {
      category: demoCategories[2], // Home Run Territory
      prices: [
        {
          id: "price-6",
          gameId: "game-1",
          ticketCategoryId: "cat-4",
          sourceId: "source-2",
          price: 85.00,
          serviceFee: 18.50,
          totalPrice: 103.50,
          url: "https://www.stubhub.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[1],
          displayPrice: 103.50
        },
        {
          id: "price-22",
          gameId: "game-1",
          ticketCategoryId: "cat-4",
          sourceId: "source-3",
          price: 82.00,
          serviceFee: 17.00,
          totalPrice: 99.00,
          url: "https://www.seatgeek.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[2],
          displayPrice: 99.00
        }
      ]
    },
    {
      category: demoCategories[3], // Fair Territory
      prices: [
        {
          id: "price-23",
          gameId: "game-1",
          ticketCategoryId: "cat-5",
          sourceId: "source-1",
          price: 75.00,
          serviceFee: 15.00,
          totalPrice: 90.00,
          url: "https://www.ticketmaster.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[0],
          displayPrice: 90.00
        },
        {
          id: "price-24",
          gameId: "game-1",
          ticketCategoryId: "cat-5",
          sourceId: "source-4",
          price: 72.00,
          serviceFee: 13.50,
          totalPrice: 85.50,
          url: "https://gametime.co",
          lastUpdated: new Date().toISOString(),
          source: demoSources[3],
          displayPrice: 85.50
        }
      ]
    },
    {
      category: demoCategories[5], // Behind the Diamond
      prices: [
        {
          id: "price-25",
          gameId: "game-1",
          ticketCategoryId: "cat-6",
          sourceId: "source-2",
          price: 175.00,
          serviceFee: 30.00,
          totalPrice: 205.00,
          url: "https://www.stubhub.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[1],
          displayPrice: 205.00
        }
      ]
    },
    {
      category: demoCategories[0], // Cheapest Available
      prices: [
        {
          id: "price-7",
          gameId: "game-1",
          ticketCategoryId: "cat-7",
          sourceId: "source-3",
          price: 48.00,
          serviceFee: 11.00,
          totalPrice: 59.00,
          url: "https://www.seatgeek.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[2],
          displayPrice: 59.00
        },
        {
          id: "price-26",
          gameId: "game-1",
          ticketCategoryId: "cat-7",
          sourceId: "source-4",
          price: 45.00,
          serviceFee: 10.00,
          totalPrice: 55.00,
          url: "https://gametime.co",
          lastUpdated: new Date().toISOString(),
          source: demoSources[3],
          displayPrice: 55.00
        }
      ]
    }
  ],
  "game-2": [
    {
      category: demoCategories[6], // Behind the Plate
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
        },
        {
          id: "price-27",
          gameId: "game-2",
          ticketCategoryId: "cat-1",
          sourceId: "source-2",
          price: 255.00,
          serviceFee: 38.00,
          totalPrice: 293.00,
          url: "https://www.stubhub.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[1],
          displayPrice: 293.00
        }
      ]
    },
    {
      category: demoCategories[4], // Field Level
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
      category: demoCategories[1], // Behind Dugouts
      prices: [
        {
          id: "price-28",
          gameId: "game-2",
          ticketCategoryId: "cat-3",
          sourceId: "source-3",
          price: 95.00,
          serviceFee: 18.00,
          totalPrice: 113.00,
          url: "https://www.seatgeek.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[2],
          displayPrice: 113.00
        }
      ]
    },
    {
      category: demoCategories[2], // Home Run Territory
      prices: [
        {
          id: "price-29",
          gameId: "game-2",
          ticketCategoryId: "cat-4",
          sourceId: "source-1",
          price: 72.00,
          serviceFee: 15.00,
          totalPrice: 87.00,
          url: "https://www.ticketmaster.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[0],
          displayPrice: 87.00
        }
      ]
    },
    {
      category: demoCategories[3], // Fair Territory
      prices: [
        {
          id: "price-30",
          gameId: "game-2",
          ticketCategoryId: "cat-5",
          sourceId: "source-4",
          price: 65.00,
          serviceFee: 12.50,
          totalPrice: 77.50,
          url: "https://gametime.co",
          lastUpdated: new Date().toISOString(),
          source: demoSources[3],
          displayPrice: 77.50
        }
      ]
    },
    {
      category: demoCategories[5], // Behind the Diamond
      prices: [
        {
          id: "price-31",
          gameId: "game-2",
          ticketCategoryId: "cat-6",
          sourceId: "source-2",
          price: 155.00,
          serviceFee: 26.00,
          totalPrice: 181.00,
          url: "https://www.stubhub.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[1],
          displayPrice: 181.00
        }
      ]
    },
    {
      category: demoCategories[0], // Cheapest Available
      prices: [
        {
          id: "price-11",
          gameId: "game-2",
          ticketCategoryId: "cat-7",
          sourceId: "source-3",
          price: 35.00,
          serviceFee: 9.00,
          totalPrice: 44.00,
          url: "https://www.seatgeek.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[2],
          displayPrice: 44.00
        },
        {
          id: "price-32",
          gameId: "game-2",
          ticketCategoryId: "cat-7",
          sourceId: "source-1",
          price: 38.00,
          serviceFee: 8.50,
          totalPrice: 46.50,
          url: "https://www.ticketmaster.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[0],
          displayPrice: 46.50
        }
      ]
    }
  ],
  "game-3": [
    {
      category: demoCategories[6], // Behind the Plate
      prices: [
        {
          id: "price-33",
          gameId: "game-3",
          ticketCategoryId: "cat-1",
          sourceId: "source-1",
          price: 265.00,
          serviceFee: 40.00,
          totalPrice: 305.00,
          url: "https://www.ticketmaster.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[0],
          displayPrice: 305.00
        }
      ]
    },
    {
      category: demoCategories[4], // Field Level
      prices: [
        {
          id: "price-34",
          gameId: "game-3",
          ticketCategoryId: "cat-2",
          sourceId: "source-3",
          price: 145.00,
          serviceFee: 25.00,
          totalPrice: 170.00,
          url: "https://www.seatgeek.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[2],
          displayPrice: 170.00
        }
      ]
    },
    {
      category: demoCategories[1], // Behind Dugouts
      prices: [
        {
          id: "price-35",
          gameId: "game-3",
          ticketCategoryId: "cat-3",
          sourceId: "source-2",
          price: 118.00,
          serviceFee: 22.00,
          totalPrice: 140.00,
          url: "https://www.stubhub.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[1],
          displayPrice: 140.00
        }
      ]
    },
    {
      category: demoCategories[2], // Home Run Territory
      prices: [
        {
          id: "price-36",
          gameId: "game-3",
          ticketCategoryId: "cat-4",
          sourceId: "source-4",
          price: 78.00,
          serviceFee: 16.00,
          totalPrice: 94.00,
          url: "https://gametime.co",
          lastUpdated: new Date().toISOString(),
          source: demoSources[3],
          displayPrice: 94.00
        }
      ]
    },
    {
      category: demoCategories[3], // Fair Territory
      prices: [
        {
          id: "price-13",
          gameId: "game-3",
          ticketCategoryId: "cat-5",
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
          ticketCategoryId: "cat-5",
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
      category: demoCategories[5], // Behind the Diamond
      prices: [
        {
          id: "price-12",
          gameId: "game-3",
          ticketCategoryId: "cat-6",
          sourceId: "source-2",
          price: 185.00,
          serviceFee: 32.00,
          totalPrice: 217.00,
          url: "https://www.stubhub.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[1],
          displayPrice: 217.00
        },
        {
          id: "price-37",
          gameId: "game-3",
          ticketCategoryId: "cat-6",
          sourceId: "source-4",
          price: 182.00,
          serviceFee: 30.00,
          totalPrice: 212.00,
          url: "https://gametime.co",
          lastUpdated: new Date().toISOString(),
          source: demoSources[3],
          displayPrice: 212.00
        }
      ]
    },
    {
      category: demoCategories[0], // Cheapest Available
      prices: [
        {
          id: "price-15",
          gameId: "game-3",
          ticketCategoryId: "cat-7",
          sourceId: "source-4",
          price: 52.00,
          serviceFee: 13.00,
          totalPrice: 65.00,
          url: "https://gametime.co",
          lastUpdated: new Date().toISOString(),
          source: demoSources[3],
          displayPrice: 65.00
        },
        {
          id: "price-38",
          gameId: "game-3",
          ticketCategoryId: "cat-7",
          sourceId: "source-3",
          price: 49.00,
          serviceFee: 12.00,
          totalPrice: 61.00,
          url: "https://www.seatgeek.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[2],
          displayPrice: 61.00
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
