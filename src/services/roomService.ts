import type { Room, Player, GameMode } from '@/src/types';
import { mockRoom } from '@/src/constants/mockData';
import { generateRoomCode } from '@/src/constants';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const roomService = {
  async createRoom(
    name: string,
    maxPlayers: number,
    gameMode: GameMode,
    host: Player
  ): Promise<Room> {
    await delay(1500);
    const room: Room = {
      id: `room_${Date.now()}`,
      name,
      code: generateRoomCode(),
      hostId: host.userId,
      hostName: host.name,
      maxPlayers,
      gameMode,
      players: [{ ...host, isHost: true, isReady: true }],
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };
    return room;
  },

  async joinRoom(code: string, player: Player): Promise<Room> {
    await delay(1200);
    // Backend will look up room by code and add player
    const room: Room = {
      ...mockRoom,
      code: code.toUpperCase(),
      players: [...mockRoom.players, { ...player, isHost: false }],
    };
    return room;
  },

  async leaveRoom(roomId: string, playerId: string): Promise<void> {
    await delay(500);
  },

  async setReady(roomId: string, playerId: string, ready: boolean): Promise<void> {
    await delay(300);
  },

  async startGame(roomId: string): Promise<void> {
    await delay(800);
  },

  async getRoom(roomId: string): Promise<Room> {
    await delay(600);
    return mockRoom;
  },
};
