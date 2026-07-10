import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Wifi } from 'lucide-react-native';
import { getInitials, getAvatarColors } from '@/src/utils';
import { colors, shadows } from '@/src/theme';
import type { ViewStyle } from 'react-native';

interface AvatarProps {
  name: string;
  size?: number;
  imageUrl?: string | null;
  isHost?: boolean;
  isOnline?: boolean;
  style?: ViewStyle;
}

export function Avatar({ name, size = 44, imageUrl, isHost, isOnline, style }: AvatarProps) {
  const [color1, color2] = getAvatarColors(name);
  const initials = getInitials(name);
  const fontSize = size * 0.38;
  const badgeSize = Math.max(14, size * 0.3);

  return (
    <View style={[{ width: size, height: size }, style]}>
      <LinearGradient
        colors={[color1, color2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
      </LinearGradient>

      {isHost && (
        <View style={[styles.hostBadge, { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 }]}>
          <Crown size={badgeSize * 0.6} color={colors.cardBlack} />
        </View>
      )}

      {isOnline !== undefined && !isHost && (
        <View
          style={[
            styles.onlineBadge,
            {
              width: badgeSize * 0.7,
              height: badgeSize * 0.7,
              borderRadius: (badgeSize * 0.7) / 2,
              backgroundColor: isOnline ? colors.success : colors.textMuted,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  hostBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.background,
  },
});
