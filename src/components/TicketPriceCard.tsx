
import { useState, useEffect } from 'react';
import { ExternalLink, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchTicketPrices } from '@/utils/ticketApi';
import { TicketPriceByCategory, TicketPriceWithSource } from '@/lib/types';

interface TicketPriceCardProps {
  gameId: string;
  includeFees: boolean;
}

export function TicketPriceCard({ gameId, includeFees }: TicketPriceCardProps) {
  const [priceData, setPriceData] = useState<TicketPriceByCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortDescending, setSortDescending] = useState(false);

  useEffect(() => {
    const loadPrices = async () => {
      setLoading(true);
      const data = await fetchTicketPrices(gameId, includeFees);
      setPriceData(data);
      setLoading(false);
    };

    loadPrices();
  }, [gameId, includeFees]);

  const toggleSort = () => {
    setSortDescending(!sortDescending);
  };

  const sortPrices = (prices: TicketPriceWithSource[]) => {
    return [...prices].sort((a, b) => {
      return sortDescending
        ? b.displayPrice - a.displayPrice
        : a.displayPrice - b.displayPrice;
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="space-y-4 mt-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (priceData.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">No ticket prices available</h3>
        <p className="text-muted-foreground">
          We couldn't find any ticket listings for this game yet. Check back later for updates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Ticket Prices</h3>
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex items-center gap-1"
          onClick={toggleSort}
        >
          <ArrowUpDown className="h-3 w-3 mr-1" />
          {sortDescending ? 'Price: High to Low' : 'Price: Low to High'}
        </Button>
      </div>

      <Tabs defaultValue={priceData[0].category.id}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mb-4">
          {priceData.map((item) => (
            <TabsTrigger key={item.category.id} value={item.category.id} className="text-xs sm:text-sm">
              {item.category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {priceData.map((item) => (
          <TabsContent key={item.category.id} value={item.category.id} className="animate-fade-in">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{item.category.description}</p>
              
              <div className="divide-y divide-border/50">
                {sortPrices(item.prices).map((price) => (
                  <div 
                    key={price.id} 
                    className="py-4 grid grid-cols-5 gap-2 items-center"
                  >
                    <div className="col-span-2 flex items-center">
                      <img
                        src={price.source.logo}
                        alt={price.source.name}
                        className="w-8 h-8 object-contain mr-3 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <span className="font-medium">{price.source.name}</span>
                    </div>
                    
                    <div className="price-tag text-right">
                      ${price.displayPrice.toFixed(2)}
                      <div className="text-xs text-muted-foreground">
                        {includeFees ? 'with fees' : 'before fees'}
                      </div>
                    </div>
                    
                    <div className="text-right text-xs text-muted-foreground col-span-1">
                      per ticket
                    </div>
                    
                    <div className="text-right">
                      <a 
                        href={price.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
                      >
                        Buy
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="text-xs text-muted-foreground italic text-center pt-2">
        Prices updated {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
