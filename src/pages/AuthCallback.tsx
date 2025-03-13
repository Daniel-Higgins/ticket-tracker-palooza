
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState<string>('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback page loaded, processing authentication...");
        
        // Extract hash and query parameters for debugging
        const hashParams = window.location.hash;
        const queryParams = window.location.search;
        
        console.log("URL hash:", hashParams);
        console.log("URL query:", queryParams);
        
        setDebugInfo(`Processing auth: Hash: ${hashParams || 'none'}, Query: ${queryParams || 'none'}`);
        
        // Get the session from the URL (Supabase will handle this automatically)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          setDebugInfo(`Auth error: ${error.message}`);
          
          toast({
            title: "Authentication failed",
            description: error.message || "Please check console and try again.",
            variant: "destructive"
          });
          
          // Wait a bit before redirecting on error so user can see the error
          setTimeout(() => navigate('/'), 3000);
          return;
        }
        
        if (session) {
          console.log("Session found, redirecting to dashboard");
          setDebugInfo('Success! Redirecting to dashboard...');
          
          // Authentication successful, redirect to dashboard
          toast({
            title: "Successfully signed in",
            description: "Welcome back!",
          });
          
          navigate('/dashboard');
        } else {
          console.log("No session found, checking for access_token in URL");
          
          // Check if we have an access_token in the URL (some OAuth providers use this)
          if (hashParams.includes('access_token') || queryParams.includes('code')) {
            console.log("OAuth token found in URL, exchanging for session");
            setDebugInfo('OAuth token found, exchanging for session...');
            
            // If we have an access_token but no session, we need to exchange the token
            // This is handled by Supabase automatically on page load, but sometimes needs a reload
            window.location.reload();
            return;
          }
          
          console.log("No session or OAuth tokens found, redirecting to home");
          setDebugInfo('No authentication data found. Redirecting home...');
          
          // No session found, redirect to home
          toast({
            title: "Sign in failed",
            description: "No session was created. Please try again.",
            variant: "destructive"
          });
          
          // Short delay before redirect to show the message
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (error) {
        console.error('Failed to handle auth callback:', error);
        setDebugInfo(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
        
        toast({
          title: "Authentication error",
          description: "An unexpected error occurred during sign in.",
          variant: "destructive"
        });
        
        // Wait a bit before redirecting on error
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="mt-4 text-muted-foreground">Completing sign in...</p>
        <p className="mt-2 text-xs text-muted-foreground/70">{debugInfo}</p>
      </div>
    </div>
  );
}
