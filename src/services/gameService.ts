import type { PlayingCard, Player, GameState } from '@/src/types';
import { createDeck, shuffleDeck } from '@/src/constants';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const gameService = {
  async startGame(players: Player[]): Promise<GameState> {
    await delay(1000);
    const deck = shuffleDeck(createDeck());
    const hand = deck.slice(0, 13);
    const remaining = deck.slice(13);

    return {
      roomId: `game_${Date.now()}`,
      round: 1,
      status: 'in-progress',
      currentTurn: players[0]?.id ?? '',
      turnTimeLeft: 30,
      deckCount: remaining.length - 2,
      discardPile: [remaining[1]],
      joker: remaining[0],
      players,
      hand,
      selectedCardIds: [],
      winner: null,
    };
  },

  async drawCard(gameId: string): Promise<PlayingCard> {
    await delay(300);
    return {
      id: Math.random().toString(36).substring(2, 10),
      rank: '7',
      suit: 'hearts',
    };
  },

  async discardCard(gameId: string, cardId: string): Promise<void> {
    await delay(300);
  },

  async declare(gameId: string): Promise<{ valid: boolean; score: number }> {
    await delay(1000);
    return { valid: true, score: 0 };
  },

  async getGameState(gameId: string): Promise<GameState> {
    await delay(500);
    const deck = shuffleDeck(createDeck());
    return {
      roomId: gameId,
      round: 1,
      status: 'in-progress',
      currentTurn: '',
      turnTimeLeft: 30,
      deckCount: 37,
      discardPile: [deck[0]],
      joker: deck[1],
      players: [],
      hand: deck.slice(2, 15),
      selectedCardIds: [],
      winner: null,
    };
  },
};
