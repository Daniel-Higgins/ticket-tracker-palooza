
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
      detectSessionInUrl: true
    }
  }
);

export const signInWithProvider = async (provider: 'google' | 'facebook') => {
  try {
    // Get the current URL to construct the correct redirect URL
    const redirectTo = `${window.location.origin}/auth/callback`;
    console.log(`Initiating sign in with ${provider}, redirect URL: ${redirectTo}`);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        // Adding scopes for Google authentication
        scopes: provider === 'google' ? 'profile email' : undefined
      },
    });

    if (error) {
      console.error(`Error initiating ${provider} sign in:`, error);
      throw error;
    }

    console.log(`${provider} auth initiated successfully`, data);
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in with provider:', error);
    toast({
      title: "Authentication failed",
      description: "Please try again.",
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
