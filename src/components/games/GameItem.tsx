
import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Game } from '@/lib/types';
import { TicketPriceCard } from '@/components/TicketPriceCard';

interface GameItemProps {
  game: Game;
  expandedGameId: string | null;
  toggleGameExpand: (gameId: string) => void;
  includeFees: boolean;
  showTrackOption?: boolean;
  userId?: string;
  isTracked?: boolean;
  onTrackToggle?: (gameId: string) => Promise<void>;
  trackingLoading: string | null;
  teamStadiums?: Record<string, string>;
}

export function GameItem({
  game,
  expandedGameId,
  toggleGameExpand,
  includeFees,
  showTrackOption,
  userId,
  isTracked = false,
  onTrackToggle,
  trackingLoading,
  teamStadiums
}: GameItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const getStadiumName = (game: Game) => {
    if (!teamStadiums) return game.venue;
    
    if (game.homeTeam.id && teamStadiums[game.homeTeam.id]) {
      return teamStadiums[game.homeTeam.id];
    }
    
    return game.venue;
  };

  return (
    <div
      key={game.id}
      className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden transition-all duration-300 animate-fade-in"
    >
      <div className="flex justify-between items-center px-4 pt-4">
        {showTrackOption && userId && (
          <div className="flex items-center gap-2">
            <Switch
              id={`track-${game.id}`}
              checked={isTracked}
              onCheckedChange={() => onTrackToggle?.(game.id)}
              disabled={trackingLoading === game.id}
            />
            <Label htmlFor={`track-${game.id}`} className="text-sm text-gray-800">
              {isTracked ? "Tracking" : "Track"}
            </Label>
          </div>
        )}
        {!showTrackOption && <div />}
        
        <div>
          <span className="text-xs text-gray-600">
            {isTracked 
              ? "You'll receive price updates for this game" 
              : ""}
          </span>
        </div>
      </div>
      
      <div
        className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer"
        onClick={() => toggleGameExpand(game.id)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(game.date)}</span>
            <span>•</span>
            <span>{game.time}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <img
                src={game.awayTeam.logo}
                alt={game.awayTeam.name}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="font-medium ml-2 text-gray-900">{game.awayTeam.shortName}</span>
            </div>
            
            <span className="text-gray-600">@</span>
            
            <div className="flex items-center">
              <img
                src={game.homeTeam.logo}
                alt={game.homeTeam.name}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="font-medium ml-2 text-gray-900">{game.homeTeam.shortName}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <MapPin className="h-4 w-4" />
            <span>{getStadiumName(game)}</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full p-2 mt-4 sm:mt-0 text-gray-700"
        >
          {expandedGameId === game.id ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {expandedGameId === game.id && (
        <div className="border-t border-border/50 p-4 sm:p-6 animate-slide-up bg-white">
          <TicketPriceCard 
            gameId={game.id} 
            includeFees={includeFees} 
          />
        </div>
      )}
    </div>
  );
}
