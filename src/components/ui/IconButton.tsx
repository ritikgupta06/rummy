import { Pressable, View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radius, shadows, typography } from '@/src/theme';
import { useHaptics } from '@/src/hooks';
import type { ReactNode } from 'react';

interface IconButtonProps {
  icon: ReactNode;
  onPress: () => void;
  size?: number;
  variant?: 'default' | 'gold' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: object;
}

export function IconButton({
  icon,
  onPress,
  size = 44,
  variant = 'default',
  disabled = false,
  loading = false,
  style,
}: IconButtonProps) {
  const { trigger } = useHaptics();

  const handlePress = () => {
    if (!disabled && !loading) {
      trigger('light');
      onPress();
    }
  };

  const bgColors: Record<string, string> = {
    default: 'rgba(255, 255, 255, 0.06)',
    gold: 'rgba(250, 204, 21, 0.12)',
    danger: 'rgba(239, 68, 68, 0.12)',
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColors[variant],
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.gold} />
      ) : (
        icon
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
