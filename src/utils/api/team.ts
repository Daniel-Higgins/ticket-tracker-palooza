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
    
    // If we have data from Supabase, use it
    if (data && data.length > 0) {
      return data;
    }
    
    // Otherwise fall back to static data
    console.log('No teams found in database, using static data');
    return mlbTeams;
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
