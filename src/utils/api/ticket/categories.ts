
import { TicketCategory } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

// Demo ticket categories - baseball-specific locations
export const demoCategories: TicketCategory[] = [
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
    id: "cat-2",
    name: "Field Level",
    description: "Excellent views close to the action along the baselines"
  },
  {
    id: "cat-1",
    name: "Behind the Plate",
    description: "Premium seats directly behind home plate with perfect views of pitches"
  }
];

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
