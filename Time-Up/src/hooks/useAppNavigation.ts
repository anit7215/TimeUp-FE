import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

export default function useAppNavigation() {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
}
