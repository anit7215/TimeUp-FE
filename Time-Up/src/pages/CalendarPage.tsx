import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import React, { useState } from 'react'
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native'
import { Calendar } from 'react-native-calendars'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const weekDayColors = ['#FF3B30', 'white', 'white', 'white', 'white', 'white', '#007AFF']
const screenWidth = Dimensions.get('window').width
const cellWidth = screenWidth / 7

export default function CalendarPage() {
  const navigation= useNavigation() as any // 이후 프로젝트 안정화 위해 RootStackParamList 타입으로 변경 예정
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'))

  const handleMonthChange = (increment: number) => {
    const newDate = moment(currentDate).add(increment, 'months').format('YYYY-MM-DD')
    setCurrentDate(newDate)
  }

  return (
    <View className="flex-1 bg-[#121212] pt-12 px-4">
      <View className="flex-row-reverse items-center mb-4 relative">
        <TouchableOpacity
          onPress={() => navigation.navigate('AddSchedulePage')}> {/* 일정 추가 버튼 클릭 시 AddSchedulePage로 이동. 일정을 선택하고 플러스 누르게 해야함. 로직은 나중에.. */}
            <Image
              source={require('../../assets/images/plus.png')}
              style={{ width: 28, height: 28 }} 
            /> 
          </TouchableOpacity>
      </View>
      
      <View className="mb-2 flex-row items-center"> {/* 커스텀 헤더 영역 */}
        <Text
          className="text-white text-lg"
          style={{ marginLeft: cellWidth }} // Sun 위치 정렬
        >
          {moment(currentDate).format('M월 YYYY')}
        </Text>
        <View className="flex-row items-center space-x-3 ml-auto">
          <TouchableOpacity onPress={() => handleMonthChange(-1)}>
            <Text className="text-white text-xl">{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMonthChange(1)}>
            <Text className="text-white text-xl">{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 커스텀 요일 헤더 */}
      <View className="flex-row justify-between mb-1 px-1">
        {weekDays.map((day, idx) => (
          <Text
            key={day}
            style={{
              color: weekDayColors[idx],
              width: cellWidth,
              textAlign: 'center',
            }}
          >
            {day}
          </Text>
        ))}
      </View>

      <View className="h-[1px] bg-[#ffffff] mt-2" />


      {/* 캘린더 본체 */}
      <View className="flex-1">
      <Calendar
        key={currentDate}
        current={currentDate}
        hideExtraDays
        hideDayNames
        renderArrow={() => null}
        disableArrowLeft
        disableArrowRight
        renderHeader={() => null}
        theme={{
          calendarBackground: '#121212',
          textDisabledColor: 'gray',
          textDayFontSize: 30,
          
        }}
        markedDates={{
          [currentDate]: {
            selected: true,
            selectedColor: 'blue',
          },
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
      </View>
    </View>
  )
}
