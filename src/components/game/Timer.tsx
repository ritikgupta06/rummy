import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock } from 'lucide-react-native';
import { colors, spacing, radius, shadows, typography } from '@/src/theme';
import { formatTime } from '@/src/utils';

interface TimerProps {
  seconds: number;
  total?: number;
  style?: object;
}

export function Timer({ seconds, total = 30, style }: TimerProps) {
  const progress = seconds / total;
  const isUrgent = seconds <= 10;

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={isUrgent ? ['#EF4444', '#B91C1C'] : ['#FDE047', '#FACC15']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.badge}
      >
        <Clock size={16} color={isUrgent ? '#FFFFFF' : '#1A1A1A'} />
        <Text style={[styles.time, isUrgent && styles.timeUrgent]}>
          {formatTime(seconds)}
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    ...shadows.sm,
  },
  time: {
    ...typography.bodyBold,
    fontSize: 14,
    color: '#1A1A1A',
  },
  timeUrgent: {
    color: '#FFFFFF',
  },
});
