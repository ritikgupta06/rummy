import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import {
  Users,
  Gamepad2,
  Check,
  Copy,
  Share2,
  Sparkles,
  PartyPopper,
} from 'lucide-react-native';
import { Header, Input, GradientButton, SecondaryButton, Toast } from '@/src/components/ui';
import { LoadingModal } from '@/src/components/modals';
import { colors, typography, spacing, radius, shadows } from '@/src/theme';
import { MAX_PLAYERS_OPTIONS, GAME_MODES } from '@/src/constants';
import { roomService } from '@/src/services';
import { useRoomStore, useAuthStore } from '@/src/store';
import { useToast, useShare, useHaptics } from '@/src/hooks';
import type { GameMode } from '@/src/types';

export default function CreateRoomScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const { share, copyToClipboard } = useShare();
  const { trigger, notify } = useHaptics();

  const createRoom = useRoomStore((s) => s.createRoom);
  const user = useAuthStore((s) => s.user);

  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [createdName, setCreatedName] = useState('');

  const formOpacity = useSharedValue(0);
  const successScale = useSharedValue(0);
  const successOpacity = useSharedValue(0);

  const formStyle = useAnimatedStyle(() => ({ opacity: formOpacity.value }));
  const successStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successOpacity.value,
  }));

  useState(() => {
    formOpacity.value = withTiming(1, { duration: 300 });
  });

  const handleCreate = useCallback(async () => {
    if (!roomName.trim()) {
      showToast('Please enter a room name', 'error');
      notify('error');
      return;
    }

    setLoading(true);
    try {
      const hostPlayer = {
        id: `ply_${user?.id ?? '001'}`,
        userId: user?.id ?? 'usr_001',
        name: user?.name ?? 'Player',
        avatarUrl: null,
        isHost: true,
        isReady: true,
        status: 'ready' as const,
        position: 0,
        score: 0,
        cardsCount: 13,
        isOnline: true,
      };

      const room = await roomService.createRoom(roomName.trim(), maxPlayers, gameMode, hostPlayer);
      createRoom(roomName.trim(), maxPlayers, gameMode, hostPlayer);
      setRoomCode(room.code);
      setCreatedName(room.name);
      setLoading(false);
      setCreated(true);
      notify('success');

      formOpacity.value = withTiming(0, { duration: 200 });
      successOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
      successScale.value = withDelay(100, withSpring(1, { damping: 14, stiffness: 120 }));
    } catch (err) {
      setLoading(false);
      showToast('Failed to create room', 'error');
      notify('error');
    }
  }, [roomName, maxPlayers, gameMode, user, createRoom, showToast, notify, formOpacity, successOpacity, successScale]);

  const handleCopy = useCallback(async () => {
    trigger('light');
    const success = await copyToClipboard(roomCode);
    showToast(success ? 'Room code copied!' : 'Copy failed', success ? 'success' : 'error');
  }, [roomCode, copyToClipboard, showToast, trigger]);

  const handleShare = useCallback(async () => {
    trigger('light');
    await share(
      `Join my rummy room "${createdName}"! Use code: ${roomCode} to join.`,
      'Rummy Royale Room Invite'
    );
  }, [createdName, roomCode, share, trigger]);

  const handleGoToLobby = useCallback(() => {
    trigger('medium');
    router.push('/(app)/lobby');
  }, [router, trigger]);

  if (created) {
    return (
      <LinearGradient
        colors={['#0A1F16', '#071A12']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <Header title="Room Created" onBack={() => {}} />
        <View style={styles.successContent}>
          <Animated.View style={[styles.successCard, successStyle]}>
            <LinearGradient
              colors={['#16A34A', '#0F5132']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.successGradient}
            >
              <View style={styles.successIcon}>
                <LinearGradient
                  colors={['#FDE047', '#FACC15']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.successIconBg}
                >
                  <PartyPopper size={32} color="#1A1A1A" />
                </LinearGradient>
              </View>
              <Text style={styles.successTitle}>Room Created!</Text>
              <Text style={styles.successSubtitle}>Your room is ready to share</Text>

              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>Room Code</Text>
                <Text style={styles.codeText}>{roomCode}</Text>
              </View>

              <View style={styles.roomInfoRow}>
                <View style={styles.roomInfoItem}>
                  <Text style={styles.roomInfoLabel}>Room Name</Text>
                  <Text style={styles.roomInfoValue} numberOfLines={1}>{createdName}</Text>
                </View>
                <View style={styles.roomInfoItem}>
                  <Text style={styles.roomInfoLabel}>Players</Text>
                  <Text style={styles.roomInfoValue}>1/{maxPlayers}</Text>
                </View>
                <View style={styles.roomInfoItem}>
                  <Text style={[styles.roomInfoLabel, { textTransform: 'capitalize' }]}>Mode</Text>
                  <Text style={[styles.roomInfoValue, { textTransform: 'capitalize' }]}>{gameMode}</Text>
                </View>
              </View>

              <View style={styles.successActions}>
                <Pressable onPress={handleCopy} style={styles.iconAction}>
                  <View style={styles.iconActionBg}>
                    <Copy size={20} color={colors.gold} />
                  </View>
                  <Text style={styles.iconActionText}>Copy</Text>
                </Pressable>
                <Pressable onPress={handleShare} style={styles.iconAction}>
                  <View style={styles.iconActionBg}>
                    <Share2 size={20} color={colors.gold} />
                  </View>
                  <Text style={styles.iconActionText}>Share</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.successButtons}>
            <GradientButton label="Go to Lobby" onPress={handleGoToLobby} variant="green" icon={<Sparkles size={20} color="#FFFFFF" />} />
          </View>
        </View>
        <Toast message={toast?.message ?? ''} type={toast?.type} visible={toast?.visible ?? false} onHide={hideToast} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0A1F16', '#071A12']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Header title="Create Room" subtitle="Set up your game" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 100 }}
      >
        <Animated.View style={formStyle}>
          <View style={styles.section}>
            <Input
              label="Room Name"
              value={roomName}
              onChangeText={setRoomName}
              placeholder="Friday Night Rummy"
              icon={<Gamepad2 size={20} color={colors.textMuted} />}
              maxLength={30}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Maximum Players</Text>
            <View style={styles.playersGrid}>
              {MAX_PLAYERS_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => { setMaxPlayers(option); trigger('light'); }}
                  style={[
                    styles.playerOption,
                    maxPlayers === option && styles.playerOptionActive,
                  ]}
                >
                  {maxPlayers === option && (
                    <View style={styles.playerCheck}>
                      <Check size={12} color="#FFFFFF" />
                    </View>
                  )}
                  <Users
                    size={18}
                    color={maxPlayers === option ? colors.gold : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.playerOptionText,
                      maxPlayers === option && styles.playerOptionTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Game Mode</Text>
            <View style={styles.modesList}>
              {GAME_MODES.map((mode) => (
                <Pressable
                  key={mode.id}
                  onPress={() => { setGameMode(mode.id); trigger('light'); }}
                  style={[
                    styles.modeOption,
                    gameMode === mode.id && styles.modeOptionActive,
                  ]}
                >
                  <View style={styles.modeInfo}>
                    <View style={styles.modeHeader}>
                      <Gamepad2
                        size={16}
                        color={gameMode === mode.id ? colors.gold : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.modeLabel,
                          gameMode === mode.id && styles.modeLabelActive,
                        ]}
                      >
                        {mode.label}
                      </Text>
                    </View>
                    <Text style={styles.modeDesc}>{mode.description}</Text>
                  </View>
                  {gameMode === mode.id && (
                    <View style={styles.modeCheck}>
                      <Check size={16} color="#FFFFFF" />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.createButton}>
            <GradientButton
              label="Create Room"
              onPress={handleCreate}
              variant="gold"
              loading={loading}
              icon={<Sparkles size={20} color="#1A1A1A" />}
            />
          </View>
        </Animated.View>
      </ScrollView>

      <LoadingModal visible={loading} message="Creating room..." />
      <Toast message={toast?.message ?? ''} type={toast?.type} visible={toast?.visible ?? false} onHide={hideToast} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  playersGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  playerOption: {
    width: 56,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  playerOptionActive: {
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
    borderColor: colors.gold,
  },
  playerCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerOptionText: {
    fontFamily: 'Sora-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  playerOptionTextActive: {
    color: colors.gold,
  },
  modesList: {
    gap: 10,
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12,
  },
  modeOptionActive: {
    backgroundColor: 'rgba(250, 204, 21, 0.06)',
    borderColor: colors.gold,
  },
  modeInfo: {
    flex: 1,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeLabel: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modeLabelActive: {
    color: colors.gold,
  },
  modeDesc: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 4,
  },
  modeCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    marginTop: 8,
  },
  successContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 24,
  },
  successCard: {
    borderRadius: 24,
    overflow: 'hidden',
    ...shadows.xl,
  },
  successGradient: {
    padding: 28,
    alignItems: 'center',
    gap: 12,
  },
  successIcon: {
    marginBottom: 8,
  },
  successIconBg: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.gold,
  },
  successTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successSubtitle: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  codeContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1.5,
    borderColor: 'rgba(250, 204, 21, 0.3)',
    marginTop: 12,
  },
  codeLabel: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  codeText: {
    fontFamily: 'Sora-Bold',
    fontSize: 36,
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 4,
  },
  roomInfoRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  roomInfoItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  roomInfoLabel: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  roomInfoValue: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  successActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  iconAction: {
    alignItems: 'center',
    gap: 6,
  },
  iconActionBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.2)',
  },
  iconActionText: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 12,
    color: colors.textPrimary,
  },
  successButtons: {
    paddingHorizontal: 20,
  },
});
