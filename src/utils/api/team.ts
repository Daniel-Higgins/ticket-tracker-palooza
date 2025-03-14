
import { Team } from '@/lib/types';
import { toast } from "@/hooks/use-toast";
import { mlbTeams } from '../staticData';

// Only use static MLB team data from S3 bucket
export const fetchTeams = async (): Promise<Team[]> => {
  try {
    console.log('Using MLB teams from S3 bucket, total count:', mlbTeams.length);
    if (mlbTeams.length > 0) {
      console.log('Sample logo URL from updated S3 bucket:', mlbTeams[0].logo);
    }
    
    return mlbTeams;
  } catch (error) {
    console.error('Error getting team data:', error);
    toast({
      title: "Error loading teams",
      description: "There was a problem loading team data. Please try again later.",
      variant: "destructive"
    });
    
    // Return empty array if everything fails
    return [];
  }
};
