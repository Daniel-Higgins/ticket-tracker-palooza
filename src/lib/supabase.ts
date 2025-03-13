
import { createClient } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";

// Make sure these values are set in your .env file
const supabaseUrl = 'https://phwyrjrdlpzirfiyjqep.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBod3lyanJkbHB6aXJmaXlqcWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MTA1MzIsImV4cCI6MjA1NzM4NjUzMn0.UDmctXpGuEFndhNwQYN8d_l_nESJEs1Q5P04oVLensc';

// Initialize the Supabase client with proper configuration
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce' // Explicitly set PKCE flow for better security
    }
  }
);

export const signInWithProvider = async (provider: 'google' | 'facebook') => {
  try {
    // Get the current URL to construct the correct redirect URL
    const origin = window.location.origin;
    const redirectTo = `${origin}/auth/callback`;
    
    console.log(`Starting ${provider} sign-in process`);
    console.log(`Current origin: ${origin}`);
    console.log(`Redirect URL: ${redirectTo}`);
    
    // Detailed troubleshooting information
    console.log('=== OAuth Configuration Guide ===');
    console.log('If you encounter "Invalid Origin" errors, please ensure:');
    console.log(`1. Add "${origin}" (without path or trailing slash) to Authorized JavaScript origins in Google Cloud Console`);
    console.log(`2. Add "${redirectTo}" to Authorized redirect URIs in Google Cloud Console`);
    console.log(`3. In Supabase Auth Settings, set Site URL to: "${origin}"`);
    console.log(`4. In Supabase Auth Settings, add Redirect URL: "${redirectTo}"`);
    console.log(`5. Check browser console for any CORS errors that might indicate misconfiguration`);
    console.log('6. Try clearing your browser cache and cookies if you\'ve previously attempted to sign in');
    console.log('===================================');
    
    // Add a timestamp to avoid any caching issues with the OAuth request
    const timestamp = new Date().getTime();
    
    // Explicitly log all options being passed to the OAuth call
    const options = {
      redirectTo,
      scopes: provider === 'google' ? 'profile email' : undefined,
      queryParams: { 
        // Add random values to avoid caching issues
        random: Math.random().toString(36).substring(2),
        timestamp: timestamp.toString()
      }
    };
    
    console.log('OAuth options:', JSON.stringify(options, null, 2));
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });

    if (error) {
      console.error(`Error initiating ${provider} sign in:`, error);
      
      // Special handling for common OAuth errors
      if (error.message?.includes('invalid_request') || error.message?.includes('origin')) {
        console.error('This appears to be an OAuth configuration issue. Please check your OAuth settings.');
        console.error('Full error:', JSON.stringify(error, null, 2));
        
        toast({
          title: "OAuth Configuration Error",
          description: "Please check that your application origins are correctly configured in OAuth settings.",
          variant: "destructive"
        });
      } else {
        console.error('Full error:', JSON.stringify(error, null, 2));
        throw error;
      }
      return { data: null, error };
    }

    console.log(`${provider} auth initiated successfully:`, data);
    
    // Log the URL we're being redirected to
    if (data?.url) {
      console.log('Redirect URL from Supabase:', data.url);
      
      // Parse and log the redirect URL components
      try {
        const redirectUrl = new URL(data.url);
        console.log('Parsed redirect URL:');
        console.log('- Protocol:', redirectUrl.protocol);
        console.log('- Host:', redirectUrl.host);
        console.log('- Pathname:', redirectUrl.pathname);
        console.log('- Search:', redirectUrl.search);
      } catch (e) {
        console.error('Could not parse redirect URL:', e);
      }
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in with provider:', error);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    toast({
      title: "Authentication failed",
      description: "Please check console for details and try again.",
      variant: "destructive"
    });
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    toast({
      title: "Sign out failed",
      description: "Please try again.",
      variant: "destructive"
    });
    return { error };
  }
};

// Listen for auth state changes
export const subscribeToAuthChanges = (callback: (event: any, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
