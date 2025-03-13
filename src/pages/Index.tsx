
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TeamSelector } from '@/components/TeamSelector';
import { ChevronDown } from 'lucide-react';

export default function Index() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    // Navigate to team page when a team is selected
    navigate(`/team/${teamId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20"
        >
          <div 
            className={`max-w-4xl mx-auto transition-all duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-10'
            }`}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black">
              Find the Perfect MLB Tickets at the Best Price
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Track ticket prices across major platforms and never miss a deal on your favorite MLB games.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
              <TeamSelector 
                selectedTeamId={selectedTeamId} 
                onSelectTeam={handleSelectTeam}
              />
              <span className="text-muted-foreground">or</span>
              <Link to="/teams">
                <Button size="lg" className="rounded-full">
                  Browse All Teams
                </Button>
              </Link>
            </div>
            
            {/* Small decorative images around the hero */}
            <div className="relative mt-8 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1508344228533-ee2dea0aa407?w=300&h=200&crop=entropy&auto=format&fit=crop&q=80"
                alt="Baseball stadium" 
                className="absolute -top-24 -right-12 md:-right-24 w-16 h-16 md:w-20 md:h-20 rounded-lg shadow-md rotate-3 object-cover hidden sm:block"
              />
              <img 
                src="https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=300&h=200&crop=entropy&auto=format&fit=crop&q=80"
                alt="Baseball" 
                className="absolute -bottom-10 -left-8 md:-left-20 w-14 h-14 md:w-16 md:h-16 rounded-lg shadow-md -rotate-6 object-cover hidden sm:block"
              />
            </div>
          </div>
          
          <button 
            onClick={scrollToFeatures}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float"
          >
            <ChevronDown className="h-8 w-8 text-muted-foreground" />
          </button>
          
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>
        </section>
        
        {/* Features Section */}
        <section 
          ref={featuresRef} 
          className="py-20 px-4 bg-accent/50"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">How FindGuy Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="glass-card p-6 animate-on-scroll">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Select Your Team</h3>
                <p className="text-muted-foreground">
                  Choose your favorite MLB team to see all upcoming games and available ticket options.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=300&h=200&crop=entropy&auto=format&fit=crop&q=80"
                  alt="Baseball team" 
                  className="w-12 h-12 rounded-full shadow-sm mt-4 object-cover mx-auto"
                />
              </div>
              
              <div className="glass-card p-6 animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Compare Prices</h3>
                <p className="text-muted-foreground">
                  View and compare ticket prices from StubHub, Ticketmaster, Gametime, and more in real-time.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1519810755548-39cd217da494?w=300&h=200&crop=entropy&auto=format&fit=crop&q=80"
                  alt="Price chart" 
                  className="w-12 h-12 rounded-full shadow-sm mt-4 object-cover mx-auto"
                />
              </div>
              
              <div className="glass-card p-6 animate-on-scroll" style={{ transitionDelay: '0.4s' }}>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Track Over Time</h3>
                <p className="text-muted-foreground">
                  Monitor how prices change as game day approaches and get notified of drops for your saved games.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1593455076828-60ba88074c44?w=300&h=200&crop=entropy&auto=format&fit=crop&q=80"
                  alt="Baseball glove" 
                  className="w-12 h-12 rounded-full shadow-sm mt-4 object-cover mx-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Find the Best Deals?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Create an account to save your favorite teams, track price changes, and get alerts when prices drop.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/teams">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Teams
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
            </div>
            
            {/* Small decorative images */}
            <div className="relative mt-12 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&h=200&crop=entropy&auto=format&fit=crop&q=80"
                alt="Baseball stadium crowd" 
                className="w-14 h-14 rounded-full shadow-md -rotate-3 object-cover mx-2"
              />
              <img 
                src="https://images.unsplash.com/photo-1581509129331-61f4e5dd42a3?w=300&h=200&crop=entropy&auto=format&fit=crop&q=80"
                alt="Baseball glove" 
                className="w-14 h-14 rounded-full shadow-md rotate-6 object-cover mx-2"
              />
              <img 
                src="https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=300&h=200&crop=entropy&auto=format&fit=crop&q=80"
                alt="Baseball field" 
                className="w-14 h-14 rounded-full shadow-md -rotate-6 object-cover mx-2"
              />
            </div>
          </div>
        </section>
      </main>
      
      {/* Small banner ad at the bottom of the page */}
      <div className="w-full py-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="w-full h-[50px] bg-gray-100 border border-gray-200 rounded-md shadow-sm flex items-center justify-center">
            <div className="text-center text-gray-500">
              <span className="text-sm font-medium">Your Ad Here</span>
              <span className="text-xs text-gray-400 ml-2">728 x 50</span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
