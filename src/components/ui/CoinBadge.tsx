import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Coins } from 'lucide-react-native';
import { colors, spacing, radius, shadows, typography } from '@/src/theme';
import { formatNumber } from '@/src/utils';

interface CoinBadgeProps {
  amount: number;
  style?: object;
}

export function CoinBadge({ amount, style }: CoinBadgeProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Coins size={16} color={colors.gold} />
      </View>
      <Text style={styles.amount}>{formatNumber(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(250, 204, 21, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.25)',
  },
  iconContainer: {},
  amount: {
    ...typography.bodyBold,
    fontSize: 14,
    color: colors.gold,
  },
});
