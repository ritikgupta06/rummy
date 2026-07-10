import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Phone, Check } from 'lucide-react-native';
import { Input, GradientButton, Toast } from '@/src/components/ui';
import { LoadingModal } from '@/src/components/modals';
import { colors, typography, spacing, radius, shadows } from '@/src/theme';
import { authService } from '@/src/services';
import { useToast, useHaptics } from '@/src/hooks';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const { notify, trigger } = useHaptics();

  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10;
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9+\s-]/g, '');
    setPhone(cleaned);
    if (error) setError('');
  };

  const handleContinue = useCallback(async () => {
    if (!validatePhone(phone)) {
      setError('Please enter a valid mobile number');
      notify('error');
      return;
    }
    if (!agreed) {
      showToast('Please accept the terms to continue', 'error');
      notify('error');
      return;
    }

    setLoading(true);
    try {
      await authService.sendOtp(phone);
      showToast('OTP sent successfully', 'success');
      notify('success');
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    } catch (err) {
      showToast('Failed to send OTP. Try again.', 'error');
      notify('error');
    } finally {
      setLoading(false);
    }
  }, [phone, agreed, router, showToast, notify]);

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
              <Phone size={32} color={colors.gold} />
            </View>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Enter your mobile number to{'\n'}get started
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Mobile Number"
              value={phone}
              onChangeText={handlePhoneChange}
              placeholder="98765 43210"
              keyboardType="phone-pad"
              icon={<Phone size={20} color={colors.textMuted} />}
              error={error}
              maxLength={15}
              autoFocus
            />

            <Pressable
              style={styles.termsRow}
              onPress={() => {
                setAgreed(!agreed);
                trigger('light');
              }}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Check size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </Pressable>

            <GradientButton
              label="Send OTP"
              onPress={handleContinue}
              variant="gold"
              loading={loading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you'll receive a verification code via SMS.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingModal visible={loading} message="Sending OTP..." />
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
    paddingBottom: 32,
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
  form: {
    paddingHorizontal: 24,
    gap: 20,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  termsText: {
    flex: 1,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.gold,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
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
