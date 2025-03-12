
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/sonner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
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
    toast.error('Authentication failed. Please try again.');
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
    toast.error('Sign out failed. Please try again.');
    return { error };
  }
};

// Listen for auth state changes
export const subscribeToAuthChanges = (callback: (event: any, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
