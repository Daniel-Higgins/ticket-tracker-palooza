
import { Team } from '@/lib/types';
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
