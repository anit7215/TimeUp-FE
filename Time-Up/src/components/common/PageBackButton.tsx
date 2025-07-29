// src/components/common/PageBackButton.tsx
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function PageBackButton() {
  const navigation = useNavigation();

  return (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ padding: 20 }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
  );
}