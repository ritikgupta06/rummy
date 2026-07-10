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
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Clipboard, Search, ArrowRight, Hash } from 'lucide-react-native';
import { Header, Input, GradientButton, Toast } from '@/src/components/ui';
import { LoadingModal } from '@/src/components/modals';
import { colors, typography, spacing, radius, shadows } from '@/src/theme';
import { roomService } from '@/src/services';
import { useRoomStore, useAuthStore } from '@/src/store';
import { useToast, useHaptics } from '@/src/hooks';
import { mockRoom } from '@/src/constants/mockData';

export default function JoinRoomScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const { trigger, notify } = useHaptics();

  const joinRoom = useRoomStore((s) => s.joinRoom);
  const user = useAuthStore((s) => s.user);

  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const searchScale = useSharedValue(1);
  const formOpacity = useSharedValue(0);

  const formStyle = useAnimatedStyle(() => ({ opacity: formOpacity.value }));

  useState(() => {
    formOpacity.value = withTiming(1, { duration: 300 });
  });

  const handlePaste = useCallback(async () => {
    trigger('light');
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setRoomCode(text.trim().toUpperCase());
          showToast('Pasted from clipboard', 'success');
        }
      }
    } catch {
      showToast('Unable to paste. Please enter manually.', 'info');
    }
  }, [trigger, showToast]);

  const startSearchAnimation = useCallback(() => {
    setSearching(true);
    searchScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [searchScale]);

  const stopSearchAnimation = useCallback(() => {
    searchScale.value = withSpring(1, { damping: 15 });
    setSearching(false);
  }, [searchScale]);

  const handleJoin = useCallback(async () => {
    if (!roomCode.trim()) {
      showToast('Please enter a room code', 'error');
      notify('error');
      return;
    }

    setLoading(true);
    startSearchAnimation();

    try {
      const player = {
        id: `ply_${user?.id ?? '001'}`,
        userId: user?.id ?? 'usr_001',
        name: user?.name ?? 'Player',
        avatarUrl: null,
        isHost: false,
        isReady: true,
        status: 'ready' as const,
        position: mockRoom.players.length,
        score: 0,
        cardsCount: 13,
        isOnline: true,
      };

      const room = await roomService.joinRoom(roomCode.trim(), player);
      joinRoom(room);
      stopSearchAnimation();
      notify('success');
      showToast('Joined room successfully!', 'success');
      setTimeout(() => router.push('/(app)/lobby'), 300);
    } catch (err) {
      stopSearchAnimation();
      showToast('Room not found. Check the code.', 'error');
      notify('error');
    } finally {
      setLoading(false);
    }
  }, [roomCode, user, joinRoom, router, showToast, notify, startSearchAnimation, stopSearchAnimation]);

  const searchStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searching ? searchScale.value : 1 }],
  }));

  return (
    <LinearGradient
      colors={['#0A1F16', '#071A12']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Header title="Join Room" subtitle="Enter a room code to join" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 100, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={formStyle}>
          <View style={styles.heroSection}>
            <Animated.View style={[styles.searchIconContainer, searchStyle]}>
              <LinearGradient
                colors={['#FDE047', '#FACC15']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.searchIconBg}
              >
                {loading ? (
                  <Search size={32} color="#1A1A1A" />
                ) : (
                  <Hash size={32} color="#1A1A1A" />
                )}
              </LinearGradient>
            </Animated.View>
            <Text style={styles.heroTitle}>Have a Room Code?</Text>
            <Text style={styles.heroSubtitle}>
              Enter the code shared by your friend to join the game
            </Text>
          </View>

          <View style={styles.inputSection}>
            <Input
              label="Room Code"
              value={roomCode}
              onChangeText={(text) => setRoomCode(text.toUpperCase())}
              placeholder="ABCD123"
              icon={<Hash size={20} color={colors.textMuted} />}
              maxLength={7}
              autoCapitalize="characters"
              style={styles.codeInput}
            />

            <Pressable onPress={handlePaste} style={styles.pasteButton}>
              <Clipboard size={16} color={colors.gold} />
              <Text style={styles.pasteText}>Paste from clipboard</Text>
            </Pressable>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            onPress={() => {
              trigger('light');
              showToast('Quick match coming soon!', 'info');
            }}
            style={styles.quickMatchCard}
          >
            <LinearGradient
              colors={['#1A3328', '#10261D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickMatchGradient}
            >
              <View style={styles.quickMatchIcon}>
                <Search size={20} color={colors.gold} />
              </View>
              <View style={styles.quickMatchInfo}>
                <Text style={styles.quickMatchTitle}>Quick Match</Text>
                <Text style={styles.quickMatchDesc}>Find an open game instantly</Text>
              </View>
              <ArrowRight size={20} color={colors.textMuted} />
            </LinearGradient>
          </Pressable>

          <View style={styles.joinButton}>
            <GradientButton
              label="Join Room"
              onPress={handleJoin}
              variant="gold"
              loading={loading}
              disabled={!roomCode.trim()}
              icon={!loading ? <ArrowRight size={20} color="#1A1A1A" /> : undefined}
            />
          </View>
        </Animated.View>
      </ScrollView>

      <LoadingModal visible={loading} message="Searching for room..." />
      <Toast message={toast?.message ?? ''} type={toast?.type} visible={toast?.visible ?? false} onHide={hideToast} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
    gap: 12,
  },
  searchIconContainer: {},
  searchIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.gold,
  },
  heroTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  heroSubtitle: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputSection: {
    gap: 16,
  },
  codeInput: {},
  pasteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(250, 204, 21, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.15)',
  },
  pasteText: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 14,
    color: colors.gold,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  dividerText: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  quickMatchCard: {
    borderRadius: 18,
    overflow: 'hidden',
    ...shadows.md,
  },
  quickMatchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  quickMatchIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
  },
  quickMatchInfo: {
    flex: 1,
  },
  quickMatchTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  quickMatchDesc: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  joinButton: {
    marginTop: 28,
  },
});
