import { Text, TouchableOpacity, View } from 'react-native';

interface ConfirmButtonProps {
  onPress: () => void; // 눌렀을 때 실행되는 함수
  title?: string;
  disabled?: boolean; // 버튼 비활성화 여부
}

export default function ConfirmButton({ title, onPress, disabled }: ConfirmButtonProps) {
  return (
    <TouchableOpacity
    disabled={disabled}
      className={`
        ${disabled ? "opacity-40" : "opacity-100"}
      bg-blue w-[128px] h-[48px] rounded-[12px] px-[16px] py-[12px] items-center justify-center`}
      onPress={onPress}
      activeOpacity = {0.8} // 터치 시 약간의 투명도 변화
    >
    {/* 내부 inset shadow 대체 뷰 */}
      <View
        className="absolute w-full h-full rounded-[12px]"
        style={{
          boxShadow: "inset 0px 2px 4px #B2B2FF80"
        }}
      />
      <Text className="text-white text-[22px] font-pretendard text-base">{title}</Text>
    </TouchableOpacity>
  );
}
