
import { getStubHubToken, stubHubApiRequest } from './stubhub';
import { getTicketmasterToken, ticketmasterApiRequest } from './ticketmaster';

/**
 * Test function to get and display StubHub token
 * For debugging purposes only
 */
export const testStubHubToken = async (): Promise<string> => {
  try {
    console.log('Testing StubHub token acquisition...');
    const token = await getStubHubToken();
    
    if (!token) {
      console.error('Failed to get StubHub token');
      return 'Error: Failed to get token. Check credentials in Supabase.';
    }
    
    console.log('Token acquired successfully!');
    console.log('Token expires in:', token.expires_in, 'seconds');
    
    // Return a masked version of the token for display
    const maskedToken = `${token.access_token.substring(0, 10)}...${token.access_token.substring(token.access_token.length - 10)}`;
    return `Success! Token acquired: ${maskedToken}`;
  } catch (error) {
    console.error('Error testing StubHub token:', error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

/**
 * Test a sample API request using the token
 */
export const testStubHubRequest = async (): Promise<string> => {
  try {
    console.log('Testing StubHub API request...');
    
    // Try a simple endpoint like /search/events/v3 with minimal parameters
    const response = await stubHubApiRequest<any>(
      '/search/events/v3?rows=1&start=0',
      'GET'
    );
    
    if (!response) {
      return 'Error: API request failed. Token may be invalid.';
    }
    
    console.log('API request successful:', response);
    return `Success! API request returned data for ${response.numFound || 0} events.`;
  } catch (error) {
    console.error('Error testing StubHub API request:', error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

/**
 * Test function to get and display Ticketmaster token
 * For debugging purposes only
 */
export const testTicketmasterToken = async (): Promise<string> => {
  try {
    console.log('Testing Ticketmaster token acquisition...');
    const token = await getTicketmasterToken();
    
    if (!token) {
      console.error('Failed to get Ticketmaster token');
      return 'Error: Failed to get token. Check credentials in Supabase.';
    }
    
    console.log('Token acquired successfully!');
    console.log('Token expires in:', token.expires_in, 'seconds');
    
    // Return a masked version of the token for display
    const maskedToken = `${token.access_token.substring(0, 10)}...${token.access_token.substring(token.access_token.length - 10)}`;
    return `Success! Token acquired: ${maskedToken}`;
  } catch (error) {
    console.error('Error testing Ticketmaster token:', error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

/**
 * Test a sample API request using the token
 */
export const testTicketmasterRequest = async (): Promise<string> => {
  try {
    console.log('Testing Ticketmaster API request...');
    
    // Try a simple endpoint like /events.json with minimal parameters
    const response = await ticketmasterApiRequest<any>(
      '/events.json',
      'GET',
      { 'size': '1' }
    );
    
    if (!response) {
      return 'Error: API request failed. Token may be invalid.';
    }
    
    console.log('API request successful:', response);
    const eventCount = response._embedded?.events?.length || 0;
    return `Success! API request returned data for ${eventCount} events.`;
  } catch (error) {
    console.error('Error testing Ticketmaster API request:', error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};
