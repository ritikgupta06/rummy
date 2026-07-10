import { create } from 'zustand';
import type { PlayingCard, Player, GameState, GameStatus } from '@/src/types';
import { createDeck, shuffleDeck } from '@/src/constants';
import { mockPlayers } from '@/src/constants/mockData';

interface GameStore extends GameState {
  initGame: (players: Player[]) => void;
  drawCard: () => void;
  discardCard: (cardId: string) => void;
  selectCard: (cardId: string) => void;
  toggleSelectCard: (cardId: string) => void;
  clearSelection: () => void;
  sortHand: () => void;
  setTurn: (playerId: string) => void;
  setTurnTime: (seconds: number) => void;
  setJoker: (card: PlayingCard) => void;
  setStatus: (status: GameStatus) => void;
  setWinner: (player: Player | null) => void;
  nextRound: () => void;
  reset: () => void;
}

function sortCards(cards: PlayingCard[]): PlayingCard[] {
  const suitOrder: Record<string, number> = { spades: 0, hearts: 1, clubs: 2, diamonds: 3 };
  return [...cards].sort((a, b) => {
    if (a.isJoker && !b.isJoker) return 1;
    if (!a.isJoker && b.isJoker) return -1;
    if (suitOrder[a.suit] !== suitOrder[b.suit]) return suitOrder[a.suit] - suitOrder[b.suit];
    return a.rank.localeCompare(b.rank, undefined, { numeric: true });
  });
}

export const useGameStore = create<GameStore>((set, get) => ({
  roomId: '',
  round: 1,
  status: 'waiting',
  currentTurn: '',
  turnTimeLeft: 30,
  deckCount: 0,
  discardPile: [],
  joker: null,
  players: [],
  hand: [],
  selectedCardIds: [],
  winner: null,

  initGame: (players) => {
    const deck = shuffleDeck(createDeck());
    const hand = deck.slice(0, 13);
    const remainingDeck = deck.slice(13);
    const joker = remainingDeck[0];
    const discardPile = [remainingDeck[1]];
    set({
      roomId: `game_${Date.now()}`,
      round: 1,
      status: 'in-progress',
      currentTurn: players[0]?.id ?? '',
      turnTimeLeft: 30,
      deckCount: remainingDeck.length - 2,
      discardPile,
      joker,
      players,
      hand,
      selectedCardIds: [],
      winner: null,
    });
  },

  drawCard: () => {
    const state = get();
    if (state.deckCount <= 0) return;
    const newCard: PlayingCard = {
      id: Math.random().toString(36).substring(2, 10),
      rank: '7',
      suit: 'hearts',
    };
    set({
      hand: [...state.hand, newCard],
      deckCount: state.deckCount - 1,
    });
  },

  discardCard: (cardId) => {
    const state = get();
    const card = state.hand.find((c) => c.id === cardId);
    if (!card) return;
    set({
      hand: state.hand.filter((c) => c.id !== cardId),
      discardPile: [...state.discardPile, card],
      selectedCardIds: state.selectedCardIds.filter((id) => id !== cardId),
    });
  },

  selectCard: (cardId) =>
    set((state) => ({
      selectedCardIds: [...state.selectedCardIds, cardId],
    })),

  toggleSelectCard: (cardId) =>
    set((state) => ({
      selectedCardIds: state.selectedCardIds.includes(cardId)
        ? state.selectedCardIds.filter((id) => id !== cardId)
        : [...state.selectedCardIds, cardId],
    })),

  clearSelection: () => set({ selectedCardIds: [] }),

  sortHand: () =>
    set((state) => ({
      hand: sortCards(state.hand),
    })),

  setTurn: (playerId) => set({ currentTurn: playerId, turnTimeLeft: 30 }),
  setTurnTime: (seconds) => set({ turnTimeLeft: seconds }),
  setJoker: (card) => set({ joker: card }),
  setStatus: (status) => set({ status }),
  setWinner: (player) => set({ winner: player, status: 'finished' }),

  nextRound: () => set((state) => ({ round: state.round + 1, status: 'in-progress' })),

  reset: () =>
    set({
      roomId: '',
      round: 1,
      status: 'waiting',
      currentTurn: '',
      turnTimeLeft: 30,
      deckCount: 0,
      discardPile: [],
      joker: null,
      players: [],
      hand: [],
      selectedCardIds: [],
      winner: null,
    }),
}));
