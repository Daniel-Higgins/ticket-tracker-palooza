
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
      console.log('Retrieved teams from database:', data.length);
      console.log('Sample logo URL from DB:', data[0].logo);
      
      // Map column names to match our Team interface
      return data.map(team => ({
        id: team.id,
        name: team.name,
        shortName: team.shortname,
        city: team.city,
        logo: team.logo, // Use the URL directly from the database
        primaryColor: team.primarycolor,
        secondaryColor: team.secondarycolor
      }));
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
