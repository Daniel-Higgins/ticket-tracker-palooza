
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { Team } from '@/lib/types';
import { fetchTeams } from '../team';

// Add a team to user's favorites
export const addFavoriteTeam = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    console.log("Adding favorite team:", { userId, teamId });
    
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        userid: userId,
        teamid: teamId
      });
    
    if (error) {
      // If it's a duplicate entry, don't show an error
      if (error.code === '23505') {
        console.log("Team is already a favorite, ignoring duplicate");
        return true;
      }
      throw error;
    }
    
    console.log("Team successfully added to favorites:", data);
    return true;
  } catch (error) {
    console.error('Error adding favorite team:', error);
    toast({
      title: "Error",
      description: "Failed to add team to favorites",
      variant: "destructive"
    });
    return false;
  }
};

// Remove a team from user's favorites
export const removeFavoriteTeam = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    console.log("Removing favorite team:", { userId, teamId });
    
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('userid', userId)
      .eq('teamid', teamId);
    
    if (error) throw error;
    
    console.log("Team successfully removed from favorites");
    return true;
  } catch (error) {
    console.error('Error removing favorite team:', error);
    toast({
      title: "Error",
      description: "Failed to remove team from favorites",
      variant: "destructive"
    });
    return false;
  }
};

// Get all favorite teams for a user
export const fetchUserFavoriteTeams = async (userId: string): Promise<Team[]> => {
  try {
    console.log("Fetching favorite teams for user:", userId);
    
    const { data, error } = await supabase
      .from('user_favorites')
      .select('teamid')
      .eq('userid', userId);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log("No favorite teams found");
      return [];
    }
    
    // Get team IDs from favorites
    const teamIds = data.map(favorite => favorite.teamid);
    console.log("Found favorite team IDs:", teamIds);
    
    // Fetch all teams
    const allTeams = await fetchTeams();
    
    // Filter to get only the favorite teams
    const favoriteTeams = allTeams.filter(team => teamIds.includes(team.id));
    console.log("Filtered favorite teams:", favoriteTeams.map(t => t.name));
    
    return favoriteTeams;
  } catch (error) {
    console.error('Error fetching user favorite teams:', error);
    toast({
      title: "Error loading favorites",
      description: "We couldn't load your favorite teams",
      variant: "destructive"
    });
    return [];
  }
};

// Check if a team is in user's favorites
export const isTeamFavorite = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('userid', userId)
      .eq('teamid', teamId)
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
    console.error('Error checking if team is favorite:', error);
    return false;
  }
};
