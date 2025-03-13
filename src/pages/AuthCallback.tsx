
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the session from the URL (Supabase will handle this automatically)
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash parameters to confirm auth redirects
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          navigate('/');
          return;
        }
        
        if (session) {
          // Authentication successful, redirect to dashboard
          navigate('/dashboard');
        } else {
          // No session found, redirect to home
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to handle auth callback:', error);
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
