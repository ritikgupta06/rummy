import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '@/src/components/ui/Avatar';
import type { Player } from '@/src/types';
import { colors, spacing, radius, shadows, typography } from '@/src/theme';

interface PlayerChipProps {
  player: Player;
  isCurrentTurn?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  style?: object;
}

const avatarSizes = { sm: 36, md: 44, lg: 56 };

export function PlayerChip({
  player,
  isCurrentTurn = false,
  size = 'md',
  showStatus = true,
  style,
}: PlayerChipProps) {
  const avatarSize = avatarSizes[size];

  return (
    <View style={[styles.container, isCurrentTurn && styles.activeTurn, style]}>
      <Avatar
        name={player.name}
        size={avatarSize}
        isHost={player.isHost}
        isOnline={player.isOnline}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {player.name}
        </Text>
        {showStatus && (
          <View style={styles.statusRow}>
            {isCurrentTurn ? (
              <Text style={styles.turnText}>Playing...</Text>
            ) : player.isReady ? (
              <Text style={styles.readyText}>Ready</Text>
            ) : (
              <Text style={styles.waitingText}>Waiting</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(16, 38, 29, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...shadows.sm,
  },
  activeTurn: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
    ...shadows.gold,
  },
  info: {
    maxWidth: 100,
  },
  name: {
    ...typography.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
  fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  turnText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.gold,
    fontWeight: '600',
  },
  readyText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.success,
  },
  waitingText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textTertiary,
  },
});
