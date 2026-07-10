export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type CardRank =
  | 'A'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K';

export interface PlayingCard {
  id: string;
  rank: CardRank;
  suit: Suit;
  isJoker?: boolean;
  isSelected?: boolean;
}

export type GameMode = 'classic' | 'points' | 'pool' | 'deal';

export type PlayerStatus = 'waiting' | 'ready' | 'in-game' | 'disconnected';

export type GameStatus = 'waiting' | 'dealing' | 'in-progress' | 'finished';

export type TurnStatus = 'draw' | 'discard' | 'declare' | 'idle';

export interface User {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string | null;
  coins: number;
  gamesPlayed: number;
  wins: number;
  isPremium: boolean;
  createdAt: string;
}

export interface Player {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  isHost: boolean;
  isReady: boolean;
  status: PlayerStatus;
  position: number;
  score: number;
  cardsCount: number;
  isOnline: boolean;
}

export interface Room {
  id: string;
  name: string;
  code: string;
  hostId: string;
  hostName: string;
  maxPlayers: number;
  gameMode: GameMode;
  players: Player[];
  status: GameStatus;
  createdAt: string;
}

export interface GameState {
  roomId: string;
  round: number;
  status: GameStatus;
  currentTurn: string;
  turnTimeLeft: number;
  deckCount: number;
  discardPile: PlayingCard[];
  joker: PlayingCard | null;
  players: Player[];
  hand: PlayingCard[];
  selectedCardIds: string[];
  winner: Player | null;
}

export interface GameHistoryItem {
  id: string;
  roomName: string;
  mode: GameMode;
  playersCount: number;
  position: number;
  score: number;
  won: boolean;
  date: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string | null;
  wins: number;
  gamesPlayed: number;
  winRate: number;
  rank: number;
  coins: number;
}

export interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  sound: boolean;
  music: boolean;
  haptics: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}
