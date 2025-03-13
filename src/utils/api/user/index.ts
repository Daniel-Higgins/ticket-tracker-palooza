
import { Team, Game } from '@/lib/types';
import { fetchUserFavoriteTeams } from './favorites';
import { fetchUserTrackedGames } from './trackedGames';

// Re-export from respective files
export * from './favorites';
export * from './trackedGames';

// Re-export the key functions at this level to maintain compatibility
export { fetchUserFavoriteTeams, fetchUserTrackedGames };
