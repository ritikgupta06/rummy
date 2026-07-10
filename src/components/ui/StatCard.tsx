import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { colors, spacing, radius, shadows, typography } from '@/src/theme';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  gradient?: [string, string];
  style?: object;
}

export function StatCard({ icon, label, value, gradient = ['#16A34A', '#0F5132'], style }: StatCardProps) {
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 96,
    ...shadows.md,
  },
  iconContainer: {
    marginBottom: 4,
  },
  value: {
    ...typography.h4,
    fontSize: 22,
    color: colors.textPrimary,
  },
  label: {
    ...typography.label,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
