
import { supabase } from '@/lib/supabase';
import { Team } from '@/lib/types';
import { fetchTeams } from '../team';
import { toast } from '@/hooks/use-toast';

// Add a team to a user's favorites
export const addFavoriteTeam = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    console.log(`API: Adding team ${teamId} to favorites for user ${userId}`);
    
    // First verify that the team exists in our local data
    const allTeams = await fetchTeams();
    const teamExists = allTeams.some(team => team.id === teamId);
    
    if (!teamExists) {
      console.error(`Team with ID ${teamId} does not exist in our data`);
      toast({
        title: "Could not add favorite",
        description: "This team doesn't exist in our database",
        variant: "destructive"
      });
      return false;
    }
    
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
    
    // Add the favorite - use user_favorites table instead of favorites
    // This avoids the foreign key constraint issue
    console.log('Inserting new favorite with:', { userid: userId, teamid: teamId });
    const { error: insertError } = await supabase
      .from('user_favorites')
      .insert([
        { userid: userId, teamid: teamId }
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
    toast({
      title: "Team added to favorites",
      description: "You'll see updates for this team on your dashboard",
    });
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
    
    // Try to remove from both tables to ensure it's removed
    // First try user_favorites table
    const { error: userFavError } = await supabase
      .from('user_favorites')
      .delete()
      .eq('userid', userId)
      .eq('teamid', teamId);
    
    if (userFavError) {
      console.error('Error removing from user_favorites:', userFavError);
    }
    
    // Then try favorites table as well
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('userid', userId)
      .eq('teamid', teamId)
      .eq('type', 'team');
    
    if (error && userFavError) {
      console.error('Error removing favorite team:', error);
      toast({
        title: "Could not remove favorite",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    console.log(`Successfully removed team ${teamId} from favorites for user ${userId}`);
    toast({
      title: "Team removed from favorites",
      description: "Team has been removed from your favorites"
    });
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
    // First check user_favorites table
    const { data: existingUserFavorite, error: checkUserError } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('userid', userId)
      .eq('teamid', teamId)
      .maybeSingle();
    
    // Then check favorites table
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('*')
      .eq('userid', userId)
      .eq('teamid', teamId)
      .eq('type', 'team')
      .maybeSingle();
    
    if ((checkError && checkError.code !== 'PGRST116') || 
        (checkUserError && checkUserError.code !== 'PGRST116')) {
      console.error('Error checking if team is favorite:', checkError || checkUserError);
      return false;
    }
    
    const isFavorite = !!existingFavorite || !!existingUserFavorite;
    console.log('Existing favorite check result:', isFavorite);
    
    if (isFavorite) {
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
    
    // Fetch favorite team IDs from both tables
    // First from user_favorites
    const { data: userFavorites, error: userError } = await supabase
      .from('user_favorites')
      .select('teamid')
      .eq('userid', userId);
    
    // Then from favorites
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('teamid')
      .eq('userid', userId)
      .eq('type', 'team');
    
    if ((error && !favorites) || (userError && !userFavorites)) {
      console.error('Error fetching favorites:', error || userError);
      throw error || userError;
    }
    
    // Combine both results and remove duplicates
    const userTeamIds = userFavorites ? userFavorites.map(fav => fav.teamid) : [];
    const favTeamIds = favorites ? favorites.map(fav => fav.teamid) : [];
    const allTeamIds = [...new Set([...userTeamIds, ...favTeamIds])];
    
    if (allTeamIds.length === 0) {
      console.log(`No favorite teams found for user ${userId}`);
      return [];
    }
    
    console.log(`Found ${allTeamIds.length} favorite team IDs for user ${userId}:`, allTeamIds);
    
    // Fetch full team details for each favorite
    const allTeams = await fetchTeams();
    const favoriteTeams = allTeams.filter(team => allTeamIds.includes(team.id));
    
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
    
    // Check in user_favorites table
    const { data: userData, error: userError } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('userid', userId)
      .eq('teamid', teamId)
      .maybeSingle();
    
    // Check in favorites table
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('userid', userId)
      .eq('teamid', teamId)
      .eq('type', 'team')
      .maybeSingle();
    
    if ((error && error.code !== 'PGRST116') || 
        (userError && userError.code !== 'PGRST116')) {
      console.error('Error checking if team is favorite:', error || userError);
      return false;
    }
    
    const isFavorite = !!data || !!userData;
    console.log('Is team favorite result:', isFavorite);
    return isFavorite;
  } catch (error) {
    console.error('Error checking if team is favorite:', error);
    return false;
  }
};
