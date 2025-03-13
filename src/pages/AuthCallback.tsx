
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState<string>('Processing authentication...');
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback page loaded, processing authentication...");
        
        // Extract hash and query parameters for debugging
        const hashParams = window.location.hash;
        const queryParams = window.location.search;
        const fullUrl = window.location.href;
        
        console.log("Full callback URL:", fullUrl);
        console.log("URL hash:", hashParams);
        console.log("URL query:", queryParams);
        
        setDebugInfo(`Processing auth - Full URL: ${fullUrl}`);
        
        // Check if there's an error parameter in the URL
        const urlParams = new URLSearchParams(queryParams);
        const urlError = urlParams.get('error');
        const urlErrorDescription = urlParams.get('error_description');
        
        if (urlError) {
          console.error('Error in OAuth callback URL:', urlError, urlErrorDescription);
          setError(`${urlError}: ${urlErrorDescription || 'No description provided'}`);
          
          toast({
            title: "Authentication failed",
            description: urlErrorDescription || "Error in the OAuth callback URL",
            variant: "destructive"
          });
          
          // Wait a bit before redirecting on error so user can see the error
          setTimeout(() => navigate('/'), 5000);
          return;
        }
        
        // Get the session from the URL (Supabase will handle this automatically)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          console.error('Full error object:', JSON.stringify(error, null, 2));
          setError(error.message || 'Unknown authentication error');
          setDebugInfo(`Auth error: ${error.message} (${error.status})`);
          
          toast({
            title: "Authentication failed",
            description: error.message || "Please check console and try again.",
            variant: "destructive"
          });
          
          // Wait a bit before redirecting on error so user can see the error
          setTimeout(() => navigate('/'), 5000);
          return;
        }
        
        if (session) {
          console.log("Session found:", session.user.email);
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
            console.log("OAuth token found in URL, exchanging for session...");
            setDebugInfo('OAuth token found, exchanging for session...');
            
            // If we have an access_token but no session, we need to exchange the token
            // This is handled by Supabase automatically on page load, but sometimes needs a reload
            window.location.reload();
            return;
          }
          
          console.log("No session or OAuth tokens found, redirecting to home");
          setError('No authentication data found in the URL');
          setDebugInfo('No authentication data found. Redirecting home...');
          
          // No session found, redirect to home
          toast({
            title: "Sign in failed",
            description: "No session was created. Please try again.",
            variant: "destructive"
          });
          
          // Short delay before redirect to show the message
          setTimeout(() => navigate('/'), 5000);
        }
      } catch (error) {
        console.error('Failed to handle auth callback:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        setError(error instanceof Error ? error.message : String(error));
        setDebugInfo(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
        
        toast({
          title: "Authentication error",
          description: "An unexpected error occurred during sign in.",
          variant: "destructive"
        });
        
        // Wait a bit before redirecting on error
        setTimeout(() => navigate('/'), 5000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {!error ? (
          <>
            <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="mt-4 text-muted-foreground">Completing sign in...</p>
          </>
        ) : (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription>
              {error}
              <button 
                className="block mt-2 text-xs underline"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide details" : "Show technical details"}
              </button>
            </AlertDescription>
          </Alert>
        )}
        
        {(showDetails || !error) && (
          <div className="mt-4 p-3 bg-muted text-muted-foreground rounded-md text-xs text-left overflow-auto max-h-64">
            <p className="font-medium mb-2">Debug Information:</p>
            <p className="whitespace-pre-wrap break-all">{debugInfo}</p>
            
            <p className="font-medium mt-4 mb-2">URL Information:</p>
            <p className="whitespace-pre-wrap break-all">Full URL: {window.location.href}</p>
            <p className="whitespace-pre-wrap break-all">Search: {window.location.search}</p>
            <p className="whitespace-pre-wrap break-all">Hash: {window.location.hash}</p>
            
            <p className="font-medium mt-4 mb-2">Environment:</p>
            <p>Origin: {window.location.origin}</p>
            <p>Hostname: {window.location.hostname}</p>
          </div>
        )}
        
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
