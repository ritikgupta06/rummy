import { View, Text, StyleSheet } from 'react-native';
import { CardView } from './CardView';
import { colors, spacing, shadows, typography } from '@/src/theme';

interface DeckProps {
  count: number;
  style?: object;
  cardSize?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
}

export function Deck({ count, style, cardSize = 'md', onPress }: DeckProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.stack}>
        <View style={styles.cardBack} />
        <View style={[styles.cardBack, styles.cardBack2]} />
        <CardView
          card={{ id: 'deck_top', rank: 'A', suit: 'spades' }}
          faceDown
          size={cardSize}
          onPress={onPress}
        />
      </View>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  stack: {
    position: 'relative',
    width: 48,
    height: 68,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 48,
    height: 68,
    borderRadius: 8,
    backgroundColor: '#0F5132',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.15)',
  },
  cardBack2: {
    top: -2,
    left: 2,
  },
  count: {
    ...typography.label,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
