import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { CheckCircle, XCircle, Info } from 'lucide-react-native';
import { colors, typography, spacing, radius, shadows } from '@/src/theme';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const typeConfig = {
  success: { icon: CheckCircle, color: colors.success, bg: 'rgba(34, 197, 94, 0.15)' },
  error: { icon: XCircle, color: colors.error, bg: 'rgba(239, 68, 68, 0.15)' },
  info: { icon: Info, color: colors.info, bg: 'rgba(59, 130, 246, 0.15)' },
};

export function Toast({ message, type = 'success', visible, onHide, duration = 2500 }: ToastProps) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
      const timer = setTimeout(() => {
        translateY.value = withTiming(-100, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, () => runOnJS(onHide)());
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, translateY, opacity, onHide]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
      <View style={[styles.toast, { backgroundColor: config.bg }]}>
        <Icon size={22} color={config.color} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...shadows.lg,
    maxWidth: '90%',
  },
  message: {
    ...typography.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
