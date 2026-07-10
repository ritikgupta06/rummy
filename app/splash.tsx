import { useEffect } from 'react';
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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/src/theme';
import { APP_NAME, APP_TAGLINE } from '@/src/constants';

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const loadingOpacity = useSharedValue(0);
  const shimmerX = useSharedValue(-200);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100, mass: 0.8 });
    logoRotate.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.back(1.5)) });

    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    titleTranslateY.value = withDelay(400, withSpring(0, { damping: 15 }));

    taglineOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));
    loadingOpacity.value = withDelay(1000, withTiming(1, { duration: 400 }));
    shimmerX.value = withDelay(
      1000,
      withRepeat(
        withTiming(200, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      )
    );

    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }, { rotate: `${logoRotate.value}deg` }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const loadingStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  return (
    <LinearGradient
      colors={['#0F5132', '#071A12', '#000000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <LinearGradient
            colors={['#FDE047', '#FACC15', '#CA8A04']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoBg}
          >
            <Text style={styles.logoText}>R</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={styles.title}>{APP_NAME}</Text>
        </Animated.View>

        <Animated.View style={[styles.taglineContainer, taglineStyle]}>
          <Text style={styles.tagline}>{APP_TAGLINE}</Text>
        </Animated.View>

        <Animated.View style={[styles.loadingContainer, loadingStyle]}>
          <View style={styles.loadingBar}>
            <Animated.View style={[styles.loadingShimmer, shimmerStyle]} />
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logoBg: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  logoText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#1A1A1A',
    fontFamily: 'Sora-Bold',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Sora-Bold',
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  taglineContainer: {},
  tagline: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 15,
    color: colors.gold,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    gap: 10,
  },
  loadingBar: {
    width: 200,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  loadingShimmer: {
    width: 100,
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
  loadingText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
});
