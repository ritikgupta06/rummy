import type { GameHistoryItem, LeaderboardEntry } from '@/src/types';
import { mockGameHistory, mockLeaderboard } from '@/src/constants/mockData';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const leaderboardService = {
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    await delay(800);
    return mockLeaderboard;
  },

  async getGameHistory(userId: string): Promise<GameHistoryItem[]> {
    await delay(600);
    return mockGameHistory;
  },
};
