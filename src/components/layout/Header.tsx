
import { useState } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { Home } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { AuthModal } from '@/components/auth/AuthModal';

export function Header() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
    setIsSigningOut(false);
  };

  return (
    <header className="w-full border-b border-border sticky top-0 bg-[#D3E4FD]/90 backdrop-blur supports-[backdrop-filter]:bg-[#D3E4FD]/70 z-50">
      <div className="container flex h-16 items-center justify-between relative">
        {/* Left side - Brand */}
        <div className="w-1/3 flex justify-start items-center">
          <Link to="/" className="flex items-center gap-2">
            <AnimatedLogo className="text-primary" />
            <span className="font-bold text-xl text-gray-800">FindGuy</span>
          </Link>
        </div>

        {/* Center - Navigation */}
        <div className="w-1/3 flex justify-center">
          <nav className="flex gap-6">
            <NavLink to="/">
              <div className="flex items-center gap-1">
                <Home size={18} />
                <span>Home</span>
              </div>
            </NavLink>
            <NavLink to="/teams">Teams</NavLink>
            {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          </nav>
        </div>

        {/* Right side - Auth/Avatar */}
        <div className="w-1/3 flex justify-end">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                    <AvatarFallback>{user.user_metadata?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthModal 
              trigger={<Button>Sign In</Button>}
            />
          )}
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

function NavLink({ to, children }: NavLinkProps) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "text-foreground font-medium transition-colors hover:text-foreground/80"
          : "text-gray-700 transition-colors hover:text-foreground/80"
      }
    >
      {children}
    </RouterNavLink>
  );
}
