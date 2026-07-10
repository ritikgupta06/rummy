import { useCallback } from 'react';
import { Share, Platform, Clipboard } from 'react-native';

export function useShare() {
  const share = useCallback(async (message: string, title?: string) => {
    if (Platform.OS === 'web') {
      try {
        await navigator.share({ title, text: message });
      } catch {
        try {
          await navigator.clipboard.writeText(message);
        } catch {
          // clipboard not available
        }
      }
      return;
    }
    try {
      await Share.share({ message, title });
    } catch {
      // share cancelled
    }
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(text);
      } else {
        Clipboard.setString(text);
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  return { share, copyToClipboard };
}
