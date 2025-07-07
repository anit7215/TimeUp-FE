import React from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle?: (isOn: boolean) => void;
  disabled?: boolean;
}

export default function ToggleSwitch({
  isOn,
  onToggle,
  disabled = false,
}: ToggleSwitchProps) {
  const knobAnim = React.useRef(new Animated.Value(isOn ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(knobAnim, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  const interpolatePosition = knobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // knob's left position
  });

  const trackColor = disabled
    ? '#A0A0A0'
    : isOn
    ? '#4D4DFF' // ✅ 활성 시 파란색
    : '#D9D9D9';

  const handleToggle = () => {
    if (!disabled) {
      onToggle?.(!isOn);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        styles.track,
        { backgroundColor: trackColor, opacity: disabled ? 0.6 : 1 },
      ]}
    >
      <Animated.View
        style={[
          styles.knob,
          {
            left: interpolatePosition,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 40,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    position: 'relative',
  },
  knob: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1.5,
  },
});
