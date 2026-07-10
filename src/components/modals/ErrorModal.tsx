import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { AnimatedModal } from './AnimatedModal';
import { GradientButton } from '@/src/components/ui';
import { colors, spacing, typography } from '@/src/theme';

interface ErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
}

export function ErrorModal({ visible, message, onClose, onRetry }: ErrorModalProps) {
  return (
    <AnimatedModal visible={visible} onClose={onClose} style={styles.modal}>
      <View style={styles.modal}>
        <View style={styles.iconContainer}>
          <AlertCircle size={32} color={colors.error} />
        </View>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          {onRetry && <GradientButton label="Try Again" onPress={onRetry} variant="green" />}
          <GradientButton label="Close" onPress={onClose} variant="primary" />
        </View>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  modal: {
    maxWidth: 340,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  title: {
    ...typography.h4,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
});
