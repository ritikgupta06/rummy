import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, X } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { AnimatedModal } from './AnimatedModal';
import { GradientButton } from '@/src/components/ui/GradientButton';
import type { Player } from '@/src/types';
import { colors, spacing, radius, shadows, typography } from '@/src/theme';
import { formatNumber } from '@/src/utils';

interface WinnerModalProps {
  visible: boolean;
  winner: Player | null;
  onClose: () => void;
  onPlayAgain: () => void;
  onExit: () => void;
}

export function WinnerModal({ visible, winner, onClose, onPlayAgain, onExit }: WinnerModalProps) {
  return (
    <AnimatedModal visible={visible} onClose={onClose} dismissable={false}>
      <View style={styles.container}>
        <View style={styles.closeButton}>
          <Pressable onPress={onClose} style={styles.closePress}>
            <X size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.trophyContainer}>
          <LinearGradient
            colors={['#FDE047', '#FACC15', '#CA8A04']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.trophyBg}
          >
            <Trophy size={48} color="#1A1A1A" />
          </LinearGradient>
        </View>
        <Text style={styles.title}>Winner!</Text>
        <Text style={styles.winnerName}>{winner?.name ?? 'Player'}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{winner?.score ?? 0}</Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.gold }]}>
              +{formatNumber(500)}
            </Text>
            <Text style={styles.statLabel}>Coins</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <GradientButton label="Play Again" onPress={onPlayAgain} variant="green" />
          <GradientButton label="Exit Game" onPress={onExit} variant="primary" />
        </View>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  closePress: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  trophyContainer: {
    marginBottom: spacing.lg,
  },
  trophyBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.gold,
  },
  title: {
    ...typography.h2,
    fontSize: 32,
    color: colors.gold,
    marginBottom: 4,
  },
  winnerName: {
    ...typography.h4,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginBottom: spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    fontSize: 24,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
});
