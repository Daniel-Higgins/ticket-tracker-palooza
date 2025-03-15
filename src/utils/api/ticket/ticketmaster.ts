
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

interface TicketmasterToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  timestamp: number;
}

interface TicketmasterCredentials {
  client_id: string;
  client_secret: string;
}

let cachedToken: TicketmasterToken | null = null;

/**
 * Get Ticketmaster API credentials from Supabase
 */
export const getTicketmasterCredentials = async (): Promise<TicketmasterCredentials | null> => {
  try {
    const { data, error } = await supabase
      .from('api_credentials')
      .select('client_id, client_secret')
      .eq('provider', 'ticketmaster')
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      console.error('No Ticketmaster credentials found in database');
      return null;
    }
    
    return data as TicketmasterCredentials;
  } catch (error) {
    console.error('Error fetching Ticketmaster credentials:', error);
    return null;
  }
};

/**
 * Get a Ticketmaster API token
 * Handles caching and automatic renewal of expired tokens
 */
export const getTicketmasterToken = async (): Promise<TicketmasterToken | null> => {
  try {
    // Check if we have a cached token that's still valid (with 5 min buffer)
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (cachedToken && (cachedToken.timestamp + (cachedToken.expires_in * 1000) - bufferTime > now)) {
      console.log('Using cached Ticketmaster token');
      return cachedToken;
    }
    
    console.log('Fetching new Ticketmaster token...');
    
    // Get credentials from Supabase
    const credentials = await getTicketmasterCredentials();
    if (!credentials) {
      console.error('No Ticketmaster credentials available');
      return null;
    }
    
    // Base64 encode the client_id:client_secret for basic auth
    const auth = btoa(`${credentials.client_id}:${credentials.client_secret}`);
    
    // Request a new token
    const response = await fetch('https://oauth.ticketmaster.com/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ticketmaster API responded with ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Add timestamp to track when token was issued
    const tokenWithTimestamp: TicketmasterToken = {
      ...data,
      timestamp: Date.now()
    };
    
    // Cache the token
    cachedToken = tokenWithTimestamp;
    
    console.log('New Ticketmaster token acquired');
    return tokenWithTimestamp;
  } catch (error) {
    console.error('Error getting Ticketmaster token:', error);
    toast({
      title: "Ticketmaster Authentication Failed",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Make an API request to Ticketmaster's API
 * @param endpoint - API endpoint (starting with /)
 * @param method - HTTP method
 * @param params - Query parameters
 */
export const ticketmasterApiRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  params?: Record<string, string>
): Promise<T | null> => {
  try {
    const token = await getTicketmasterToken();
    if (!token) {
      console.error('No Ticketmaster token available for API request');
      return null;
    }
    
    const baseUrl = 'https://app.ticketmaster.com/discovery/v2';
    const url = new URL(`${baseUrl}${endpoint}`);
    
    // Add API key as a query parameter (required for Discovery API)
    const credentials = await getTicketmasterCredentials();
    if (credentials) {
      url.searchParams.append('apikey', credentials.client_id);
    }
    
    // Add any additional query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ticketmaster API responded with ${response.status}: ${errorText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('Error making Ticketmaster API request:', error);
    return null;
  }
};
