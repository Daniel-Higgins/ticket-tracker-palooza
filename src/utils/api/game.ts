import { Game, Team } from '@/lib/types';
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
      id: "17",
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
  },
  {
    id: "game-4",
    homeTeam: {
      id: "17",
      name: "Boston Red Sox",
      shortName: "Red Sox",
      city: "Boston",
      logo: "https://www.mlbstatic.com/team-logos/111.svg",
      primaryColor: "#BD3039",
      secondaryColor: "#0C2340"
    },
    awayTeam: {
      id: "18",
      name: "New York Yankees",
      shortName: "Yankees",
      city: "New York",
      logo: "https://www.mlbstatic.com/team-logos/147.svg",
      primaryColor: "#0C2340",
      secondaryColor: "#C4CED3"
    },
    date: "2025-04-18",
    time: "7:10 PM",
    venue: "Fenway Park",
    status: "scheduled"
  },
  {
    id: "game-5",
    homeTeam: {
      id: "17",
      name: "Boston Red Sox",
      shortName: "Red Sox",
      city: "Boston",
      logo: "https://www.mlbstatic.com/team-logos/111.svg",
      primaryColor: "#BD3039",
      secondaryColor: "#0C2340"
    },
    awayTeam: {
      id: "19",
      name: "Tampa Bay Rays",
      shortName: "Rays",
      city: "Tampa Bay",
      logo: "https://www.mlbstatic.com/team-logos/139.svg",
      primaryColor: "#092C5C",
      secondaryColor: "#8FBCE6"
    },
    date: "2025-04-20",
    time: "1:05 PM",
    venue: "Fenway Park",
    status: "scheduled"
  }
];

// Fetch future games for a team
export const fetchTeamGames = async (teamId: string): Promise<Game[]> => {
  try {
    console.log('Fetching games for team:', teamId);
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
    // Get team specific demo games
    const teamGames = demoGames.filter(game => 
      game.homeTeam.id === teamId || game.awayTeam.id === teamId
    );
    
    if (teamGames.length > 0) {
      return teamGames;
    } else {
      // If no team specific games, show some default ones for this team
      // by modifying a copy of the first demo game
      const defaultGame = JSON.parse(JSON.stringify(demoGames[0]));
      defaultGame.homeTeam.id = teamId;
      defaultGame.id = `demo-game-${teamId}`;
      defaultGame.date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return [defaultGame];
    }
  } catch (error) {
    console.error('Error fetching team games:', error);
    toast({
      title: "Using demo data",
      description: "Failed to load game data from server, showing sample games",
      variant: "default"
    });
    
    // Get team specific demo games
    const teamGames = demoGames.filter(game => 
      game.homeTeam.id === teamId || game.awayTeam.id === teamId
    );
    
    if (teamGames.length > 0) {
      return teamGames;
    } else {
      // If no team specific games, create one
      const team = await getTeamForDemo(teamId);
      const opponent = demoGames[0].awayTeam;
      const newGame: Game = {
        id: `demo-${teamId}-game`,
        homeTeam: team,
        awayTeam: opponent,
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: "7:10 PM",
        venue: `${team.city} Stadium`,
        status: "scheduled"
      };
      return [newGame];
    }
  }
};

// Helper function to get team data for demo
const getTeamForDemo = async (teamId: string): Promise<Team> => {
  try {
    const teams = await import('../staticData').then(module => module.mlbTeams);
    const team = teams.find(t => t.id === teamId);
    if (team) return team;
    
    // If team not found, return default
    return {
      id: teamId,
      name: "Team",
      shortName: "Team",
      city: "City",
      logo: "",
      primaryColor: "#000000",
      secondaryColor: "#ffffff"
    };
  } catch (e) {
    // Default team if all else fails
    return {
      id: teamId,
      name: "Team",
      shortName: "Team",
      city: "City",
      logo: "",
      primaryColor: "#000000",
      secondaryColor: "#ffffff"
    };
  }
};
