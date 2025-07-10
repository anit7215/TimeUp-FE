import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import CancleButton from '../components/common/CancleButton';
import CheckBox from '../components/common/CheckBox';
import ConfirmButton from '../components/common/ConfirmButton'; // 확인 버튼 테스트용 임포트
import Dropdown from '../components/common/DropDown'; // 드롭다운 컴포넌트 임포트
import ToggleSwitch from '../components/common/ToggleSwitch';


export default function CalendarPage() {
  const handleConfirm = () => {
    console.log('버튼이 눌렸습니다')
  }

  const [checked, setChecked] = React.useState(false);
  const handleCheckBoxChange = (val: boolean) => {
    setChecked(val);
    console.log(`체크박스 상태: ${val ? '선택됨' : '선택되지 않음'}`);
  }

  const [on, setOn] = useState(false);

  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, [])

  const jobOptions = [
    { label: '직장인', value: 'office_worker' },
    { label: '공무원/군인', value: 'public_officer' },
    { label: '자영업자', value: 'self_employed' },
    { label: '프리랜서', value: 'freelancer' },
    { label: '학생', value: 'student' },
    { label: '무직', value: 'unemployed' },
  ]

  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  return (
    <View className="flex-1 items-center justify-center bg-[#121212] p-20">
      <Text className="text-xl text-white font-bold">테스트</Text>
      <ConfirmButton title="확인" onPress = {handleConfirm}/>

      <CheckBox
        isChecked={checked}
        onValueChangeHandler={handleCheckBoxChange}
        disabled={false}
        >
        </CheckBox>

      <Dropdown
      data={jobOptions}
      placeholder="직업 선택"
      value={selectedJob}
      onChange={setSelectedJob}
        />

      <ToggleSwitch
        isOn={on} onToggle={handleToggleSwitch} disabled={false}
        ></ToggleSwitch>

      <CancleButton title="취소" onPress = {handleConfirm}/>

    </View>
  );
}

