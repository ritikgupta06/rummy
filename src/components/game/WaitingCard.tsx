import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '@/src/components/ui/Avatar';
import type { Player } from '@/src/types';
import { colors, spacing, radius, shadows, typography } from '@/src/theme';

interface WaitingCardProps {
  player?: Player;
  position: number;
  style?: object;
}

export function WaitingCard({ player, position, style }: WaitingCardProps) {
  if (!player) {
    return (
      <View style={[styles.container, styles.empty, style]}>
        <View style={styles.emptyAvatar}>
          <Text style={styles.plus}>+</Text>
        </View>
        <Text style={styles.emptyText}>Waiting...</Text>
        <Text style={styles.emptySubtext}>Seat {position + 1}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={player.isReady ? ['#16A34A', '#0F5132'] : ['rgba(26, 51, 40, 0.8)', 'rgba(16, 38, 29, 0.8)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      <Avatar
        name={player.name}
        size={56}
        isHost={player.isHost}
        isOnline={player.isOnline}
      />
      <Text style={styles.name} numberOfLines={1}>
        {player.name}
      </Text>
      <View style={[styles.statusBadge, player.isReady ? styles.statusReady : styles.statusWaiting]}>
        <Text style={styles.statusText}>
          {player.isHost ? 'Host' : player.isReady ? 'Ready' : 'Waiting'}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: 6,
    minHeight: 130,
    justifyContent: 'center',
  },
  empty: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderStyle: 'dashed',
  },
  emptyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  plus: {
    fontSize: 28,
    color: colors.textMuted,
    fontWeight: '300',
  },
  emptyText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  emptySubtext: {
    ...typography.label,
    fontSize: 10,
    color: colors.textMuted,
  },
  name: {
    ...typography.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statusReady: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusWaiting: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  statusText: {
    ...typography.label,
    fontSize: 10,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
