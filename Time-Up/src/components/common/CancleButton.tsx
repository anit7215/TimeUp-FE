import { Text, TouchableOpacity, View } from 'react-native';

interface CancleButtonProps {
  onPress: () => void; // 눌렀을 때 실행되는 함수
  title?: string;
  disabled?: boolean; // 버튼 비활성화 여부
  bgcolor?: string;
}

export default function CancleButton({ title, onPress, disabled }: CancleButtonProps) {
  return (
    <TouchableOpacity
    disabled={disabled}
      className={`
        ${disabled ? "opacity-40" : "opacity-100"}
      bg-[#C9CDD1] w-[128px] h-[48px] rounded-[12px] px-[16px] py-[12px] items-center justify-center`}
      onPress={onPress}
      activeOpacity = {0.8} // 터치 시 약간의 투명도 변화
    >
    {/* 내부 inset shadow 대체 뷰 */}
      <View
        className="absolute w-full h-full rounded-[12px]"
        style={{
          boxShadow: "inset 0px 2px 4px #F7F7FE"
        }}
      />
      <Text className="text-[#33373B] text-[22px] font-pretendard text-base">{title}</Text>
    </TouchableOpacity>
  );
}
