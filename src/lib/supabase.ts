import { createClient } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";

// Make sure these values are set in your .env file
const supabaseUrl = 'https://qncwpyhgjfmkbhrrfeuu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuY3dweWhnamZta2JocnJmZXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA3NTQ2NTcsImV4cCI6MjAxNjMzMDY1N30.WCZM_rF2ApJ9NXPzqk2nX9FCVOcVDHVJ1QIzHtAKEPY';

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
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

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
