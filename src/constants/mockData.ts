import type {
  User,
  Player,
  Room,
  GameHistoryItem,
  LeaderboardEntry,
  PlayingCard,
} from '@/src/types';
import { createDeck, shuffleDeck } from '@/src/constants';

export const mockUser: User = {
  id: 'usr_001',
  name: 'Arjun Sharma',
  phone: '+91 98765 43210',
  avatarUrl: null,
  coins: 12500,
  gamesPlayed: 348,
  wins: 192,
  isPremium: true,
  createdAt: '2024-08-15T10:00:00Z',
};

export const mockPlayers: Player[] = [
  {
    id: 'ply_001',
    userId: 'usr_001',
    name: 'Arjun Sharma',
    avatarUrl: null,
    isHost: true,
    isReady: true,
    status: 'ready',
    position: 0,
    score: 0,
    cardsCount: 13,
    isOnline: true,
  },
  {
    id: 'ply_002',
    userId: 'usr_002',
    name: 'Priya Patel',
    avatarUrl: null,
    isHost: false,
    isReady: true,
    status: 'ready',
    position: 1,
    score: 0,
    cardsCount: 13,
    isOnline: true,
  },
  {
    id: 'ply_003',
    userId: 'usr_003',
    name: 'Rohan Verma',
    avatarUrl: null,
    isHost: false,
    isReady: false,
    status: 'waiting',
    position: 2,
    score: 0,
    cardsCount: 13,
    isOnline: true,
  },
  {
    id: 'ply_004',
    userId: 'usr_004',
    name: 'Sneha Iyer',
    avatarUrl: null,
    isHost: false,
    isReady: false,
    status: 'waiting',
    position: 3,
    score: 0,
    cardsCount: 13,
    isOnline: false,
  },
];

export const mockRoom: Room = {
  id: 'room_001',
  name: 'Friday Night Rummy',
  code: 'RMY7K2P',
  hostId: 'usr_001',
  hostName: 'Arjun Sharma',
  maxPlayers: 4,
  gameMode: 'classic',
  players: mockPlayers,
  status: 'waiting',
  createdAt: '2025-01-15T20:00:00Z',
};

export const mockGameHistory: GameHistoryItem[] = [
  {
    id: 'gh_001',
    roomName: 'Weekend Warriors',
    mode: 'classic',
    playersCount: 4,
    position: 1,
    score: 45,
    won: true,
    date: '2025-01-14T22:30:00Z',
  },
  {
    id: 'gh_002',
    roomName: 'Quick Points',
    mode: 'points',
    playersCount: 3,
    position: 2,
    score: 78,
    won: false,
    date: '2025-01-13T19:00:00Z',
  },
  {
    id: 'gh_003',
    roomName: 'Pool Masters',
    mode: 'pool',
    playersCount: 6,
    position: 1,
    score: 120,
    won: true,
    date: '2025-01-12T21:45:00Z',
  },
  {
    id: 'gh_004',
    roomName: 'Deal Showdown',
    mode: 'deal',
    playersCount: 4,
    position: 3,
    score: 95,
    won: false,
    date: '2025-01-11T18:15:00Z',
  },
  {
    id: 'gh_005',
    roomName: 'Late Night Rummy',
    mode: 'classic',
    playersCount: 2,
    position: 1,
    score: 30,
    won: true,
    date: '2025-01-10T23:30:00Z',
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { id: 'lb_001', name: 'Vikram Singh', avatarUrl: null, wins: 520, gamesPlayed: 800, winRate: 65, rank: 1, coins: 89000 },
  { id: 'lb_002', name: 'Ananya Reddy', avatarUrl: null, wins: 480, gamesPlayed: 750, winRate: 64, rank: 2, coins: 76000 },
  { id: 'lb_003', name: 'Karthik Nair', avatarUrl: null, wins: 450, gamesPlayed: 720, winRate: 62.5, rank: 3, coins: 65000 },
  { id: 'lb_004', name: 'Arjun Sharma', avatarUrl: null, wins: 192, gamesPlayed: 348, winRate: 55.2, rank: 4, coins: 12500 },
  { id: 'lb_005', name: 'Diya Kapoor', avatarUrl: null, wins: 380, gamesPlayed: 650, winRate: 58.5, rank: 5, coins: 42000 },
  { id: 'lb_006', name: 'Arjun Mehta', avatarUrl: null, wins: 350, gamesPlayed: 620, winRate: 56.5, rank: 6, coins: 38000 },
  { id: 'lb_007', name: 'Kavya Rao', avatarUrl: null, wins: 320, gamesPlayed: 580, winRate: 55.2, rank: 7, coins: 32000 },
  { id: 'lb_008', name: 'Rahul Gupta', avatarUrl: null, wins: 290, gamesPlayed: 550, winRate: 52.7, rank: 8, coins: 28000 },
  { id: 'lb_009', name: 'Ishita Jain', avatarUrl: null, wins: 270, gamesPlayed: 510, winRate: 52.9, rank: 9, coins: 25000 },
  { id: 'lb_010', name: 'Aditya Bose', avatarUrl: null, wins: 250, gamesPlayed: 490, winRate: 51, rank: 10, coins: 22000 },
];

export function getMockHand(count = 13): PlayingCard[] {
  const deck = shuffleDeck(createDeck());
  return deck.slice(0, count);
}
