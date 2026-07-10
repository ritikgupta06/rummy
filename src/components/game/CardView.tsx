import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import type { PlayingCard } from '@/src/types';
import { SUITS } from '@/src/constants';
import { colors, shadows, radius } from '@/src/theme';
import { useHaptics } from '@/src/hooks';

interface CardViewProps {
  card: PlayingCard;
  faceDown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onPress?: (card: PlayingCard) => void;
  style?: object;
  index?: number;
  fanAngle?: number;
  fanOffset?: number;
}

const sizes = {
  sm: { width: 40, height: 56, radius: 6, fontSize: 16, suitSize: 12 },
  md: { width: 48, height: 68, radius: 8, fontSize: 18, suitSize: 14 },
  lg: { width: 60, height: 84, radius: 10, fontSize: 22, suitSize: 18 },
};

export function CardView({
  card,
  faceDown = false,
  size = 'md',
  selected = false,
  onPress,
  style,
  index = 0,
  fanAngle = 0,
  fanOffset = 0,
}: CardViewProps) {
  const { trigger } = useHaptics();
  const s = sizes[size];
  const lift = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -lift.value },
      { rotate: `${fanAngle}deg` },
      { translateX: fanOffset },
      { scale: scale.value },
    ],
  }));

  const handlePressIn = () => {
    if (!onPress) return;
    scale.value = withSpring(1.05, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (!onPress) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (!onPress) return;
    trigger('light');
    onPress(card);
  };

  if (faceDown) {
    return (
      <View style={[{ width: s.width, height: s.height }, style]}>
        <LinearGradient
          colors={['#16A34A', '#0F5132']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.faceDown,
            { width: s.width, height: s.height, borderRadius: s.radius },
          ]}
        >
          <View style={[styles.faceDownPattern, { borderRadius: s.radius - 2 }]}>
            <View style={styles.faceDownInner}>
              <Text style={[styles.faceDownText, { fontSize: s.fontSize * 0.7 }]}>
                R
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const suit = SUITS[card.suit];
  const isRed = suit.color === colors.cardRed;

  return (
    <Animated.View style={[animatedStyle, { width: s.width, height: s.height }, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!onPress}
      >
        <View
          style={[
            styles.card,
            {
              width: s.width,
              height: s.height,
              borderRadius: s.radius,
            },
            selected && styles.cardSelected,
          ]}
        >
          {card.isJoker ? (
            <View style={styles.jokerContainer}>
              <Text style={[styles.jokerText, { fontSize: s.fontSize }]}>J</Text>
              <Text style={[styles.jokerLabel, { fontSize: s.suitSize * 0.7 }]}>
                JOKER
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.topCorner}>
                <Text style={[styles.rank, { fontSize: s.fontSize, color: suit.color }]}>
                  {card.rank}
                </Text>
                <Text style={[styles.suit, { fontSize: s.suitSize, color: suit.color }]}>
                  {suit.symbol}
                </Text>
              </View>
              <Text style={[styles.centerSuit, { fontSize: s.fontSize * 1.8, color: suit.color }]}>
                {suit.symbol}
              </Text>
              <View style={styles.bottomCorner}>
                <Text style={[styles.rank, { fontSize: s.fontSize, color: suit.color }]}>
                  {card.rank}
                </Text>
                <Text style={[styles.suit, { fontSize: s.suitSize, color: suit.color }]}>
                  {suit.symbol}
                </Text>
              </View>
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAFAFA',
    ...shadows.md,
    overflow: 'hidden',
    position: 'relative',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.gold,
    ...shadows.gold,
  },
  topCorner: {
    position: 'absolute',
    top: 4,
    left: 4,
    alignItems: 'center',
  },
  bottomCorner: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  rank: {
    fontWeight: '800',
    lineHeight: 18,
  },
  suit: {
    fontWeight: '600',
    lineHeight: 14,
  },
  centerSuit: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -12 }],
    opacity: 0.9,
  },
  jokerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.05)',
  },
  jokerText: {
    fontWeight: '900',
    color: colors.cardRed,
  },
  jokerLabel: {
    fontWeight: '700',
    color: colors.cardRed,
    marginTop: 2,
    letterSpacing: 1,
  },
  faceDown: {
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  faceDownPattern: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(250, 204, 21, 0.2)',
  },
  faceDownInner: {
    width: '60%',
    height: '60%',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(250, 204, 21, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceDownText: {
    fontWeight: '900',
    color: 'rgba(250, 204, 21, 0.5)',
  },
});
