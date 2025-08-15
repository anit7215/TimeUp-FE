// src/layouts/BottomLayout.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Navbar from '../components/common/Navbar';

interface BottomLayoutProps {
  children: React.ReactNode;
}

export default function BottomLayout({ children }: BottomLayoutProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      <View style={styles.navbarWrapper}>
        <Navbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    paddingBottom: 70,
  },
  navbarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
