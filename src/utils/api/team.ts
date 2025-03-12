
import { Team } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";
import { mlbTeams } from '../staticData';

// Fetch all MLB teams with fallback to static data
export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || mlbTeams;
  } catch (error) {
    console.error('Error fetching teams:', error);
    toast({
      title: "Using offline data",
      description: "Couldn't connect to the database, showing cached teams",
      variant: "default"
    });
    // Return static data when API fails
    return mlbTeams;
  }
};
