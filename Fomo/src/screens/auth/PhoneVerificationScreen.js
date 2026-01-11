import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Keyboard, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/ui/Button';

/**
 * Phone Verification Screen
 * OTP verification for phone number
 */
export default function PhoneVerificationScreen({ navigation, route }) {
  const phoneNumber = route?.params?.phoneNumber || '+1234567890';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    // TODO: Implement OTP verification API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Phone number verified successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    }, 1500);
  };

  const handleResendCode = () => {
    // TODO: Implement resend OTP API call
    Alert.alert('Code Sent', 'A new verification code has been sent to your phone.');
  };

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Verify Phone Number</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to{'\n'}
              <Text style={styles.phoneNumber}>{phoneNumber}</Text>
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  editable={!loading}
                />
              ))}
            </View>

            <Button
              title={loading ? "Verifying..." : "Verify Code"}
              onPress={handleVerify}
              variant="primary"
              style={styles.button}
              loading={loading}
              disabled={loading}
            />

            <TouchableOpacity onPress={handleResendCode} disabled={loading}>
              <Text style={styles.resendText}>Didn't receive code? Resend</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              disabled={loading}
              style={styles.changeNumberButton}
            >
              <Text style={styles.changeNumberText}>Change phone number</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 16,
    paddingTop: 50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.9,
    lineHeight: 22,
  },
  phoneNumber: {
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000000',
  },
  button: {
    marginBottom: 16,
  },
  resendText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  changeNumberButton: {
    marginTop: 24,
  },
  changeNumberText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.8,
  },
});
