import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="black" />
      <Stack
        screenOptions={{
          gestureEnabled: true,     // ✅ swipe from left to go back
          headerShown: false,       // you can set to true if you want system header
          animation: 'default',
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Updated background color
  },
});
