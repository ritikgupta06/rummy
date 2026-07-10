import { useCallback } from 'react';
import { Platform } from 'react-native';

export function useHaptics() {
  const trigger = useCallback(async (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (Platform.OS === 'web') return;
    try {
      const Haptics = await import('expo-haptics');
      const impactMap = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      };
      await Haptics.impactAsync(impactMap[style]);
    } catch {
      // Haptics not available
    }
  }, []);

  const notify = useCallback(async (type: 'success' | 'warning' | 'error' = 'success') => {
    if (Platform.OS === 'web') return;
    try {
      const Haptics = await import('expo-haptics');
      const typeMap = {
        success: Haptics.NotificationFeedbackType.Success,
        warning: Haptics.NotificationFeedbackType.Warning,
        error: Haptics.NotificationFeedbackType.Error,
      };
      await Haptics.notificationAsync(typeMap[type]);
    } catch {
      // Haptics not available
    }
  }, []);

  return { trigger, notify };
}
