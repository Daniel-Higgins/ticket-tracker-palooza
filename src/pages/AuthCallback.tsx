
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the session from the URL (Supabase will handle this automatically)
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback page loaded, processing authentication...");
        
        // Get the URL hash parameters to confirm auth redirects
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          toast({
            title: "Authentication failed",
            description: error.message || "Please try again.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }
        
        if (session) {
          console.log("Session found, redirecting to dashboard");
          // Authentication successful, redirect to dashboard
          toast({
            title: "Successfully signed in",
            description: "Welcome back!",
          });
          navigate('/dashboard');
        } else {
          console.log("No session found, redirecting to home");
          // No session found, redirect to home
          toast({
            title: "Sign in failed",
            description: "No session was created. Please try again.",
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to handle auth callback:', error);
        toast({
          title: "Authentication error",
          description: "An unexpected error occurred during sign in.",
          variant: "destructive"
        });
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
