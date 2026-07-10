import { Pressable, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, spacing } from '@/src/theme';
import { useHaptics } from '@/src/hooks';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function Toggle({ value, onValueChange }: ToggleProps) {
  const { trigger } = useHaptics();
  const translateX = useSharedValue(value ? 24 : 0);

  const handleToggle = () => {
    const newValue = !value;
    translateX.value = withSpring(newValue ? 24 : 0, { damping: 20, stiffness: 300 });
    trigger('light');
    onValueChange(newValue);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Pressable onPress={handleToggle}>
      <View style={[styles.track, value && styles.trackActive]}>
        <Animated.View style={[styles.thumb, animatedStyle]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 3,
    justifyContent: 'center',
  },
  trackActive: {
    backgroundColor: colors.secondary,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
});
