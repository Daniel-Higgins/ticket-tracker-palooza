
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Facebook, X } from 'lucide-react';
import { signInWithProvider } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthModalProps {
  trigger?: React.ReactNode;
}

export function AuthModal({ trigger }: AuthModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [providerName, setProviderName] = useState<string | null>(null);

  // Reset error when modal opens/closes
  useEffect(() => {
    setAuthError(null);
  }, [open]);

  const handleSignIn = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setAuthError(null);
    setProviderName(provider);
    
    try {
      console.log(`Initiating ${provider} sign-in from AuthModal`);
      
      // Log the current URL details before sign-in
      console.log('Current location details:');
      console.log('- Origin:', window.location.origin);
      console.log('- Hostname:', window.location.hostname);
      console.log('- Pathname:', window.location.pathname);
      console.log('- Full URL:', window.location.href);
      
      const { error } = await signInWithProvider(provider);
      
      if (error) {
        console.error(`${provider} sign-in error:`, error);
        console.error('Full error:', JSON.stringify(error, null, 2));
        
        let errorMessage = error.message || `Could not sign in with ${provider}`;
        
        // Check for common OAuth errors
        if (errorMessage.includes('origin')) {
          errorMessage += ". Please check Supabase and Google OAuth configurations.";
        }
        
        setAuthError(errorMessage);
        throw error;
      }
      // The page will redirect to Google, so we don't need to handle success here
    } catch (error) {
      console.error(`Error in ${provider} sign in:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Log additional details that might help debugging
      console.log('Current URL:', window.location.href);
      console.log('Origin:', window.location.origin);
      
      setAuthError(errorMessage);
      toast({
        title: "Sign In Failed",
        description: `Could not sign in with ${provider}. Please check your console for details.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => handleSignIn('google');
  const handleFacebookSignIn = () => handleSignIn('facebook');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Sign In</Button>}
      </DialogTrigger>
      <DialogContent className="glass-card sm:max-w-md animate-scale-in">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-center text-2xl font-medium">Sign In</DialogTitle>
          <DialogDescription className="text-center">
            Sign in with your social account to track your favorite teams and ticket prices.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          {authError && (
            <Alert variant="destructive" className="text-sm">
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>{providerName} Authentication Error:</strong></p>
                  <p>{authError}</p>
                  <p className="text-xs mt-1">
                    Please make sure your Supabase and {providerName} OAuth configurations are correct.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 w-full h-12 transition-all duration-200 bg-white hover:bg-gray-50"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" className="mr-2">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading && providerName === 'google' ? 'Signing in...' : 'Continue with Google'}
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 w-full h-12 transition-all duration-200 bg-[#1877F2] hover:bg-[#0a66c2] text-white"
            onClick={handleFacebookSignIn}
            disabled={isLoading}
          >
            <Facebook className="mr-2 h-5 w-5" />
            {isLoading && providerName === 'facebook' ? 'Signing in...' : 'Continue with Facebook'}
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <Button 
            variant="ghost" 
            className="rounded-full p-2" 
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
