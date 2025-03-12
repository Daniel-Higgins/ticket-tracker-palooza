
import { Game } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

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
    return data || [];
  } catch (error) {
    console.error('Error fetching team games:', error);
    toast({
      title: "Data Error",
      description: "Failed to load game data",
      variant: "destructive"
    });
    return [];
  }
};
