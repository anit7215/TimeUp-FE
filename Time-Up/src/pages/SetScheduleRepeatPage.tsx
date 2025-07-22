import {
  BottomSheetModal, BottomSheetView
} from '@gorhom/bottom-sheet';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import LeftArrowIcon from '../../assets/icons/LeftArrowIcon.svg';
import CheckBox from '../components/common/CheckBox';


export default function SetScheduleRepeatPage() {
      const [selectedItem, setSelectedItem] = useState<string | null>(null)
      const route=useRoute()
      const navigation=useNavigation() as any
      const { onSelect, currentValue } = useRoute().params as {
        onSelect: (val: string) => void
        currentValue: string
      }
      const [selectedRepeat, setSelectedRepeat] = useState(currentValue || '')
      const bottomSheetModalRef = useRef<BottomSheetModal>(null)
      const snapPoints = useMemo(() => ['50%', '50%'], [])
      const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index)
      }, [])
      const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'))
    const [repeatType, setRepeatType] = useState<'weekly' | 'monthly' | 'none'>('none')
    const [selectedWeekdays, setSelectedWeekdays] = useState<{ [key: string]:boolean}>({
        Sun: false,
        Mon: false,
        Tue: false,
        Wed: true,
        Thu: false,
        Fri: false,
        Sat: false,
    })
    const dayMap: { [key: string]: string } = {
        '일': 'Sun',
        '월': 'Mon',
        '화': 'Tue',
        '수': 'Wed',
        '목': 'Thu',
        '금': 'Fri',
        '토': 'Sat',
      }
    const toggleWeekday = (korDay: string) => {
        const engDay = dayMap[korDay]
        setSelectedWeekdays(prev => ({
          ...prev,
          [engDay]: !prev[engDay],
        }))
      }
      
    const [endType, setEndType] = useState<'setRepeatNum' | 'setEndDay' | null>(null)

    const handleEndType = (type: 'setRepeatNum' | 'setEndDay') => {
        setEndType(type);
        console.log(`선택된 반복 종료 타입: ${type}`);
      }

    const [value, setValue] = useState('') // 일정 횟수 반복

    const handleNumChange = (text: string) => { // 반복 횟수 설정
        // 숫자만 남기기
        const onlyNumbers = text.replace(/[^0-9]/g, '')
      
        // 숫자 변환해서 최대 100 제한
        const num = parseInt(onlyNumbers || '0', 10)
        if (num > 100) return
      
        setValue(onlyNumbers)
      }


  return ( // 뒤로가기랑 확인 네비게이션은 나중에 공통으로 만들도록 합시다
    <View className="flex-1 bg-[#121212] pt-20 px-4">
    <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: '#33363B' }} // 배경색 설정
    > 
  <BottomSheetView style={{ flex: 1, padding: 16}}>

      {(selectedItem === '종료 날짜 설정') && (
        <View>
          <Calendar
            key={currentDate}
            current={currentDate}
            theme={{
              calendarBackground: '#33363B',
              textDisabledColor: 'gray',

            }}
            markedDates={{
              [currentDate]: {
                selected: true,
                selectedColor: 'blue',
              },
            }}

            renderHeader={(date) => {
              return (
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                  {moment(date).format('M월 YYYY')}
                </Text>
              )
            }}

            dayComponent={({ date, state }) => {
              if (!date) return null

              const day = date.day
              const dateString = date.dateString
              const dayOfWeek = new Date(dateString).getDay()
              const isSelected = dateString === currentDate

              const getTextColor = () => {
                if (state === 'disabled') return 'gray'
                if (isSelected) return 'white'
                if (dayOfWeek === 0) return '#FF3B30'
                if (dayOfWeek === 6) return '#007AFF'
                return 'white'
              }

              return (
                <TouchableOpacity
                  onPress={() => {
                    console.log('Pressed date:', dateString)
                    setCurrentDate(dateString)
                  }}
                >
                  <View
                    className={`w-10 h-10 justify-center items-center rounded-full ${
                      isSelected ? 'bg-blue-600' : ''
                    }`}
                  >
                    <Text style={{ color: getTextColor(), fontSize: 16 }}>{day}</Text>
                  </View>
                </TouchableOpacity>
              )
            }}
            />
                <View className="flex-row justify-between mt-6 px-10 py-8">
                  <TouchableOpacity
                    onPress={() => console.log('취소')}
                    className="w-[48%] bg-transparent py-3 rounded-lg items-center "
                  >
                    <Text className="text-white text-base text-[18px]">취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => console.log('선택')}
                    className="w-[48%] bg-transparent py-3 rounded-lg items-center"
                  >
                    <Text className="text-white text-base text-[18px]">선택</Text>
                     {/* 선택 버튼 누르면 저장되고 모달 자동으로 닫히는 로직 추후 추가 */}
                  </TouchableOpacity>
                            </View>
                </View>
      )}
            </BottomSheetView>
        </BottomSheetModal>
  
        <View className="flex-row space-between">
        <TouchableOpacity onPress={() => console.log('뒤로가기')}>
            < LeftArrowIcon/>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => {
            if (onSelect) onSelect(selectedRepeat)
            navigation.goBack()
          }}
          style={{
            marginTop: 40,
            padding: 16,
            backgroundColor: '#007AFF',
            borderRadius: 8,
            alignItems: 'center',
          }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>확인</Text>
      </TouchableOpacity>
        </View>

        <View className="flex-column ml-[16px] mr-[16px] pl-4 pt-4">
            <Text className="text-white text-[20px]">반복 주기</Text>
                <View className="flex-row p-4">
                    <CheckBox
                    isChecked={repeatType === 'weekly'}
                    onValueChangeHandler={() =>
                        setRepeatType(prev => (prev === 'weekly' ? 'none' : 'weekly'))
                      }
                    disabled={false}
                    >
                    </CheckBox>

                    <Text className="text-white text-[20px] ml-2 p-3">1주마다</Text>
                </View>
                <View className={`flex-row items-center justify-center ${repeatType === 'weekly' ? 'mb-2' : '-mt-2'}`}>
                    {repeatType === 'weekly' && (
                        ['일', '월', '화', '수', '목', '금', '토'].map((day) => {
                            const engDay=dayMap[day]
                            const isSelected = selectedWeekdays[engDay]

                            return (
                            <TouchableOpacity
                                key={day}
                                onPress={() => toggleWeekday(day)}
                                className={`w-8 h-8 mx-1 rounded-full items-center justify-center border ${
                                    isSelected ? 'border-white' : 'border-0'
                                }`}
                                >
                                    <Text className="text-white text-[20px]">{day}</Text>
                            </TouchableOpacity>
                    )
                }
                )
            )}

                </View>
                <View className="flex-row pl-4">
                    <CheckBox
                    isChecked={repeatType === 'monthly'}
                    onValueChangeHandler={() =>
                        setRepeatType(prev => (prev === 'monthly' ? 'none' : 'monthly'))
                    }
                    disabled={false}
                    >
                    </CheckBox>

                    <Text className="text-white text-[20px] ml-2 p-3">1개월마다</Text>
                    

                </View>
                <View className="items-center justify-center">
                {repeatType === 'monthly' && (
                    <View className="m-4">
                        <TouchableOpacity
                            className="bg-[#33373B] w-[300px] rounded-[24px] m-2 px-4 py-[8px] items-center justify-center"
                        >
                            <Text className="text-white text-[18px]">21일마다 반복</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-[#33373B] w-[300px] rounded-[24px] m-2 px-4 py-[8px] items-center justify-center"
                        >
                            <Text className="text-white text-[18px]">세 번째 수요일마다 반복</Text>
                        </TouchableOpacity>
                        </View>

                        )
                    }
                    </View>
        </View>


        <View className="flex-column ml-[16px] mr-[16px] pl-4 pt-4">
            <Text className="text-white text-[20px]">반복 기간</Text>
                <View className="flex-row p-4">
                    <CheckBox
                    isChecked={endType === 'setRepeatNum'}
                    onValueChangeHandler={() => handleEndType('setRepeatNum')}
                    disabled={false}
                    >
                    </CheckBox>

                    <Text className="text-white text-[20px] ml-2 p-3">일정 횟수 반복</Text>
                </View>

                <View className="justify-center items-center flex-row">
                {endType === 'setRepeatNum' && (   
                    <View className="flex-row justify-center items-center ">          
                    <TextInput 
                        keyboardType="numeric"
                        value={value}
                        
                        onChangeText={handleNumChange} // 숫자만 입력하게
                        className="text-white border-b border-white p-2 text-[25px]"
                    />
                    <Text className="text-white text-[25px]">회 반복</Text>
                    </View>       
                    )}

                </View>
                <View className="flex-row pl-4">
                    <CheckBox
                    isChecked={endType === 'setEndDay'}
                    onValueChangeHandler={() => {
                        handleEndType('setEndDay')
                        setSelectedItem('종료 날짜 설정')
                        bottomSheetModalRef.current?.present()
                    } }
                    disabled={false}
                    >
                    </CheckBox>

                    <Text className="text-white text-[20px] ml-2 p-3">종료 날짜 설정</Text>
                    

                </View>

        </View>
  
    </View>
    
  )
}
