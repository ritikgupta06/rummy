import { View, Text, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { colors, radius, shadows, typography } from '@/src/theme';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  autoFocus?: boolean;
  editable?: boolean;
  secureTextEntry?: boolean;
  style?: object;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength,
  autoFocus = false,
  editable = true,
  secureTextEntry = false,
  style,
}: InputProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {icon && <View style={styles.iconWrapper}>{icon}</View>}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          autoFocus={autoFocus}
          editable={editable}
          secureTextEntry={secureTextEntry}
          autoCorrect={false}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputError: {
    borderColor: colors.error,
  },
  iconWrapper: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...typography.body,
    fontSize: 16,
    color: colors.textPrimary,
    height: '100%',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
});
