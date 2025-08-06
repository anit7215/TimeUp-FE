// src/layouts/BottomLayout.tsx
import React from 'react';
import { View } from 'react-native';
import Navbar from '../components/common/Navbar';

interface BottomLayoutProps {
  children: React.ReactNode;
}

export default function BottomLayout({ children }: BottomLayoutProps) {
  return (
    <View className="flex-1 bg-black">
      <View className="flex-1">{children}</View>
      <Navbar />
    </View>
  );
}