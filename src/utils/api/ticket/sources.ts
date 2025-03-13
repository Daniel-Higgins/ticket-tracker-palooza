
import { TicketSource } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

// Demo ticket sources
export const demoSources: TicketSource[] = [
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
