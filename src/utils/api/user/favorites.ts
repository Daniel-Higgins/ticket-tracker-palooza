
import { supabase } from '@/lib/supabase';
import { Team } from '@/lib/types';
import { fetchTeams } from '../team';
import { toast } from '@/hooks/use-toast';

// Add a team to a user's favorites
export const addFavoriteTeam = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    console.log(`API: Adding team ${teamId} to favorites for user ${userId}`);
    
    // Check if the favorite already exists
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('*')
      .eq('userid', userId)
      .eq('teamid', teamId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing favorite:', checkError);
      return false;
    }
      
    if (existingFavorite) {
      console.log(`Team ${teamId} is already a favorite for user ${userId}`);
      return true; // Already a favorite, consider it a success
    }
    
    // Add the favorite
    console.log('Inserting new favorite with:', { userid: userId, teamid: teamId, type: 'team' });
    const { error: insertError } = await supabase
      .from('favorites')
      .insert([
        { userid: userId, teamid: teamId, type: 'team' }
      ]);
    
    if (insertError) {
      console.error('Error adding favorite team:', insertError);
      toast({
        title: "Could not add favorite",
        description: insertError.message,
        variant: "destructive"
      });
      return false;
    }
    
    console.log(`Successfully added team ${teamId} to favorites for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error adding favorite team:', error);
    toast({
      title: "Error adding favorite",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

// Remove a team from a user's favorites
export const removeFavoriteTeam = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    console.log(`API: Removing team ${teamId} from favorites for user ${userId}`);
    
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('userid', userId)
      .eq('teamid', teamId)
      .eq('type', 'team');
    
    if (error) {
      console.error('Error removing favorite team:', error);
      toast({
        title: "Could not remove favorite",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    console.log(`Successfully removed team ${teamId} from favorites for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error removing favorite team:', error);
    toast({
      title: "Error removing favorite",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

// Toggle a team in a user's favorites (add if not present, remove if present)
export const toggleFavoriteTeam = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    console.log(`API: Toggling favorite status for team ${teamId} for user ${userId}`);
    
    // Check if the team is already a favorite
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('*')
      .eq('userid', userId)
      .eq('teamid', teamId)
      .eq('type', 'team')
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking if team is favorite:', checkError);
      return false;
    }
    
    console.log('Existing favorite check result:', existingFavorite);
    
    if (existingFavorite) {
      // If it's already a favorite, remove it
      return await removeFavoriteTeam(userId, teamId);
    } else {
      // If it's not a favorite, add it
      return await addFavoriteTeam(userId, teamId);
    }
  } catch (error) {
    console.error('Error toggling favorite team:', error);
    toast({
      title: "Error updating favorites",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

// Fetch all favorite teams for a user
export const fetchUserFavoriteTeams = async (userId: string): Promise<Team[]> => {
  try {
    console.log(`API: Fetching favorite teams for user ${userId}`);
    
    // Fetch favorite team IDs
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('teamid')
      .eq('userid', userId)
      .eq('type', 'team');
    
    if (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
    
    if (!favorites || favorites.length === 0) {
      console.log(`No favorite teams found for user ${userId}`);
      return [];
    }
    
    const teamIds = favorites.map(fav => fav.teamid);
    console.log(`Found ${teamIds.length} favorite team IDs for user ${userId}:`, teamIds);
    
    // Fetch full team details for each favorite
    const allTeams = await fetchTeams();
    const favoriteTeams = allTeams.filter(team => teamIds.includes(team.id));
    
    console.log(`Returning ${favoriteTeams.length} favorite teams for user ${userId}`);
    return favoriteTeams;
  } catch (error) {
    console.error('Error fetching favorite teams:', error);
    toast({
      title: "Error loading favorites",
      description: "We couldn't load your favorite teams",
      variant: "destructive"
    });
    return [];
  }
};

// Check if a team is a favorite for a user
export const isTeamFavorite = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    if (!userId || !teamId) return false;
    
    console.log(`Checking if team ${teamId} is favorite for user ${userId}`);
    
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('userid', userId)
      .eq('teamid', teamId)
      .eq('type', 'team')
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
      console.error('Error checking if team is favorite:', error);
      return false;
    }
    
    console.log('Is team favorite result:', !!data);
    return !!data;
  } catch (error) {
    console.error('Error checking if team is favorite:', error);
    return false;
  }
};
