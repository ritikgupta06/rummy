import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '@/src/theme';

interface LoadingViewProps {
  message?: string;
  fullscreen?: boolean;
}

export function LoadingView({ message = 'Loading...', fullscreen = true }: LoadingViewProps) {
  return (
    <View style={[styles.container, !fullscreen && styles.inline]}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: spacing.lg,
  },
  inline: {
    flex: undefined,
    padding: spacing.xl,
    backgroundColor: 'transparent',
  },
  spinnerContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.2)',
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
