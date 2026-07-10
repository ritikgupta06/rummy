import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';
import { OTPInput, GradientButton, Toast } from '@/src/components/ui';
import { LoadingModal } from '@/src/components/modals';
import { colors, typography, spacing, shadows } from '@/src/theme';
import { authService } from '@/src/services';
import { useAuthStore } from '@/src/store';
import { useCountdown, useToast, useHaptics } from '@/src/hooks';
import { OTP_LENGTH, OTP_RESEND_SECONDS } from '@/src/constants';

export default function OtpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ phone: string }>();
  const { toast, showToast, hideToast } = useToast();
  const { notify, trigger } = useHaptics();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { seconds, start, restart, isActive } = useCountdown(OTP_RESEND_SECONDS);

  useEffect(() => {
    start();
  }, [start]);

  const handleVerify = useCallback(async () => {
    if (otp.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits`);
      notify('error');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await authService.verifyOtp(params.phone || '9876543210', otp);
      setAuthenticated(result.user, result.token);
      notify('success');
      router.replace('/(app)/home');
    } catch (err) {
      setError('Invalid OTP. Try again.');
      notify('error');
    } finally {
      setLoading(false);
    }
  }, [otp, params.phone, setAuthenticated, router, notify]);

  const handleResend = useCallback(async () => {
    if (seconds > 0) return;
    setLoading(true);
    try {
      await authService.resendOtp(params.phone || '9876543210');
      showToast('OTP resent successfully', 'success');
      restart();
    } catch (err) {
      showToast('Failed to resend OTP', 'error');
    } finally {
      setLoading(false);
    }
  }, [seconds, params.phone, showToast, restart]);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (error) setError('');
    if (value.length === OTP_LENGTH) {
      trigger('medium');
    }
  };

  return (
    <LinearGradient
      colors={['#0A1F16', '#071A12']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </Pressable>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <ShieldCheck size={32} color={colors.gold} />
            </View>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the {OTP_LENGTH}-digit code sent to{'\n'}
              <Text style={styles.phoneHighlight}>{params.phone || 'your number'}</Text>
            </Text>
          </View>

          <View style={styles.form}>
            <OTPInput value={otp} onChange={handleOtpChange} />
            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>
                {seconds > 0 ? `Resend code in ${seconds}s` : "Didn't receive the code?"}
              </Text>
              {seconds === 0 && (
                <Pressable onPress={handleResend}>
                  <Text style={styles.resendButton}>Resend</Text>
                </Pressable>
              )}
            </View>

            <GradientButton
              label="Verify & Continue"
              onPress={handleVerify}
              variant="gold"
              loading={loading}
              disabled={otp.length < OTP_LENGTH}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Protecting your account is our priority.{'\n'}
              Never share your OTP with anyone.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingModal visible={loading} message="Verifying OTP..." />
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginLeft: 16,
    marginTop: 8,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 36,
    gap: 12,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.2)',
    ...shadows.gold,
  },
  title: {
    fontFamily: 'Sora-Bold',
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  phoneHighlight: {
    color: colors.gold,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: 24,
    gap: 24,
  },
  errorText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 13,
    color: colors.error,
    textAlign: 'center',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resendText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  resendButton: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 14,
    color: colors.gold,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 32,
  },
  footerText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
