import PageBackButton from '@/src/components/common/PageBackButton'
import React, { useCallback, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import CheckBox from '../../components/common/CheckBox'
import ToggleSwitch from '../../components/common/ToggleSwitch'


export default function SetRemindAlarmPage() {
    const [alarmOn, setAlarmOn] = useState(false)


      const remindOptions = [
        '일정 시작 시간',
        '5분 전',
        '10분 전',
        '30분 전',
        '1시간 전',
        '1일 전',
      ]

      const [selectedOption, setSelectedOption] = useState<string>('')

      const handleToggleSwitch = useCallback(() => {
        setAlarmOn((prev) => {
          const next = !prev
          if (!next) {
            setSelectedOption('') // 스위치 off될 때만 선택값 초기화
          }
          return next
        })
      }, [])

    return (
        <View className="flex-1 flex-column bg-black w-full">
            <View className="flex-row justify-between items-center p-5 w-full">
            <PageBackButton />
            <TouchableOpacity onPress={() => console.log('확인')}>
                <Text className="text-white text-[16px]">확인</Text>
            </TouchableOpacity>
            </View>

            <View className="flex-row justify-between items-center p-10 w-full">
                <Text className="text-white text-[18px]">리마인드 알림</Text>
                <ToggleSwitch
                    isOn={alarmOn} onToggle={handleToggleSwitch} disabled={false}>
                </ToggleSwitch>

            </View>

            <View className="pl-10">
            {remindOptions.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => setSelectedOption(option)}
          className="flex-row items-center mb-5"
        >
          <CheckBox
            isChecked={selectedOption === option}
            onValueChangeHandler={() => setSelectedOption(option)}
            disabled={!alarmOn}
          />
          <Text className="text-white text-[16px] ml-3">{option}</Text>
        </TouchableOpacity>
      ))}
            </View>


        </View>
    )
}