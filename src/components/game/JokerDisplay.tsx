import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '@/src/components/ui/Avatar';
import type { PlayingCard } from '@/src/types';
import { SUITS } from '@/src/constants';
import { colors, spacing, radius, shadows, typography } from '@/src/theme';

interface JokerDisplayProps {
  joker: PlayingCard | null;
  style?: object;
}

export function JokerDisplay({ joker, style }: JokerDisplayProps) {
  if (!joker) return null;
  const suit = SUITS[joker.suit];

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>JOKER</Text>
      <View style={styles.card}>
        {joker.isJoker ? (
          <Text style={styles.jokerText}>J</Text>
        ) : (
          <>
            <Text style={[styles.rank, { color: suit.color }]}>{joker.rank}</Text>
            <Text style={[styles.suit, { color: suit.color }]}>{suit.symbol}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    ...typography.label,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 1,
  },
  card: {
    width: 36,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold,
    ...shadows.sm,
  },
  rank: {
    fontSize: 16,
    fontWeight: '800',
  },
  suit: {
    fontSize: 12,
    fontWeight: '600',
  },
  jokerText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.cardRed,
  },
});
