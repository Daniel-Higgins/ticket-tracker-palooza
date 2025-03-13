
import { TicketPriceByCategory } from '@/lib/types';
import { demoCategories } from './categories';
import { demoSources } from './sources';

// Update the demo pricing to include all categories for each game
export const demoPricing: Record<string, TicketPriceByCategory[]> = {
  "game-1": [
    {
      category: demoCategories[4], // Behind the Plate
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
      category: demoCategories[3], // Field Level
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
      category: demoCategories[4], // Behind the Plate
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
      category: demoCategories[3], // Field Level
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
      category: demoCategories[4], // Behind the Plate
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
      category: demoCategories[3], // Field Level
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
      category: demoCategories[0], // Cheapest Available
      prices: [
        {
          id: "price-13",
          gameId: "game-3",
          ticketCategoryId: "cat-7",
          sourceId: "source-1",
          price: 52.00,
          serviceFee: 11.00,
          totalPrice: 63.00,
          url: "https://www.ticketmaster.com",
          lastUpdated: new Date().toISOString(),
          source: demoSources[0],
          displayPrice: 63.00
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
