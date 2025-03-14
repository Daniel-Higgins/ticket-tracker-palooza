
import { useState, useEffect } from 'react';
import { Game } from '@/lib/types';
import { trackGame, untrackGame, isGameTracked } from '@/utils/api/user/trackedGames';
import { toast } from '@/hooks/use-toast';

export function useGameTracking(games: Game[], userId?: string, onTrackToggle?: () => Promise<void>) {
  const [trackedGameIds, setTrackedGameIds] = useState<Set<string>>(new Set());
  const [trackingLoading, setTrackingLoading] = useState<string | null>(null);

  useEffect(() => {
    const loadTrackedGames = async () => {
      if (!userId) return;

      const tracked = new Set<string>();
      
      for (const game of games) {
        const isTracked = await isGameTracked(userId, game.id);
        if (isTracked) {
          tracked.add(game.id);
        }
      }
      
      setTrackedGameIds(tracked);
    };
    
    loadTrackedGames();
  }, [userId, games]);

  const handleTrackToggle = async (gameId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to track games",
        variant: "destructive"
      });
      return;
    }
    
    setTrackingLoading(gameId);
    
    try {
      const isCurrentlyTracked = trackedGameIds.has(gameId);
      let success;
      
      if (isCurrentlyTracked) {
        success = await untrackGame(userId, gameId);
        if (success) {
          const newTracked = new Set(trackedGameIds);
          newTracked.delete(gameId);
          setTrackedGameIds(newTracked);
        }
      } else {
        success = await trackGame(userId, gameId);
        if (success) {
          const newTracked = new Set(trackedGameIds);
          newTracked.add(gameId);
          setTrackedGameIds(newTracked);
        }
      }
      
      if (success && onTrackToggle) {
        await onTrackToggle();
      }
    } catch (error) {
      console.error('Error toggling game tracking:', error);
      toast({
        title: "Error",
        description: "Failed to update tracking status",
        variant: "destructive"
      });
    } finally {
      setTrackingLoading(null);
    }
  };

  return {
    trackedGameIds,
    trackingLoading,
    handleTrackToggle,
    isGameTracked: (gameId: string) => trackedGameIds.has(gameId)
  };
}
