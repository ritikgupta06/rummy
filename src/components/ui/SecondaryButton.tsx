import { Pressable, View, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { colors, radius, shadows, typography } from '@/src/theme';
import { useHaptics } from '@/src/hooks';

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: object;
}

export function SecondaryButton({
  label,
  onPress,
  icon,
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}: SecondaryButtonProps) {
  const { trigger } = useHaptics();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    trigger('light');
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View style={[animatedStyle, fullWidth && { width: '100%' }, style]}>
      <Pressable
        onPress={() => !disabled && !loading && onPress()}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={{ width: fullWidth ? '100%' : undefined }}
      >
        <View style={[styles.container, disabled && styles.disabled]}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.gold} />
          ) : (
            <>
              {icon}
              <Animated.Text style={styles.label}>{label}</Animated.Text>
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 18,
    paddingHorizontal: 24,
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(250, 204, 21, 0.3)',
  },
  label: {
    ...typography.button,
    fontSize: 17,
    color: colors.gold,
  },
  disabled: {
    opacity: 0.5,
  },
});
