
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';

interface StubHubToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  timestamp?: number;
}

/**
 * Retrieve StubHub API credentials from environment variables or Supabase
 */
const getCredentials = async (): Promise<{clientId: string, clientSecret: string} | null> => {
  try {
    // Try to get credentials from Supabase config
    const { data, error } = await supabase
      .from('api_credentials')
      .select('*')
      .eq('provider', 'stubhub')
      .single();
    
    if (error) throw error;
    
    if (data && data.client_id && data.client_secret) {
      return {
        clientId: data.client_id,
        clientSecret: data.client_secret
      };
    }
    
    // Fallback to demo mode
    console.warn('No StubHub credentials found. Using demo mode.');
    return null;
  } catch (error) {
    console.error('Error retrieving StubHub credentials:', error);
    return null;
  }
};

/**
 * Obtains an access token from StubHub API
 */
export const getStubHubToken = async (): Promise<StubHubToken | null> => {
  try {
    // Check if we have a cached token
    const cachedToken = localStorage.getItem('stubhub_token');
    if (cachedToken) {
      const tokenData = JSON.parse(cachedToken) as StubHubToken;
      // Check if token is still valid (with 5 min buffer)
      const now = Date.now();
      const tokenExpiry = tokenData.timestamp! + (tokenData.expires_in * 1000) - (5 * 60 * 1000);
      if (now < tokenExpiry) {
        console.log('Using cached StubHub token');
        return tokenData;
      }
    }
    
    // Get credentials
    const credentials = await getCredentials();
    if (!credentials) {
      toast({
        title: "StubHub API Error",
        description: "Missing API credentials. Using demo data.",
        variant: "destructive"
      });
      return null;
    }
    
    // Create authorization header
    const { clientId, clientSecret } = credentials;
    const authString = `${encodeURIComponent(clientId)}:${encodeURIComponent(clientSecret)}`;
    const base64Auth = btoa(authString);
    
    // Make token request
    const response = await fetch('https://account.stubhub.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&scope=read:events'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get StubHub token: ${response.status} ${response.statusText}`);
    }
    
    const tokenData = await response.json() as StubHubToken;
    
    // Add timestamp for expiry calculation
    tokenData.timestamp = Date.now();
    
    // Cache the token
    localStorage.setItem('stubhub_token', JSON.stringify(tokenData));
    
    console.log('StubHub token obtained successfully');
    return tokenData;
  } catch (error) {
    console.error('Error getting StubHub token:', error);
    toast({
      title: "StubHub API Error",
      description: "Failed to authenticate with StubHub API. Using demo data.",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Makes an authenticated request to the StubHub API
 */
export const stubHubApiRequest = async <T>(
  endpoint: string, 
  method: 'GET' | 'POST' = 'GET',
  body?: any
): Promise<T | null> => {
  try {
    // Get auth token
    const token = await getStubHubToken();
    if (!token) return null;
    
    // Make request
    const response = await fetch(`https://api.stubhub.com${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    
    if (!response.ok) {
      throw new Error(`StubHub API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('StubHub API request failed:', error);
    toast({
      title: "StubHub API Error",
      description: "Failed to fetch data from StubHub. Using demo data.",
      variant: "destructive"
    });
    return null;
  }
};
