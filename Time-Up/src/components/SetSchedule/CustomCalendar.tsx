import moment from 'moment';
import 'moment/locale/ko'; // 한국어 로케일 설정
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface CustomCalendarProps {
   initialDate?: string;
   onSelectDate: (date: string) => void;
}

export default function CustomCalendar({
    initialDate,
    onSelectDate}: CustomCalendarProps
) {
    const [currentDate, setCurrentDate] = useState(initialDate || moment().format('YYYY-MM-DD'))
  
    return ( 
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
                              setCurrentDate(dateString)
                              onSelectDate(dateString);
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
  )
}
