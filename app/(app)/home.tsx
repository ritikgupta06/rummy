import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
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
  Plus,
  LogIn,
  Trophy,
  Gamepad2,
  TrendingUp,
  Target,
  Crown,
  Settings,
  Share2,
  ChevronRight,
  Users,
  Sparkles,
} from 'lucide-react-native';
import {
  Avatar,
  CoinBadge,
  StatCard,
  GlassCard,
  GradientButton,
  IconButton,
  EmptyState,
} from '@/src/components/ui';
import { GameHistoryCard } from '@/src/components/game';
import { Toast } from '@/src/components/ui';
import { useAuthStore } from '@/src/store';
import { leaderboardService } from '@/src/services';
import { colors, typography, spacing, radius, shadows } from '@/src/theme';
import { mockGameHistory } from '@/src/constants/mockData';
import { useToast, useShare, useHaptics } from '@/src/hooks';
import { getWinRate, formatNumber } from '@/src/utils';
import type { GameHistoryItem } from '@/src/types';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const { toast, showToast, hideToast } = useToast();
  const { share } = useShare();
  const { trigger } = useHaptics();

  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const headerOpacity = useSharedValue(0);
  const cardsOpacity = useSharedValue(0);
  const actionsOpacity = useSharedValue(0);
  const historyOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
    cardsOpacity.value = withDelay(100, withTiming(1, { duration: 400 }));
    actionsOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    historyOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));

    loadHistory();
  }, []);

  const loadHistory = async () => {
    if (!user) return;
    try {
      const data = await leaderboardService.getGameHistory(user.id);
      setHistory(data);
    } catch {
      setHistory(mockGameHistory);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, []);

  const handleShare = useCallback(async () => {
    trigger('light');
    await share(
      `Join me on Rummy Royale! Let's play some cards. Use my invite link to get started!`,
      'Rummy Royale Invite'
    );
  }, [share, trigger]);

  const winRate = user ? getWinRate(user.wins, user.gamesPlayed) : 0;

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));
  const cardsStyle = useAnimatedStyle(() => ({ opacity: cardsOpacity.value }));
  const actionsStyle = useAnimatedStyle(() => ({ opacity: actionsOpacity.value }));
  const historyStyle = useAnimatedStyle(() => ({ opacity: historyOpacity.value }));

  return (
    <LinearGradient
      colors={['#0A1F16', '#071A12']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.gold} />
        }
      >
        <Animated.View style={[styles.header, headerStyle]}>
          <Pressable onPress={() => router.push('/(app)/profile')} style={styles.profileRow}>
            <Avatar name={user?.name ?? 'Player'} size={48} isHost={user?.isPremium} />
            <View style={styles.profileInfo}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName} numberOfLines={1}>{user?.name ?? 'Player'}</Text>
            </View>
          </Pressable>
          <View style={styles.headerActions}>
            <CoinBadge amount={user?.coins ?? 0} />
            <Pressable onPress={() => router.push('/(app)/settings')}>
              <View style={styles.settingsButton}>
                <Settings size={20} color={colors.textSecondary} />
              </View>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View style={[styles.statsContainer, cardsStyle]}>
          <View style={styles.statsRow}>
            <StatCard
              icon={<Gamepad2 size={22} color="#FFFFFF" />}
              label="Games"
              value={user?.gamesPlayed ?? 0}
              gradient={['#16A34A', '#0F5132']}
            />
            <StatCard
              icon={<Trophy size={22} color="#FFFFFF" />}
              label="Wins"
              value={user?.wins ?? 0}
              gradient={['#FACC15', '#CA8A04']}
            />
            <StatCard
              icon={<TrendingUp size={22} color="#FFFFFF" />}
              label="Win %"
              value={`${winRate}%`}
              gradient={['#3B82F6', '#1D4ED8']}
            />
          </View>
        </Animated.View>

        <Animated.View style={[styles.actionsContainer, actionsStyle]}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <Pressable
              onPress={() => { trigger('medium'); router.push('/(app)/create-room'); }}
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionPressed]}
            >
              <LinearGradient
                colors={['#16A34A', '#0F5132']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <Plus size={28} color="#FFFFFF" />
                <Text style={styles.actionTitle}>Create Room</Text>
                <Text style={styles.actionDesc}>Start a new game</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => { trigger('medium'); router.push('/(app)/join-room'); }}
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionPressed]}
            >
              <LinearGradient
                colors={['#FACC15', '#CA8A04']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <LogIn size={28} color="#1A1A1A" />
                <Text style={[styles.actionTitle, { color: '#1A1A1A' }]}>Join Room</Text>
                <Text style={[styles.actionDesc, { color: 'rgba(26,26,26,0.7)' }]}>Enter a code</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.inviteCard, pressed && styles.actionPressed]}
          >
            <LinearGradient
              colors={['#1A3328', '#10261D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.inviteGradient}
            >
              <View style={styles.inviteIcon}>
                <Share2 size={24} color={colors.gold} />
              </View>
              <View style={styles.inviteInfo}>
                <Text style={styles.inviteTitle}>Invite Friends</Text>
                <Text style={styles.inviteDesc}>Earn 500 coins per invite</Text>
              </View>
              <ChevronRight size={20} color={colors.textMuted} />
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.historyContainer, historyStyle]}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Recent Games</Text>
            {history.length > 0 && (
              <Pressable onPress={() => showToast('Full history coming soon!', 'info')}>
                <Text style={styles.seeAll}>See All</Text>
              </Pressable>
            )}
          </View>

          {history.length > 0 ? (
            <View style={styles.historyList}>
              {history.map((game) => (
                <GameHistoryCard key={game.id} game={game} />
              ))}
            </View>
          ) : (
            <GlassCard>
              <EmptyState
                icon={<Gamepad2 size={32} color={colors.textMuted} />}
                title="No games yet"
                description="Create or join a room to start playing!"
              />
            </GlassCard>
          )}
        </Animated.View>
      </ScrollView>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  userName: {
    fontFamily: 'Sora-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    ...shadows.md,
  },
  actionPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  actionGradient: {
    padding: 18,
    alignItems: 'center',
    gap: 6,
    minHeight: 120,
    justifyContent: 'center',
  },
  actionTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 6,
  },
  actionDesc: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inviteCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 12,
    ...shadows.md,
  },
  inviteGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.15)',
  },
  inviteIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
  },
  inviteInfo: {
    flex: 1,
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
  historyContainer: {
    paddingHorizontal: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  seeAll: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 14,
    color: colors.gold,
    fontWeight: '500',
  },
  historyList: {
    gap: 10,
  },
});
