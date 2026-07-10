import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import {
  Moon,
  Bell,
  Volume2,
  Music,
  Hand,
  HelpCircle,
  Shield,
  Info,
  ChevronRight,
  Vibrate,
} from 'lucide-react-native';
import { Header, SettingsRow, Toggle, GlassCard, Toast } from '@/src/components/ui';
import { colors, typography, spacing, radius, shadows } from '@/src/theme';
import { useSettingsStore } from '@/src/store';
import { useToast, useHaptics } from '@/src/hooks';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const { trigger } = useHaptics();

  const settings = useSettingsStore();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const opacity = useSharedValue(0);
  useState(() => {
    opacity.value = withTiming(1, { duration: 300 });
  });
  const containerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const handleToggle = useCallback(
    (key: 'darkMode' | 'notifications' | 'sound' | 'music' | 'haptics') => {
      trigger('light');
      settings.toggle(key);
    },
    [settings, trigger]
  );

  return (
    <LinearGradient
      colors={['#0A1F16', '#071A12']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Header title="Settings" subtitle="Customize your experience" onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 32 }}
      >
        <Animated.View style={containerStyle}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <GlassCard padding={0}>
              <SettingsRow
                icon={<Moon size={18} color={colors.gold} />}
                label="Dark Mode"
                subtitle="Use dark theme"
                right={<Toggle value={settings.darkMode} onValueChange={() => handleToggle('darkMode')} />}
                showChevron={false}
              />
              <SettingsRow
                icon={<Bell size={18} color={colors.gold} />}
                label="Notifications"
                subtitle="Game and room alerts"
                right={<Toggle value={settings.notifications} onValueChange={() => handleToggle('notifications')} />}
                showChevron={false}
              />
              <SettingsRow
                icon={<Hand size={18} color={colors.gold} />}
                label="Haptics"
                subtitle="Vibration feedback"
                right={<Toggle value={settings.haptics} onValueChange={() => handleToggle('haptics')} />}
                showChevron={false}
                isLast
              />
            </GlassCard>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Audio</Text>
            <GlassCard padding={0}>
              <SettingsRow
                icon={<Volume2 size={18} color={colors.gold} />}
                label="Sound Effects"
                subtitle="Card and game sounds"
                right={<Toggle value={settings.sound} onValueChange={() => handleToggle('sound')} />}
                showChevron={false}
              />
              <SettingsRow
                icon={<Music size={18} color={colors.gold} />}
                label="Music"
                subtitle="Background music"
                right={<Toggle value={settings.music} onValueChange={() => handleToggle('music')} />}
                showChevron={false}
                isLast
              />
            </GlassCard>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <GlassCard padding={0}>
              <SettingsRow
                icon={<HelpCircle size={18} color={colors.gold} />}
                label="Help & Support"
                subtitle="FAQs and contact"
                onPress={() => { trigger('light'); showToast('Help center coming soon!', 'info'); }}
              />
              <SettingsRow
                icon={<Shield size={18} color={colors.gold} />}
                label="Privacy Policy"
                subtitle="How we handle your data"
                onPress={() => { trigger('light'); showToast('Privacy policy coming soon!', 'info'); }}
              />
              <SettingsRow
                icon={<Info size={18} color={colors.gold} />}
                label="About"
                subtitle="Version 1.0.0"
                onPress={() => { trigger('light'); showToast('Rummy Royale v1.0.0', 'info'); }}
                isLast
              />
            </GlassCard>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Rummy Royale</Text>
            <Text style={styles.footerVersion}>Version 1.0.0</Text>
            <Text style={styles.footerCopy}>Made with care for rummy lovers</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <Toast
        message={toast?.message ?? ''}
        type={toast?.type}
        visible={toast?.visible ?? false}
        onHide={hideToast}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    gap: 4,
  },
  footerText: {
    fontFamily: 'Sora-Bold',
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  footerVersion: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 13,
    color: colors.textTertiary,
  },
  footerCopy: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
});
