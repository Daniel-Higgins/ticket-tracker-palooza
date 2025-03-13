
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";
import { Team } from '@/lib/types';
import { fetchTeams } from '../team';

// Add a team to user's favorites
export const addFavoriteTeam = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        team_id: teamId
      });
    
    if (error) {
      // If it's a duplicate entry, don't show an error
      if (error.code === '23505') {
        return true;
      }
      throw error;
    }
    
    toast({
      title: "Team added to favorites",
      description: "You'll see updates for this team on your dashboard"
    });
    
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
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('team_id', teamId);
    
    if (error) throw error;
    
    toast({
      title: "Team removed from favorites",
      description: "Team has been removed from your favorites"
    });
    
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
    const { data, error } = await supabase
      .from('user_favorites')
      .select('team_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Get team IDs from favorites
    const teamIds = data.map(favorite => favorite.team_id);
    
    // Fetch all teams
    const allTeams = await fetchTeams();
    
    // Filter to get only the favorite teams
    return allTeams.filter(team => teamIds.includes(team.id));
  } catch (error) {
    console.error('Error fetching user favorite teams:', error);
    return [];
  }
};

// Check if a team is in user's favorites
export const isTeamFavorite = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('team_id', teamId)
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
