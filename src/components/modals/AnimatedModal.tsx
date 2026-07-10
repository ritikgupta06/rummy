import { View, Text, StyleSheet, Pressable, Modal, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { colors, spacing, radius, shadows, typography } from '@/src/theme';

interface AnimatedModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  style?: ViewStyle;
  dismissable?: boolean;
}

export function AnimatedModal({
  visible,
  onClose,
  children,
  title,
  style,
  dismissable = true,
}: AnimatedModalProps) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 18, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0.8, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={dismissable ? onClose : undefined}>
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={dismissable ? onClose : undefined}
        />
        <Animated.View style={[styles.modal, animatedStyle, style]}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modal: {
    width: '100%',
    maxWidth: 360,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...shadows.xl,
    overflow: 'hidden',
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  title: {
    ...typography.h4,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
