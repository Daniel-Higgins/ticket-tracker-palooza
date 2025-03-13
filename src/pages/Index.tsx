
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TeamSelector } from '@/components/TeamSelector';
import { ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Index() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [stadiumImageUrl, setStadiumImageUrl] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    // Get the stadium image from Supabase storage
    const fetchStadiumImage = async () => {
      try {
        // Check if there are images in the bucket
        const { data: files } = await supabase.storage
          .from('site-images')
          .list();
        
        // If we have images, get the URL of the first one
        if (files && files.length > 0) {
          const { data } = supabase.storage
            .from('site-images')
            .getPublicUrl(files[0].name);
          
          if (data) {
            setStadiumImageUrl(data.publicUrl);
          }
        } else {
          // Use a placeholder image if no images are found
          setStadiumImageUrl('/placeholder.svg');
        }
      } catch (error) {
        console.error('Error fetching stadium image:', error);
        // Use a placeholder image if there's an error
        setStadiumImageUrl('/placeholder.svg');
      }
    };
    
    fetchStadiumImage();
    
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
    // Navigate to team page when a team is selected - use correct path
    navigate(`/teams/${teamId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-20 overflow-hidden"
        >
          <div 
            className={`relative z-10 max-w-4xl mx-auto transition-all duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-10'
            }`}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-primary">
              Find the Perfect MLB Tickets at the Best Price
            </h1>
            
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <p className="text-xl md:text-2xl text-black font-medium mb-10 max-w-2xl mx-auto">
                Track ticket prices across major platforms and never miss a deal on your favorite MLB games.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <TeamSelector 
                  selectedTeamId={selectedTeamId} 
                  onSelectTeam={handleSelectTeam}
                />
                <span className="text-black font-medium">or</span>
                <Link to="/teams">
                  <Button size="lg" className="rounded-full">
                    Browse All Teams
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <button 
            onClick={scrollToFeatures}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10"
          >
            <ChevronDown className="h-8 w-8 text-primary drop-shadow-md" />
          </button>
        </section>
        
        {/* Features Section */}
        <section 
          ref={featuresRef} 
          className="py-20 px-4 bg-white relative"
        >
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-3xl font-bold text-center mb-16 text-black">How FindGuy Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white shadow-md rounded-xl p-6 animate-on-scroll">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2 text-black">Select Your Team</h3>
                <p className="text-black">
                  Choose your favorite MLB team to see all upcoming games and available ticket options.
                </p>
              </div>
              
              <div className="bg-white shadow-md rounded-xl p-6 animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2 text-black">Compare Prices</h3>
                <p className="text-black">
                  View and compare ticket prices from StubHub, Ticketmaster, Gametime, and more in real-time.
                </p>
              </div>
              
              <div className="bg-white shadow-md rounded-xl p-6 animate-on-scroll" style={{ transitionDelay: '0.4s' }}>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2 text-black">Track Over Time</h3>
                <p className="text-black">
                  Monitor how prices change as game day approaches and get notified of drops for your saved games.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4 bg-gray-50 relative">          
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-black">Ready to Find the Best Deals?</h2>
            <p className="text-xl text-black mb-10">
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
            
            {/* Stadium image preview */}
            <div className="mt-12">
              <div className="relative mx-auto w-full max-w-lg h-40 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={stadiumImageUrl || '/placeholder.svg'} 
                  alt="Night baseball game" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4">
                  <p className="text-white text-sm font-medium">Experience the atmosphere of America's favorite pastime</p>
                </div>
              </div>
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
