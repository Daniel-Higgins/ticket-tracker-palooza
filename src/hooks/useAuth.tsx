
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, signInWithProvider, signOut as signOutSupabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        console.log("Fetching initial session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        console.log("Initial session:", session ? "Found" : "Not found");
        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error getting initial session:', error);
        toast({
          title: "Session Error",
          description: "Failed to retrieve your session. Please try signing in again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user || null);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome!",
          description: "Successfully signed in"
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Goodbye!",
          description: "Successfully signed out"
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithProvider('google');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: "Sign In Failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive"
      });
    }
  };

  const signInWithFacebook = async () => {
    try {
      await signInWithProvider('facebook');
    } catch (error) {
      console.error('Error signing in with Facebook:', error);
      toast({
        title: "Sign In Failed",
        description: "Could not sign in with Facebook. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutSupabase();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign Out Failed",
        description: "Could not sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signInWithGoogle,
        signInWithFacebook,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
