import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '@/src/components/ui/Avatar';
import { Trophy } from 'lucide-react-native';
import type { Player } from '@/src/types';
import { colors, spacing, radius, shadows, typography } from '@/src/theme';

interface ScoreBoardProps {
  players: Player[];
  style?: object;
}

export function ScoreBoard({ players, style }: ScoreBoardProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Scoreboard</Text>
      <View style={styles.players}>
        {players.map((player, index) => (
          <View key={player.id} style={styles.playerRow}>
            <View style={styles.rankContainer}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <Avatar name={player.name} size={32} isHost={player.isHost} />
            <Text style={styles.playerName} numberOfLines={1}>
              {player.name}
            </Text>
            <Text style={styles.score}>{player.score}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(16, 38, 29, 0.8)',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    ...typography.label,
    fontSize: 12,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  players: {
    gap: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rankContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    ...typography.label,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  playerName: {
    ...typography.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
  },
  score: {
    ...typography.bodyBold,
    fontSize: 15,
    color: colors.gold,
  },
});
