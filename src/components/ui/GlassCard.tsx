import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, shadows, typography } from '@/src/theme';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  style?: object;
  padding?: number;
}

export function GlassCard({ children, style, padding = spacing.lg }: GlassCardProps) {
  return (
    <View style={[styles.container, { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(16, 38, 29, 0.6)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...shadows.md,
  },
});
