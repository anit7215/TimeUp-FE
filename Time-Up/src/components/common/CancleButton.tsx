import React, { useState } from 'react';
import { LayoutChangeEvent, Text, TouchableOpacity, View } from 'react-native';
import Svg, {
  Defs,
  FeComposite,
  FeFlood,
  FeGaussianBlur,
  FeOffset,
  Filter,
  Rect,
} from 'react-native-svg';

interface CancelButtonProps {
  onPress: () => void;
  title?: string;
  disabled?: boolean;
}

export default function CancelButton({
  title = '취소',
  onPress,
  disabled,
}: CancelButtonProps) {
  const height = 48;
  const radius = 12;
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <TouchableOpacity
      onLayout={onLayout}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={{
        width: '100%',
        height,
        borderRadius: radius,
        overflow: 'hidden',
        opacity: disabled ? 0.4 : 1,
        position: 'relative',
      }}
    >
      {width > 0 && (
        <>
          <View style={{ position: 'absolute', width, height }}>
        <Svg width={width} height={height}>
          <Defs>
            <Filter id="cancel-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <FeOffset dx="0" dy="2" />
              <FeGaussianBlur stdDeviation="2" result="offset-blur" />
              <FeComposite in="SourceGraphic" in2="offset-blur" operator="out" result="inverse" />
              <FeFlood floodColor="#F7F7FE80" result="color" />
              <FeComposite in="color" in2="inverse" operator="in" result="shadow" />
              <FeComposite in="shadow" in2="SourceGraphic" operator="over" />
            </Filter>
          </Defs>

          <Rect
            x="0"
            y="0"
            width={width}
            height={height}
            rx={radius}
            ry={radius}
            fill="#C9CDD1"
            filter="url(#cancel-shadow)"
          />
        </Svg>
      </View>

      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#33373B',
            fontSize: 18,
            fontFamily: 'pretendard',
          }}
        >
          {title}
        </Text>
      </View>
        </>
      )}
    </TouchableOpacity>
  );
}