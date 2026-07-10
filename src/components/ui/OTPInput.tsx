import { useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radius, typography } from '@/src/theme';
import { OTP_LENGTH } from '@/src/constants';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
}

export function OTPInput({ value, onChange, length = OTP_LENGTH, autoFocus = true }: OTPInputProps) {
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputs.current[0]?.focus(), 200);
    }
  }, [autoFocus]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      const numeric = text.replace(/[^0-9]/g, '');
      const newValue = value.split('');
      newValue[index] = numeric.charAt(numeric.length - 1) || '';
      onChange(newValue.join(''));

      if (numeric && index < length - 1) {
        inputs.current[index + 1]?.focus();
      }
    },
    [value, onChange, length]
  );

  const handleKeyPress = useCallback(
    (e: { nativeEvent: { key: string } }, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    },
    [value]
  );

  const handlePaste = useCallback(
    (text: string) => {
      const numeric = text.replace(/[^0-9]/g, '').slice(0, length);
      onChange(numeric);
      if (numeric.length === length) {
        inputs.current[length - 1]?.focus();
      }
    },
    [onChange, length]
  );

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputs.current[index] = ref;
          }}
          style={[
            styles.box,
            value[index] && styles.boxFilled,
            index === 0 && autoFocus && styles.boxActive,
          ]}
          value={value[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          textAlign="center"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  box: {
    width: 50,
    height: 60,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  boxFilled: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
  },
  boxActive: {
    borderColor: colors.secondary,
  },
});
