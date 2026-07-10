import { create } from 'zustand';
import type { Room, Player, GameMode } from '@/src/types';
import { mockRoom } from '@/src/constants/mockData';
import { generateRoomCode } from '@/src/constants';

interface RoomStore {
  room: Room | null;
  isLoading: boolean;
  error: string | null;

  createRoom: (name: string, maxPlayers: number, gameMode: GameMode, host: Player) => void;
  joinRoom: (room: Room) => void;
  setRoom: (room: Room) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, partial: Partial<Player>) => void;
  setPlayerReady: (playerId: string, ready: boolean) => void;
  startGame: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  isLoading: false,
  error: null,

  createRoom: (name, maxPlayers, gameMode, host) => {
    const code = generateRoomCode();
    const room: Room = {
      id: `room_${Date.now()}`,
      name,
      code,
      hostId: host.userId,
      hostName: host.name,
      maxPlayers,
      gameMode,
      players: [{ ...host, isHost: true, isReady: true }],
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };
    set({ room, isLoading: false, error: null });
  },

  joinRoom: (room) => set({ room, isLoading: false, error: null }),

  setRoom: (room) => set({ room }),

  addPlayer: (player) =>
    set((state) => {
      if (!state.room) return state;
      if (state.room.players.length >= state.room.maxPlayers) return state;
      return {
        room: {
          ...state.room,
          players: [...state.room.players, player],
        },
      };
    }),

  removePlayer: (playerId) =>
    set((state) => {
      if (!state.room) return state;
      return {
        room: {
          ...state.room,
          players: state.room.players.filter((p) => p.id !== playerId),
        },
      };
    }),

  updatePlayer: (playerId, partial) =>
    set((state) => {
      if (!state.room) return state;
      return {
        room: {
          ...state.room,
          players: state.room.players.map((p) =>
            p.id === playerId ? { ...p, ...partial } : p
          ),
        },
      };
    }),

  setPlayerReady: (playerId, ready) =>
    set((state) => {
      if (!state.room) return state;
      return {
        room: {
          ...state.room,
          players: state.room.players.map((p) =>
            p.id === playerId ? { ...p, isReady: ready, status: ready ? 'ready' : 'waiting' } : p
          ),
        },
      };
    }),

  startGame: () =>
    set((state) => ({
      room: state.room ? { ...state.room, status: 'in-progress' } : null,
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearRoom: () => set({ room: null, error: null, isLoading: false }),
}));
