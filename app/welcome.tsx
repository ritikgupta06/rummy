import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Users, Plus, Zap, Crown } from 'lucide-react-native';
import { GradientButton, SecondaryButton } from '@/src/components/ui';
import { colors, typography, spacing, radius, shadows } from '@/src/theme';
import { APP_NAME } from '@/src/constants';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const heroScale = useSharedValue(0.8);
  const heroOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const titleOpacity = useSharedValue(0);
  const featuresOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const floatY = useSharedValue(0);

  useEffect(() => {
    heroScale.value = withSpring(1, { damping: 14, stiffness: 100 });
    heroOpacity.value = withTiming(1, { duration: 600 });

    titleTranslateY.value = withDelay(200, withSpring(0, { damping: 15 }));
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));

    featuresOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    buttonsOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));

    floatY.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(8, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroScale.value }, { translateY: floatY.value }],
    opacity: heroOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleTranslateY.value }],
    opacity: titleOpacity.value,
  }));

  const featuresStyle = useAnimatedStyle(() => ({ opacity: featuresOpacity.value }));
  const buttonsStyle = useAnimatedStyle(() => ({ opacity: buttonsOpacity.value }));

  const features = [
    { icon: Users, title: 'Play with Friends', desc: 'Create private rooms' },
    { icon: Plus, title: 'Create Rooms', desc: 'Customize your game' },
    { icon: Zap, title: 'Join Instantly', desc: 'Quick match anytime' },
  ];

  return (
    <LinearGradient
      colors={['#14532D', '#071A12']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.heroContainer, heroStyle]}>
          <LinearGradient
            colors={['#FDE047', '#FACC15', '#CA8A04']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCircle}
          >
            <View style={styles.heroInner}>
              <Text style={styles.heroText}>R</Text>
              <View style={styles.cardIcon1}>
                <Text style={styles.cardIconText}>A</Text>
              </View>
              <View style={styles.cardIcon2}>
                <Text style={[styles.cardIconText, { color: colors.cardRed }]}>K</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.subtitle}>
            The ultimate rummy experience.{'\n'}Play, compete, and win.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.featuresContainer, featuresStyle]}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <feature.icon size={20} color={colors.gold} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </View>

      <Animated.View style={[styles.actions, buttonsStyle, { paddingBottom: insets.bottom + 24 }]}>
        <GradientButton
          label="Login"
          onPress={() => router.push('/(auth)/login')}
          variant="gold"
          icon={<Crown size={20} color="#1A1A1A" />}
        />
        <SecondaryButton
          label="Get Started"
          onPress={() => router.push('/(auth)/login')}
        />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    paddingTop: 60,
    gap: spacing.xl,
  },
  heroContainer: {
    alignItems: 'center',
  },
  heroCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.gold,
  },
  heroInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 81, 50, 0.9)',
    position: 'relative',
  },
  heroText: {
    fontSize: 64,
    fontWeight: '900',
    color: colors.gold,
    fontFamily: 'Sora-Bold',
  },
  cardIcon1: {
    position: 'absolute',
    top: 10,
    right: 20,
    width: 28,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '15deg' }],
  },
  cardIcon2: {
    position: 'absolute',
    bottom: 15,
    left: 18,
    width: 28,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-15deg' }],
  },
  cardIconText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Sora-Bold',
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresContainer: {
    width: '100%',
    paddingHorizontal: 32,
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.2)',
  },
  featureText: {},
  featureTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  featureDesc: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    width: '100%',
    paddingHorizontal: 24,
    gap: 12,
  },
});
