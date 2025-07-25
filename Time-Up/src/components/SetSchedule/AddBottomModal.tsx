import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const AddBottomModal = () => {

  return (
      <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: '#33363B' }} // 배경색 설정
          enableContentPanningGesture={false}
          enableHandlePanningGesture={true}
          keyboardBehavior="interactive"
        > 
        <BottomSheetView style={{ flex: 1, padding: 16}}>
            {selectedItem === '일정 이름' && (
              <View>
                <TextInput
                  className="w-full h-[50px] border-[#65696D] border-[1px] p-4 rounded-[16px] text-white"
                  placeholder='일정 이름 입력'
                  placeholderTextColor={"#979B9F"}
                  value={schedule.title || ''}
                  onChangeText={(text) => {
                    setSchedule({ ...schedule, title: text })
                    console.log('일정 이름:', text) // 입력된 일정 이름 확인
                  }}
                />
              </View>
            )}

            {selectedItem === '색상' && (
              <View className="flex-row flex-wrap w-full justify-center">
                {colorOptions.map((color, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setSchedule({ ...schedule, color }) // 선택한 색상을 schedule에 저장
                            console.log('선택한 색상:', color) // 선택한 색상 확인
                          }}
                          className={`
                            w-1/4 p-[20px] items-center justify-center
                          `}
                        >
                          <View
                            className={`w-[60px] h-[60px] rounded-full ${
                              schedule.color === color ? 'border-2 border-white' : 'border-0'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>

            )}

            {(selectedItem === '메모') && (
              <View>
                <TextInput className="w-full h-[250px] border-[#65696D] border-[1px] p-4 rounded-[16px] text-white"
                placeholder='내용 입력'
                placeholderTextColor={"#979B9F"}
                multiline={true}
                textAlignVertical='top'
                value={schedule.memo}
                onChangeText={(text) => setSchedule({ ...schedule, memo: text })}
                >
                  
                </TextInput>
              </View>
            )}
            {(selectedItem === '시작 날짜' || selectedItem === '종료 날짜') && (
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

              </View>
            )}
            {(selectedItem === '시작 시간' || selectedItem === '종료 시간') && (
              <View className="items-center justify-center">
                <HalfTimeScrollPanel />
              </View>
            )}

            <View className="flex-row justify-between mt-6 px-10 py-8">
              <TouchableOpacity
                onPress={() => {
                  console.log('취소')
                  bottomSheetModalRef.current?.dismiss() // 모달 닫기
                  setSelectedItem(null) // 선택된 아이템 초기화
                }
                }
                className="w-[48%] bg-transparent py-3 rounded-lg items-center "
              >
                <Text className="text-white text-base text-[18px]">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log('선택')
                  bottomSheetModalRef.current?.dismiss();
                }
              }
                className="w-[48%] bg-transparent py-3 rounded-lg items-center"
              >
                <Text className="text-white text-base text-[18px]">선택</Text>
                {/* 선택 버튼 누르면 저장되고 모달 자동으로 닫히는 로직 추후 추가 */}
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
  )
}

export default AddBottomModal
