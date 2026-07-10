import { Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import type { ReactNode } from 'react';
import { colors, radius, shadows, typography } from '@/src/theme';
import { useHaptics } from '@/src/hooks';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'gold' | 'green' | 'primary' | 'error';
  icon?: ReactNode;
  iconRight?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'md' | 'lg';
  style?: object;
}

const variantGradients: Record<string, [string, string]> = {
  gold: ['#FDE047', '#FACC15'],
  green: ['#22C55E', '#16A34A'],
  primary: ['#0F5132', '#14532D'],
  error: ['#EF4444', '#B91C1C'],
};

const variantTextColors: Record<string, string> = {
  gold: '#1A1A1A',
  green: '#FFFFFF',
  primary: '#FFFFFF',
  error: '#FFFFFF',
};

export function GradientButton({
  label,
  onPress,
  variant = 'green',
  icon,
  iconRight,
  disabled = false,
  loading = false,
  fullWidth = true,
  size = 'lg',
  style,
}: GradientButtonProps) {
  const { trigger } = useHaptics();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(disabled ? 0.5 : 1, { duration: 200 });
  }, [disabled, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    trigger('light');
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (!disabled && !loading) onPress();
  };

  const height = size === 'lg' ? 56 : 48;
  const paddingH = size === 'lg' ? 24 : 20;
  const fontSize = size === 'lg' ? 17 : 15;

  return (
    <Animated.View style={[animatedStyle, fullWidth && { width: '100%' }, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={{ width: fullWidth ? '100%' : undefined }}
      >
        <LinearGradient
          colors={variantGradients[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height,
            borderRadius: radius.lg,
            paddingHorizontal: paddingH,
            gap: 8,
            ...shadows.md,
          }}
        >
          {loading ? (
            <Animated.View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2.5,
                borderColor: variantTextColors[variant],
                borderTopColor: 'transparent',
                transform: [{ rotate: '0deg' }],
              }}
            />
          ) : (
            <>
              {icon}
              <Animated.Text
                style={{
                  ...typography.button,
                  fontSize,
                  color: variantTextColors[variant],
                }}
              >
                {label}
              </Animated.Text>
              {iconRight}
            </>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
