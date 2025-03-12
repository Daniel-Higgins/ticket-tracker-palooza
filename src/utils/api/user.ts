
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

// Save a user's favorite team
export const saveUserFavoriteTeam = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .upsert({ userId, teamId });
    
    if (error) throw error;
    toast({
      title: "Success",
      description: "Team saved to favorites"
    });
    return true;
  } catch (error) {
    console.error('Error saving favorite team:', error);
    toast({
      title: "Error",
      description: "Failed to save team to favorites",
      variant: "destructive"
    });
    return false;
  }
};

// Update user preferences
export const updateUserPreferences = async (
  userId: string, 
  preferences: { includeFees: boolean; maxPrice?: number; preferredSources?: string[] }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({ 
        userId, 
        ...preferences
      });
    
    if (error) throw error;
    toast({
      title: "Success",
      description: "Preferences updated"
    });
    return true;
  } catch (error) {
    console.error('Error updating preferences:', error);
    toast({
      title: "Error",
      description: "Failed to update preferences",
      variant: "destructive"
    });
    return false;
  }
};
