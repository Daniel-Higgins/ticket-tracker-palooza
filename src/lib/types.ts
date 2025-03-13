
export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  venue: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'postponed';
}

export interface TicketSource {
  id: string;
  name: string;
  logo: string;
  url: string;
}

export interface TicketPrice {
  id: string;
  gameId: string;
  ticketCategoryId: string;
  sourceId: string;
  price: number;
  serviceFee: number;
  totalPrice: number;
  url: string;
  lastUpdated: string;
  section?: string; // Added section property
  row?: string; // Added row property
}

export interface TicketCategory {
  id: string;
  name: string;
  description: string;
}

export interface TicketPriceWithSource extends TicketPrice {
  source: TicketSource;
  displayPrice?: number;
}

export interface TicketPriceByCategory {
  category: TicketCategory;
  prices: TicketPriceWithSource[];
}

export interface User {
  id: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  favoriteTeams?: string[];
  preferences?: UserPreferences;
}

export interface UserPreferences {
  includeFees: boolean;
  maxPrice?: number;
  preferredSources?: string[];
}

export interface PriceAlert {
  id: string;
  userId: string;
  gameId: string;
  targetPrice: number;
  categoryId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PriceAlertWithGame extends PriceAlert {
  game: Game;
  category?: TicketCategory;
}
