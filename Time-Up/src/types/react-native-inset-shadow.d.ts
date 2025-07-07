declare module 'react-native-inset-shadow' {
    import * as React from 'react';
    import { StyleProp, ViewStyle } from 'react-native';
  
    interface InsetShadowProps {
      children?: React.ReactNode;
      shadowColor?: string;
      shadowOffset?: number;
      shadowOpacity?: number;
      shadowRadius?: number;
      elevation?: number;
      containerStyle?: StyleProp<ViewStyle>;
    }
  
    export default class InsetShadow extends React.Component<InsetShadowProps> {}
  }
  