import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { colors, typography } from '../../../shared/theme';

type SplashNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Splash'>;

export function SplashScreen() {
  const navigation = useNavigation<SplashNavigationProp>();

  useEffect(() => {
    // Auto-navigate to login after brief delay
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RateApp</Text>
      <Text style={styles.subtitle}>Anonymous peer feedback</Text>
      <ActivityIndicator
        style={styles.loader}
        size="small"
        color={colors.primary[500]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  title: {
    ...typography.styles.h1,
    color: colors.primary[600],
    marginBottom: 8,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  loader: {
    marginTop: 40,
  },
});
