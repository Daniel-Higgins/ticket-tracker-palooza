import { Game } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

// Sample static games data for demo purposes
const demoGames: Game[] = [
  {
    id: "game-1",
    homeTeam: {
      id: "28",
      name: "San Francisco Giants",
      shortName: "Giants",
      city: "San Francisco",
      logo: "https://www.mlbstatic.com/team-logos/137.svg",
      primaryColor: "#FD5A1E",
      secondaryColor: "#27251F"
    },
    awayTeam: {
      id: "1",
      name: "Boston Red Sox",
      shortName: "Red Sox",
      city: "Boston",
      logo: "https://www.mlbstatic.com/team-logos/111.svg",
      primaryColor: "#BD3039",
      secondaryColor: "#0C2340"
    },
    date: "2025-04-15",
    time: "7:05 PM",
    venue: "Oracle Park",
    status: "scheduled"
  },
  {
    id: "game-2",
    homeTeam: {
      id: "28",
      name: "San Francisco Giants",
      shortName: "Giants",
      city: "San Francisco",
      logo: "https://www.mlbstatic.com/team-logos/137.svg",
      primaryColor: "#FD5A1E",
      secondaryColor: "#27251F"
    },
    awayTeam: {
      id: "10",
      name: "Oakland Athletics",
      shortName: "Athletics",
      city: "Oakland",
      logo: "https://www.mlbstatic.com/team-logos/133.svg",
      primaryColor: "#003831",
      secondaryColor: "#EFB21E"
    },
    date: "2025-04-16",
    time: "1:05 PM",
    venue: "Oracle Park",
    status: "scheduled"
  },
  {
    id: "game-3",
    homeTeam: {
      id: "13",
      name: "Los Angeles Dodgers",
      shortName: "Dodgers", 
      city: "Los Angeles",
      logo: "https://www.mlbstatic.com/team-logos/119.svg",
      primaryColor: "#005A9C",
      secondaryColor: "#FFFFFF"
    },
    awayTeam: {
      id: "28",
      name: "San Francisco Giants",
      shortName: "Giants",
      city: "San Francisco",
      logo: "https://www.mlbstatic.com/team-logos/137.svg",
      primaryColor: "#FD5A1E",
      secondaryColor: "#27251F"
    },
    date: "2025-04-22",
    time: "7:10 PM",
    venue: "Dodger Stadium",
    status: "scheduled"
  }
];

// Fetch future games for a team
export const fetchTeamGames = async (teamId: string): Promise<Game[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('games')
      .select(`
        *,
        homeTeam:homeTeamId(*),
        awayTeam:awayTeamId(*)
      `)
      .or(`homeTeamId.eq.${teamId},awayTeamId.eq.${teamId}`)
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(10);
    
    if (error) throw error;
    
    // If we have data from Supabase, use it
    if (data && data.length > 0) {
      return data;
    }
    
    // Otherwise fall back to demo data
    console.log('No games found in database, using demo data');
    // Filter demo games to only show games for the requested team
    return demoGames.filter(game => 
      game.homeTeam.id === teamId || game.awayTeam.id === teamId
    );
  } catch (error) {
    console.error('Error fetching team games:', error);
    toast({
      title: "Using demo data",
      description: "Failed to load game data from server, showing sample games",
      variant: "default"
    });
    // Return filtered demo data when API fails
    return demoGames.filter(game => 
      game.homeTeam.id === teamId || game.awayTeam.id === teamId
    );
  }
};
