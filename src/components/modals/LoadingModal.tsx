import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Modal } from 'react-native';
import { colors, spacing, typography } from '@/src/theme';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export function LoadingModal({ visible, message = 'Loading...' }: LoadingModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxl,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  message: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
});
