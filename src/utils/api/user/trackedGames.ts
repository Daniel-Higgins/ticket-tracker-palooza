
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";
import { Game } from '@/lib/types';
import { fetchTeamGames } from '../game';

// Track a game for the user
export const trackGame = async (userId: string, gameId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tracked_games')
      .insert({
        user_id: userId,
        game_id: gameId
      });
    
    if (error) {
      // If it's a duplicate entry, don't show an error
      if (error.code === '23505') {
        return true;
      }
      throw error;
    }
    
    toast({
      title: "Game tracked",
      description: "You'll see price updates for this game on your dashboard"
    });
    
    return true;
  } catch (error) {
    console.error('Error tracking game:', error);
    toast({
      title: "Error",
      description: "Failed to track game",
      variant: "destructive"
    });
    return false;
  }
};

// Untrack a game for the user
export const untrackGame = async (userId: string, gameId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tracked_games')
      .delete()
      .eq('user_id', userId)
      .eq('game_id', gameId);
    
    if (error) throw error;
    
    toast({
      title: "Game untracked",
      description: "Game has been removed from your tracked games"
    });
    
    return true;
  } catch (error) {
    console.error('Error untracking game:', error);
    toast({
      title: "Error",
      description: "Failed to untrack game",
      variant: "destructive"
    });
    return false;
  }
};

// Get all tracked games for a user
export const fetchUserTrackedGames = async (userId: string): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from('tracked_games')
      .select('game_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Get game IDs from tracked games
    const gameIds = data.map(tracked => tracked.game_id);
    
    // Get games from favorite teams first
    const favoriteTeams = await import('./favorites').then(m => m.fetchUserFavoriteTeams(userId));
    
    let allGames: Game[] = [];
    
    // Fetch games for each favorite team
    for (const team of favoriteTeams) {
      const teamGames = await fetchTeamGames(team.id);
      allGames = [...allGames, ...teamGames];
    }
    
    // Filter to get only the tracked games
    const trackedGames = allGames.filter(game => gameIds.includes(game.id));
    
    // If we don't have all tracked games yet, we may need to fetch more
    if (trackedGames.length < gameIds.length) {
      // Fetch some more games from demo data to fill in
      const missingGameIds = gameIds.filter(id => !trackedGames.some(game => game.id === id));
      
      // Add placeholder games for missing IDs
      for (const gameId of missingGameIds) {
        trackedGames.push({
          id: gameId,
          homeTeam: favoriteTeams[0] || { 
            id: 'unknown',
            name: 'Unknown Team',
            shortName: 'Unknown',
            city: 'Unknown',
            logo: '',
            primaryColor: '#000000',
            secondaryColor: '#ffffff'
          },
          awayTeam: {
            id: 'visitor',
            name: 'Visiting Team',
            shortName: 'Visitor',
            city: 'Visitor City',
            logo: '',
            primaryColor: '#cccccc',
            secondaryColor: '#333333'
          },
          date: new Date().toISOString().split('T')[0],
          time: '7:05 PM',
          venue: 'Stadium',
          status: 'scheduled'
        });
      }
    }
    
    return trackedGames;
  } catch (error) {
    console.error('Error fetching user tracked games:', error);
    return [];
  }
};

// Check if a game is being tracked by the user
export const isGameTracked = async (userId: string, gameId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('tracked_games')
      .select('id')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No row found error code
        return false;
      }
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking if game is tracked:', error);
    return false;
  }
};
