
import { supabase } from '@/lib/supabase';
import { Team } from '@/lib/types';
import { fetchTeams } from '../team';
import { toast } from '@/hooks/use-toast';

// Add a team to a user's favorites
export const addFavoriteTeam = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    console.log(`API: Adding team ${teamId} to favorites for user ${userId}`);
    
    // First verify that the team exists in our data
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
      .from('user_favorites')
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
    
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('userid', userId)
      .eq('teamid', teamId);
    
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

// Check if a team is a favorite for a user
export const isTeamFavorite = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    if (!userId || !teamId) return false;
    
    console.log(`Checking if team ${teamId} is favorite for user ${userId}`);
    
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('userid', userId)
      .eq('teamid', teamId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking if team is favorite:', error);
      return false;
    }
    
    const isFavorite = !!data;
    console.log('Is team favorite result:', isFavorite);
    return isFavorite;
  } catch (error) {
    console.error('Error checking if team is favorite:', error);
    return false;
  }
};

// Fetch all favorite teams for a user
export const fetchUserFavoriteTeams = async (userId: string): Promise<Team[]> => {
  try {
    console.log(`API: Fetching favorite teams for user ${userId}`);
    
    // Fetch favorite team IDs
    const { data: favorites, error } = await supabase
      .from('user_favorites')
      .select('teamid')
      .eq('userid', userId);
    
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
