import type { GameMode, Suit, CardRank, PlayingCard } from '@/src/types';

export const APP_NAME = 'Rummy Royale';
export const APP_TAGLINE = 'Play. Win. Reign.';

export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 30;
export const TURN_DURATION_SECONDS = 30;

export const MAX_PLAYERS_OPTIONS = [2, 3, 4, 5, 6] as const;

export const GAME_MODES: { id: GameMode; label: string; description: string }[] = [
  { id: 'classic', label: 'Classic', description: 'Traditional Indian Rummy' },
  { id: 'points', label: 'Points', description: 'Point-based scoring' },
  { id: 'pool', label: 'Pool', description: 'Pool rummy with target score' },
  { id: 'deal', label: 'Deal', description: 'Best of deals' },
];

export const SUITS: Record<Suit, { symbol: string; color: string; name: string }> = {
  hearts: { symbol: '♥', color: '#DC2626', name: 'Hearts' },
  diamonds: { symbol: '♦', color: '#DC2626', name: 'Diamonds' },
  clubs: { symbol: '♣', color: '#1A1A1A', name: 'Clubs' },
  spades: { symbol: '♠', color: '#1A1A1A', name: 'Spades' },
};

export const RANKS: CardRank[] = [
  'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
];

export const CARD_VALUES: Record<CardRank, number> = {
  A: 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
  '8': 8, '9': 9, '10': 10, J: 10, Q: 10, K: 10,
};

export const AVATAR_COLORS = [
  ['#FACC15', '#CA8A04'],
  ['#22C55E', '#16A34A'],
  ['#3B82F6', '#1D4ED8'],
  ['#EF4444', '#B91C1C'],
  ['#A855F7', '#7E22CE'],
  ['#F97316', '#C2410C'],
  ['#06B6D4', '#0E7490'],
  ['#EC4899', '#BE185D'],
];

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SETTINGS: 'app_settings',
} as const;

export const API_TIMEOUT = 15000;

export const ROUTES = {
  SPLASH: '/splash',
  WELCOME: '/welcome',
  LOGIN: '/(auth)/login',
  OTP: '/(auth)/otp',
  HOME: '/(app)/home',
  CREATE_ROOM: '/(app)/create-room',
  JOIN_ROOM: '/(app)/join-room',
  LOBBY: '/(app)/lobby',
  GAME: '/(app)/game',
  PROFILE: '/(app)/profile',
  SETTINGS: '/(app)/settings',
} as const;

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 7; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function generateCardId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function createDeck(): PlayingCard[] {
  const deck: PlayingCard[] = [];
  for (const suit of Object.keys(SUITS) as Suit[]) {
    for (const rank of RANKS) {
      deck.push({
        id: generateCardId(),
        rank,
        suit,
        isJoker: false,
      });
    }
  }
  // Add 2 jokers
  deck.push({ id: generateCardId(), rank: 'A', suit: 'spades', isJoker: true });
  deck.push({ id: generateCardId(), rank: 'A', suit: 'hearts', isJoker: true });
  return deck;
}

export function shuffleDeck(deck: PlayingCard[]): PlayingCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
