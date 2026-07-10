import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import {
  Edit2,
  LogOut,
  Gamepad2,
  Trophy,
  TrendingUp,
  Phone,
  Crown,
  ChevronRight,
  Mail,
} from 'lucide-react-native';
import { Header, Avatar, StatCard, GradientButton, GlassCard, Toast } from '@/src/components/ui';
import { BottomSheet } from '@/src/components/sheets';
import { LeaveRoomModal } from '@/src/components/modals';
import { colors, typography, spacing, radius, shadows } from '@/src/theme';
import { useAuthStore } from '@/src/store';
import { useToast, useHaptics } from '@/src/hooks';
import { getWinRate, formatNumber } from '@/src/utils';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const { trigger, notify } = useHaptics();

  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);

  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? '');

  const profileOpacity = useSharedValue(0);
  const statsOpacity = useSharedValue(0);
  const detailsOpacity = useSharedValue(0);

  useState(() => {
    profileOpacity.value = withTiming(1, { duration: 400 });
    statsOpacity.value = withDelay(100, withTiming(1, { duration: 400 }));
    detailsOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
  });

  const profileStyle = useAnimatedStyle(() => ({ opacity: profileOpacity.value }));
  const statsStyle = useAnimatedStyle(() => ({ opacity: statsOpacity.value }));
  const detailsStyle = useAnimatedStyle(() => ({ opacity: detailsOpacity.value }));

  const winRate = user ? getWinRate(user.wins, user.gamesPlayed) : 0;

  const handleSave = useCallback(() => {
    trigger('medium');
    updateUser({ name: editName.trim() });
    setShowEditSheet(false);
    showToast('Profile updated!', 'success');
    notify('success');
  }, [editName, updateUser, trigger, showToast, notify]);

  const handleLogout = useCallback(() => {
    setShowLogoutModal(false);
    logout();
    router.replace('/welcome');
  }, [logout, router]);

  return (
    <LinearGradient
      colors={['#0F5132', '#071A12']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Header title="Profile" onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 32 }}
      >
        <Animated.View style={[styles.profileHeader, profileStyle]}>
          <View style={styles.avatarContainer}>
            <Avatar name={user?.name ?? 'Player'} size={96} isHost={user?.isPremium} />
            {user?.isPremium && (
              <View style={styles.premiumBadge}>
                <Crown size={12} color="#1A1A1A" />
                <Text style={styles.premiumText}>PREMIUM</Text>
              </View>
            )}
          </View>
          <Text style={styles.profileName}>{user?.name ?? 'Player'}</Text>
          <View style={styles.phoneRow}>
            <Phone size={14} color={colors.textSecondary} />
            <Text style={styles.phoneText}>{user?.phone ?? 'N/A'}</Text>
          </View>
          <View style={styles.editButton}>
            <GradientButton
              label="Edit Profile"
              onPress={() => { setEditName(user?.name ?? ''); setShowEditSheet(true); trigger('light'); }}
              variant="gold"
              size="md"
              icon={<Edit2 size={18} color="#1A1A1A" />}
            />
          </View>
        </Animated.View>

        <Animated.View style={[styles.statsContainer, statsStyle]}>
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

        <Animated.View style={[styles.detailsContainer, detailsStyle]}>
          <GlassCard>
            <View style={styles.detailsList}>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Crown size={18} color={colors.gold} />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Coins</Text>
                  <Text style={styles.detailValue}>{formatNumber(user?.coins ?? 0)}</Text>
                </View>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Trophy size={18} color={colors.gold} />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Rank</Text>
                  <Text style={styles.detailValue}>#4 Globally</Text>
                </View>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Mail size={18} color={colors.gold} />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>Not linked</Text>
                </View>
                <Pressable onPress={() => showToast('Email linking coming soon!', 'info')}>
                  <Text style={styles.linkButton}>Link</Text>
                </Pressable>
              </View>
            </View>
          </GlassCard>

          <View style={styles.menuList}>
            <Pressable
              onPress={() => { trigger('light'); showToast('Achievements coming soon!', 'info'); }}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            >
              <GlassCard padding={0}>
                <View style={styles.menuRow}>
                  <View style={styles.menuIcon}>
                    <Trophy size={18} color={colors.gold} />
                  </View>
                  <Text style={styles.menuLabel}>Achievements</Text>
                  <ChevronRight size={18} color={colors.textMuted} />
                </View>
              </GlassCard>
            </Pressable>
            <Pressable
              onPress={() => { trigger('light'); router.push('/(app)/settings'); }}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            >
              <GlassCard padding={0}>
                <View style={styles.menuRow}>
                  <View style={styles.menuIcon}>
                    <TrendingUp size={18} color={colors.gold} />
                  </View>
                  <Text style={styles.menuLabel}>Statistics</Text>
                  <ChevronRight size={18} color={colors.textMuted} />
                </View>
              </GlassCard>
            </Pressable>
          </View>

          <Pressable
            onPress={() => { trigger('medium'); setShowLogoutModal(true); }}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <View style={styles.logoutButton}>
              <LogOut size={18} color={colors.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </Pressable>
        </Animated.View>
      </ScrollView>

      <BottomSheet visible={showEditSheet} onClose={() => setShowEditSheet(false)} title="Edit Profile">
        <View style={styles.sheetContent}>
          <View style={styles.sheetInputContainer}>
            <Text style={styles.sheetLabel}>Name</Text>
            <View style={styles.sheetInputWrapper}>
              <Edit2 size={18} color={colors.textMuted} />
              <Text style={styles.sheetInputPlaceholder}>
                <Text style={styles.sheetInputText}>{editName}</Text>
              </Text>
            </View>
          </View>
          <GradientButton label="Save Changes" onPress={handleSave} variant="green" />
        </View>
      </BottomSheet>

      <LeaveRoomModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Logout?"
        message="Are you sure you want to logout? You'll need to verify your phone again to log back in."
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
  profileHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    gap: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  premiumBadge: {
    position: 'absolute',
    bottom: -4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.gold,
  },
  premiumText: {
    fontFamily: 'Sora-Bold',
    fontSize: 9,
    color: '#1A1A1A',
    fontWeight: '800',
    letterSpacing: 1,
  },
  profileName: {
    fontFamily: 'Sora-Bold',
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  editButton: {
    width: '60%',
    marginTop: 8,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  detailsContainer: {
    gap: 16,
  },
  detailsList: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  detailDivider: {
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 8,
  },
  linkButton: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 14,
    color: colors.gold,
    fontWeight: '600',
  },
  menuList: {
    gap: 10,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
  },
  menuLabel: {
    flex: 1,
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
  },
  logoutText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 15,
    color: colors.error,
    fontWeight: '700',
  },
  sheetContent: {
    padding: 20,
    gap: 20,
  },
  sheetInputContainer: {
    gap: 8,
  },
  sheetLabel: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sheetInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 56,
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sheetInputPlaceholder: {
    flex: 1,
  },
  sheetInputText: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 16,
    color: colors.textPrimary,
  },
});
