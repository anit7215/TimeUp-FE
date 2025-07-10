// src/components/PageBackButton.tsx
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PageBackButton() {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      edges={['top']}
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ padding: 20 }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
