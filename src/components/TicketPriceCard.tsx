
import { useState, useEffect } from 'react';
import { ExternalLink, ArrowUpDown, Target, MapPin, Diamond, Home, User, Ticket, Flag, MapPinCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchTicketPrices } from '@/utils/api';
import { TicketPriceByCategory, TicketPriceWithSource } from '@/lib/types';

interface TicketPriceCardProps {
  gameId: string;
  includeFees: boolean;
}

type AreaType = '1B' | '3B' | 'LF' | 'RF' | 'Outfield Upper' | 'Outfield Lower' | 'Plate' | 'Upper Deck' | 'Unknown';

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

  const determineArea = (section?: string): AreaType => {
    if (!section) return 'Unknown';
    
    const sectionNumber = parseInt(section, 10);
    
    // Common section number patterns in MLB stadiums
    if (isNaN(sectionNumber)) {
      // Handle non-numeric sections
      const lowerSection = section.toLowerCase();
      
      if (lowerSection.includes('dugout') || lowerSection.includes('box')) {
        return lowerSection.includes('1b') || lowerSection.includes('first') ? '1B' : 
               lowerSection.includes('3b') || lowerSection.includes('third') ? '3B' : 'Unknown';
      }
      
      if (lowerSection.includes('home') || lowerSection.includes('plate')) return 'Plate';
      if (lowerSection.includes('upper') && lowerSection.includes('deck')) return 'Upper Deck';
      if (lowerSection.includes('outfield')) {
        return lowerSection.includes('upper') ? 'Outfield Upper' : 'Outfield Lower';
      }
      
      return 'Unknown';
    }
    
    // Basic section number patterns (this is a simplification as actual patterns vary by stadium)
    if (sectionNumber >= 1 && sectionNumber <= 12) return 'Plate';
    if (sectionNumber >= 13 && sectionNumber <= 33) return '1B';
    if (sectionNumber >= 34 && sectionNumber <= 45) return 'RF';
    if (sectionNumber >= 46 && sectionNumber <= 60) return 'Outfield Lower';
    if (sectionNumber >= 61 && sectionNumber <= 70) return 'Outfield Upper';
    if (sectionNumber >= 71 && sectionNumber <= 95) return 'LF';
    if (sectionNumber >= 96 && sectionNumber <= 133) return '3B';
    if (sectionNumber >= 134 && sectionNumber <= 165) return 'Upper Deck';
    
    return 'Unknown';
  };

  const getAreaIcon = (area: AreaType) => {
    switch(area) {
      case '1B':
      case '3B':
        return <Diamond className="h-4 w-4 mr-1" />;
      case 'RF':
      case 'LF':
        return <Flag className="h-4 w-4 mr-1" />;
      case 'Outfield Upper':
      case 'Outfield Lower':
        return <MapPin className="h-4 w-4 mr-1" />;
      case 'Plate':
        return <Target className="h-4 w-4 mr-1" />;
      case 'Upper Deck':
        return <MapPinCheck className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    switch(categoryName.toLowerCase()) {
      case 'behind the plate':
        return <Target className="h-4 w-4 mr-1" />;
      case 'field level':
        return <MapPin className="h-4 w-4 mr-1" />;
      case 'behind dugouts':
        return <User className="h-4 w-4 mr-1" />;
      case 'home run territory':
        return <Home className="h-4 w-4 mr-1" />;
      case 'cheapest available':
        return <Ticket className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const cheapestAvailableCategory = priceData.find(item => 
    item.category.name.toLowerCase() === 'cheapest available'
  );

  const tabCategories = priceData.filter(item => 
    item.category.name.toLowerCase() !== 'cheapest available'
  );

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
      <div className="text-center py-8 bg-white">
        <h3 className="text-lg font-medium mb-2 text-black">No ticket prices available</h3>
        <p className="text-muted-foreground">
          We couldn't find any ticket listings for this game yet. Check back later for updates.
        </p>
      </div>
    );
  }

  const TicketPriceItem = ({ price }: { price: TicketPriceWithSource }) => {
    const area = determineArea(price.section);
    
    return (
      <div 
        key={price.id} 
        className="py-4 grid grid-cols-7 gap-2 items-center bg-white"
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
        
        <div className="text-xs text-muted-foreground col-span-1 text-center">
          per ticket
        </div>
        
        <div className="col-span-2 text-xs">
          {price.section ? (
            <div className="flex flex-col">
              <span>Section: {price.section}</span>
              {price.row && <span>Row: {price.row}</span>}
              <span className="flex items-center mt-1">
                {getAreaIcon(area)}
                Area: {area}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground italic">Section/Row info not available</span>
          )}
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
    );
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-black">Ticket Prices</h3>
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

      {cheapestAvailableCategory && (
        <div className="bg-white border border-gray-100 p-4 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <Ticket className="h-5 w-5 mr-2 text-primary" />
            <h4 className="font-medium text-black">{cheapestAvailableCategory.category.name}</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{cheapestAvailableCategory.category.description}</p>
          
          <div className="divide-y divide-border/50">
            {sortPrices(cheapestAvailableCategory.prices).map((price) => (
              <TicketPriceItem key={price.id} price={price} />
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue={tabCategories[0]?.category.id}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4">
          {tabCategories.map((item) => (
            <TabsTrigger key={item.category.id} value={item.category.id} className="text-xs sm:text-sm flex items-center">
              {getCategoryIcon(item.category.name)}
              {item.category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabCategories.map((item) => (
          <TabsContent key={item.category.id} value={item.category.id} className="animate-fade-in bg-white">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{item.category.description}</p>
              
              <div className="divide-y divide-border/50">
                {sortPrices(item.prices).map((price) => (
                  <TicketPriceItem key={price.id} price={price} />
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
