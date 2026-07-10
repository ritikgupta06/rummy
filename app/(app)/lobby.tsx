import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import {
  Copy,
  Share2,
  Play,
  LogOut,
  Users,
  Crown,
  Check,
  Wifi,
  Clock,
} from 'lucide-react-native';
import { Header, GradientButton, IconButton, Toast } from '@/src/components/ui';
import { WaitingCard } from '@/src/components/game';
import { BottomSheet } from '@/src/components/sheets';
import { LeaveRoomModal } from '@/src/components/modals';
import { colors, typography, spacing, radius, shadows } from '@/src/theme';
import { useRoomStore, useAuthStore } from '@/src/store';
import { useToast, useShare, useHaptics } from '@/src/hooks';
import { mockPlayers } from '@/src/constants/mockData';

export default function LobbyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const { share, copyToClipboard } = useShare();
  const { trigger, notify } = useHaptics();

  const room = useRoomStore((s) => s.room);
  const setPlayerReady = useRoomStore((s) => s.setPlayerReady);
  const startGame = useRoomStore((s) => s.startGame);
  const clearRoom = useRoomStore((s) => s.clearRoom);
  const user = useAuthStore((s) => s.user);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [localPlayers, setLocalPlayers] = useState(room?.players ?? []);

  // Simulate players joining over time
  useEffect(() => {
    if (!room) return;
    setLocalPlayers(room.players);

    const timers: ReturnType<typeof setTimeout>[] = [];
    const extraPlayers = mockPlayers.slice(room.players.length, room.maxPlayers);

    extraPlayers.forEach((player, index) => {
      const timer = setTimeout(() => {
        setLocalPlayers((prev) => {
          if (prev.length >= room.maxPlayers) return prev;
          return [...prev, { ...player, isHost: false, isReady: index > 0 }];
        });
        trigger('light');
      }, (index + 1) * 2500);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [room, trigger]);

  const currentPlayer = localPlayers.find((p) => p.userId === user?.id);
  const isHost = currentPlayer?.isHost ?? false;
  const allReady = localPlayers.length >= 2 && localPlayers.every((p) => p.isReady || !p.isOnline);
  const filledSlots = localPlayers.length;
  const emptySlots = (room?.maxPlayers ?? 4) - filledSlots;

  const pulseOpacity = useSharedValue(0.4);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 400 });
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

  const handleCopy = useCallback(async () => {
    trigger('light');
    const success = await copyToClipboard(room?.code ?? '');
    showToast(success ? 'Room code copied!' : 'Copy failed', success ? 'success' : 'error');
  }, [room?.code, copyToClipboard, showToast, trigger]);

  const handleShare = useCallback(async () => {
    trigger('light');
    setShowShareSheet(false);
    await share(
      `Join my rummy room "${room?.name ?? ''}"! Use code: ${room?.code ?? ''} to join the fun!`,
      'Rummy Royale Room Invite'
    );
  }, [room?.name, room?.code, share, trigger]);

  const handleReady = useCallback(() => {
    if (!currentPlayer) return;
    trigger('medium');
    setPlayerReady(currentPlayer.id, !currentPlayer.isReady);
    setLocalPlayers((prev) =>
      prev.map((p) =>
        p.id === currentPlayer.id
          ? { ...p, isReady: !p.isReady, status: !p.isReady ? 'ready' : 'waiting' }
          : p
      )
    );
  }, [currentPlayer, setPlayerReady, trigger]);

  const handleStart = useCallback(() => {
    trigger('medium');
    notify('success');
    startGame();
    router.push('/(app)/game');
  }, [trigger, notify, startGame, router]);

  const handleLeave = useCallback(() => {
    setShowLeaveModal(false);
    clearRoom();
    router.replace('/(app)/home');
  }, [clearRoom, router]);

  if (!room) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: colors.textSecondary }}>No room found</Text>
        <Pressable onPress={() => router.replace('/(app)/home')} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.gold }}>Go Home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#14532D', '#0A2A18', '#071A12']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Header
        title={room.name}
        subtitle={`Code: ${room.code}`}
        onBack={() => setShowLeaveModal(true)}
        right={
          <IconButton
            icon={<Share2 size={18} color={colors.gold} />}
            onPress={() => setShowShareSheet(true)}
            variant="gold"
            size={36}
          />
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 120 }}
      >
        <Animated.View style={contentStyle}>
          <View style={styles.roomInfoCard}>
            <LinearGradient
              colors={['rgba(26, 51, 40, 0.8)', 'rgba(16, 38, 29, 0.8)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.roomInfoGradient}
            >
              <View style={styles.roomInfoHeader}>
                <View style={styles.roomCodeContainer}>
                  <Text style={styles.roomCodeLabel}>Room Code</Text>
                  <Text style={styles.roomCodeValue}>{room.code}</Text>
                </View>
                <Pressable onPress={handleCopy} style={styles.copyButton}>
                  <Copy size={16} color={colors.gold} />
                </Pressable>
              </View>
              <View style={styles.roomMetaRow}>
                <View style={styles.roomMetaItem}>
                  <Crown size={14} color={colors.gold} />
                  <Text style={styles.roomMetaText}>{room.hostName}</Text>
                </View>
                <View style={styles.roomMetaItem}>
                  <Users size={14} color={colors.textSecondary} />
                  <Text style={styles.roomMetaText}>
                    {filledSlots}/{room.maxPlayers} Players
                  </Text>
                </View>
                <View style={styles.roomMetaItem}>
                  <Text style={[styles.roomMetaText, { textTransform: 'capitalize' }]}>
                    {room.gameMode}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.playersSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Players</Text>
              <View style={styles.waitingPulse}>
                <Animated.View style={[styles.pulseDot, pulseStyle]} />
                <Text style={styles.waitingText}>
                  {allReady ? 'All ready!' : 'Waiting for players...'}
                </Text>
              </View>
            </View>

            <View style={styles.playersGrid}>
              {localPlayers.map((player, index) => (
                <View key={player.id} style={styles.playerSlot}>
                  <WaitingCard player={player} position={index} />
                </View>
              ))}
              {Array.from({ length: emptySlots }).map((_, index) => (
                <View key={`empty_${index}`} style={styles.playerSlot}>
                  <WaitingCard position={filledSlots + index} />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.inviteSection}>
            <Pressable
              onPress={() => { trigger('light'); setShowShareSheet(true); }}
              style={({ pressed }) => [
                styles.inviteButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <LinearGradient
                colors={['rgba(250, 204, 21, 0.1)', 'rgba(250, 204, 21, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.inviteGradient}
              >
                <Share2 size={20} color={colors.gold} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.inviteTitle}>Invite Friends</Text>
                  <Text style={styles.inviteDesc}>Share the room code to invite</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        {isHost ? (
          <GradientButton
            label="Start Game"
            onPress={handleStart}
            variant="green"
            disabled={!allReady}
            loading={false}
            icon={<Play size={20} color="#FFFFFF" />}
          />
        ) : (
          <GradientButton
            label={currentPlayer?.isReady ? 'Ready!' : 'Mark as Ready'}
            onPress={handleReady}
            variant={currentPlayer?.isReady ? 'primary' : 'gold'}
            icon={currentPlayer?.isReady ? <Check size={20} color="#FFFFFF" /> : undefined}
          />
        )}
      </View>

      <BottomSheet visible={showShareSheet} onClose={() => setShowShareSheet(false)} title="Share Room">
        <View style={styles.sheetContent}>
          <View style={styles.sheetRoomCard}>
            <Text style={styles.sheetRoomName}>{room.name}</Text>
            <View style={styles.sheetCodeRow}>
              <Text style={styles.sheetCodeLabel}>Room Code</Text>
              <Text style={styles.sheetCodeValue}>{room.code}</Text>
            </View>
          </View>
          <View style={styles.sheetActions}>
            <Pressable onPress={handleCopy} style={styles.sheetAction}>
              <View style={styles.sheetActionIcon}>
                <Copy size={20} color={colors.gold} />
              </View>
              <Text style={styles.sheetActionText}>Copy Code</Text>
            </Pressable>
            <Pressable onPress={handleShare} style={styles.sheetAction}>
              <View style={styles.sheetActionIcon}>
                <Share2 size={20} color={colors.gold} />
              </View>
              <Text style={styles.sheetActionText}>Share</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>

      <LeaveRoomModal
        visible={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleLeave}
      />

      <Toast
        message={toast?.message ?? ''}
        type={toast?.type}
        visible={toast?.visible ?? false}
        onHide={hideToast}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  roomInfoCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 24,
    ...shadows.md,
  },
  roomInfoGradient: {
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  roomInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  roomCodeContainer: {},
  roomCodeLabel: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  roomCodeValue: {
    fontFamily: 'Sora-Bold',
    fontSize: 28,
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 2,
    marginTop: 2,
  },
  copyButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.2)',
  },
  roomMetaRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  roomMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roomMetaText: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  playersSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  waitingPulse: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  waitingText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  playerSlot: {
    width: '48%',
    flexGrow: 1,
  },
  inviteSection: {
    marginBottom: 16,
  },
  inviteButton: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  inviteGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.15)',
    borderRadius: 18,
  },
  inviteTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  inviteDesc: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'rgba(7, 26, 18, 0.9)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  sheetContent: {
    padding: 20,
    gap: 20,
  },
  sheetRoomCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
    backgroundColor: 'rgba(250, 204, 21, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.2)',
  },
  sheetRoomName: {
    fontFamily: 'Sora-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  sheetCodeRow: {
    alignItems: 'center',
  },
  sheetCodeLabel: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sheetCodeValue: {
    fontFamily: 'Sora-Bold',
    fontSize: 32,
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 2,
    marginTop: 4,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 16,
  },
  sheetAction: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  sheetActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.2)',
  },
  sheetActionText: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
});
