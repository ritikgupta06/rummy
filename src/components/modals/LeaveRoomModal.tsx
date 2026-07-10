import { View, Text, StyleSheet } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { AnimatedModal } from './AnimatedModal';
import { GradientButton, SecondaryButton } from '@/src/components/ui';
import { colors, spacing, typography } from '@/src/theme';

interface LeaveRoomModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function LeaveRoomModal({
  visible,
  onClose,
  onConfirm,
  title = 'Leave Room?',
  message = 'Are you sure you want to leave this room? Other players will be notified.',
}: LeaveRoomModalProps) {
  return (
    <AnimatedModal visible={visible} onClose={onClose} style={styles.modal}>
      <View style={styles.modal}>
        <View style={styles.iconContainer}>
          <LogOut size={32} color={colors.error} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          <GradientButton label="Leave" onPress={onConfirm} variant="error" />
          <SecondaryButton label="Stay" onPress={onClose} />
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
    marginTop: spacing.sm,
  },
});
