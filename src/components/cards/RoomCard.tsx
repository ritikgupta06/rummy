import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Gamepad2 } from 'lucide-react-native';
import type { GameMode } from '@/src/types';
import { colors, spacing, radius, shadows, typography } from '@/src/theme';

interface RoomCardProps {
  name: string;
  code: string;
  playersCount: number;
  maxPlayers: number;
  gameMode: GameMode;
  hostName: string;
  style?: object;
}

export function RoomCard({
  name,
  code,
  playersCount,
  maxPlayers,
  gameMode,
  hostName,
  style,
}: RoomCardProps) {
  return (
    <LinearGradient
      colors={['#1A3328', '#10261D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      <View style={styles.header}>
        <View style={styles.modeBadge}>
          <Gamepad2 size={12} color={colors.gold} />
          <Text style={styles.modeText}>{gameMode}</Text>
        </View>
        <Text style={styles.code}>{code}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <View style={styles.footer}>
        <View style={styles.playerInfo}>
          <Users size={14} color={colors.textSecondary} />
          <Text style={styles.playerCount}>
            {playersCount}/{maxPlayers} Players
          </Text>
        </View>
        <Text style={styles.hostName} numberOfLines={1}>by {hostName}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(250, 204, 21, 0.12)',
  },
  modeText: {
    ...typography.label,
    fontSize: 11,
    color: colors.gold,
    textTransform: 'capitalize',
  },
  code: {
    ...typography.bodyBold,
    fontSize: 14,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  name: {
    ...typography.h4,
    fontSize: 18,
    color: colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  hostName: {
    ...typography.caption,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
});
