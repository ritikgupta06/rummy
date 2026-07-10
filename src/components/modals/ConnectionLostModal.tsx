import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { AnimatedModal } from './AnimatedModal';
import { GradientButton } from '@/src/components/ui';
import { colors, spacing, typography } from '@/src/theme';

interface ConnectionLostModalProps {
  visible: boolean;
  onRetry: () => void;
}

export function ConnectionLostModal({ visible, onRetry }: ConnectionLostModalProps) {
  return (
    <AnimatedModal visible={visible} onClose={() => {}} dismissable={false} style={styles.modal}>
      <View style={styles.modal}>
        <View style={styles.iconContainer}>
          <WifiOff size={32} color={colors.error} />
        </View>
        <Text style={styles.title}>Connection Lost</Text>
        <Text style={styles.message}>
          Oops! You've been disconnected. Check your internet and try again.
        </Text>
        <GradientButton label="Retry Connection" onPress={onRetry} variant="green" />
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
});
