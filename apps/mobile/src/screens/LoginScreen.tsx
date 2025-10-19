import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login();
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        'Unable to sign in with Microsoft. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Cypilot</Text>
          <Text style={styles.subtitle}>AI University Copilot</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Your all-in-one Iowa State University companion
          </Text>
          <Text style={styles.features}>
            • Canvas assignments and grades{'\n'}
            • Important Outlook emails{'\n'}
            • Workday notifications{'\n'}
            • CyRide bus schedules
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Signing in...' : 'Sign in with Microsoft'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By signing in, you agree to use your Iowa State University account
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  descriptionContainer: {
    marginBottom: 48,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  features: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
