import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Platform, Keyboard, Pressable, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';
import Button from '../../components/ui/Button';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Login failed. Please try again.';
      Alert.alert('Login Failed', errorMessage, [
        { text: 'OK', onPress: () => dispatch(clearError()) }
      ]);
    }
  }, [error, dispatch]);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    
    Keyboard.dismiss();
    
    try {
      await dispatch(login({ email: email.trim(), password }));
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const Container = Platform.OS === 'web' ? View : Pressable;
  const containerProps = Platform.OS === 'web' 
    ? { style: { flex: 1 } }
    : { onPress: Keyboard.dismiss, style: { flex: 1 } };

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <Container {...containerProps}>
        <View style={styles.content}>
          <Image
            source={
              Platform.OS === 'ios'
                ? require('../../../assets/ios/AppIcon~ios-marketing.png')
                : Platform.OS === 'android'
                ? require('../../../assets/android/res/mipmap-xxxhdpi/Fomo.png')
                : require('../../../assets/web/icon-512.png')
            }
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>FOMO</Text>
          <Text style={styles.subtitle}>Build Habits, Earn Rewards</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#BDBDBD"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => Keyboard.dismiss()}
              blurOnSubmit={false}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#BDBDBD"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              editable={!loading}
            />

            <Button 
              title={loading ? "Logging in..." : "Login"} 
              onPress={handleLogin} 
              variant="primary" 
              style={styles.button}
              disabled={loading}
            />
            
            {loading && (
              <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />
            )}

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} disabled={loading}>
              <Text style={[styles.linkText, loading && styles.disabledText]}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
              <Text style={[styles.linkText, loading && styles.disabledText]}>Don't have an account? Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.9,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  loader: {
    marginTop: 8,
    alignSelf: 'center',
  },
  linkText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  disabledText: {
    opacity: 0.5,
  },
});
