import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '@/src/components/ui/Avatar';
import { Crown, Check, Clock } from 'lucide-react-native';
import type { Player } from '@/src/types';
import { colors, spacing, radius, shadows, typography } from '@/src/theme';

interface PlayerCardProps {
  player: Player;
  isCurrentUser?: boolean;
  style?: object;
}

export function PlayerCard({ player, isCurrentUser, style }: PlayerCardProps) {
  return (
    <View style={[styles.container, style]}>
      <Avatar
        name={player.name}
        size={48}
        isHost={player.isHost}
        isOnline={player.isOnline}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {player.name}
          {isCurrentUser && <Text style={styles.youTag}> (You)</Text>}
        </Text>
        <Text style={styles.phone} numberOfLines={1}>
          {player.isHost ? 'Host' : 'Player'}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        {player.isHost ? (
          <View style={[styles.badge, styles.hostBadge]}>
            <Crown size={12} color={colors.cardBlack} />
            <Text style={styles.badgeText}>Host</Text>
          </View>
        ) : player.isReady ? (
          <View style={[styles.badge, styles.readyBadge]}>
            <Check size={12} color={colors.success} />
            <Text style={[styles.badgeText, { color: colors.success }]}>Ready</Text>
          </View>
        ) : (
          <View style={[styles.badge, styles.waitingBadge]}>
            <Clock size={12} color={colors.textTertiary} />
            <Text style={[styles.badgeText, { color: colors.textTertiary }]}>Waiting</Text>
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
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(16, 38, 29, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.bodyMedium,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  youTag: {
    color: colors.gold,
    fontSize: 13,
  },
  phone: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusContainer: {},
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  hostBadge: {
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
  },
  readyBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  waitingBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  badgeText: {
    ...typography.label,
    fontSize: 11,
    color: colors.gold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
