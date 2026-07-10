import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Target, TrendingUp, Gamepad2, Users } from 'lucide-react-native';
import type { GameHistoryItem } from '@/src/types';
import { colors, spacing, radius, shadows, typography } from '@/src/theme';
import { formatDate } from '@/src/utils';

interface GameHistoryCardProps {
  game: GameHistoryItem;
  style?: object;
}

export function GameHistoryCard({ game, style }: GameHistoryCardProps) {
  const positionColors: Record<number, string> = {
    1: colors.gold,
    2: '#C0C0C0',
    3: '#CD7F32',
  };
  const positionColor = positionColors[game.position] || colors.textTertiary;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.positionBadge, { backgroundColor: `${positionColor}20` }]}>
        <Text style={[styles.positionText, { color: positionColor }]}>
          #{game.position}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.roomName} numberOfLines={1}>{game.roomName}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Gamepad2 size={12} color={colors.textTertiary} />
            <Text style={styles.metaText}>{game.mode}</Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={12} color={colors.textTertiary} />
            <Text style={styles.metaText}>{game.playersCount} players</Text>
          </View>
          <Text style={styles.date}>{formatDate(game.date)}</Text>
        </View>
      </View>
      <View style={[styles.resultBadge, game.won ? styles.wonBadge : styles.lostBadge]}>
        {game.won ? (
          <Trophy size={12} color={colors.gold} />
        ) : (
          <TrendingUp size={12} color={colors.textTertiary} />
        )}
        <Text style={[styles.resultText, game.won ? styles.wonText : styles.lostText]}>
          {game.won ? 'Won' : 'Lost'}
        </Text>
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
    backgroundColor: 'rgba(16, 38, 29, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: spacing.md,
  },
  positionBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionText: {
    ...typography.h4,
    fontSize: 16,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  roomName: {
    ...typography.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: 'capitalize',
  },
  date: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  wonBadge: {
    backgroundColor: 'rgba(250, 204, 21, 0.12)',
  },
  lostBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  resultText: {
    ...typography.label,
    fontSize: 11,
    fontWeight: '700',
  },
  wonText: {
    color: colors.gold,
  },
  lostText: {
    color: colors.textTertiary,
  },
});
