import moment from 'moment';
import 'moment/locale/ko';
import { FC } from 'react';
import { Modal, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

interface DatePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDaySelect: (day: DateData) => void;
  currentDate: Date;
}

const DatePickerModal: FC<DatePickerModalProps> = ({ isVisible, onClose, onDaySelect, currentDate }) => {
  const today = moment().format('YYYY-MM-DD');
  const currentDateStr = moment(currentDate).format('YYYY-MM-DD');

  return (
    <SafeAreaView>
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback>
            <View className="bg-[#33373B] rounded-t-2xl p-4 w-full align-center">
              <Calendar
                current={currentDateStr}
                maxDate={today}
                onDayPress={onDaySelect}
                style={{ width: '100%' }}
                theme={{
                  backgroundColor: '#33373B',
                  calendarBackground: '#33373B',
                  textSectionTitleColor: '#F7F7FE',
                  selectedDayTextColor: '#F7F7FE',
                  todayTextColor: '#00adf5',
                  dayTextColor: '#F7F7FE',
                  textDisabledColor: '#555',
                  arrowColor: 'white',
                  monthTextColor: 'white',
                  textDayFontWeight: '300',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
                renderHeader={(date) => (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 20,
                      fontWeight: '500',
                      textAlign: 'center',
                      marginVertical: 8,
                    }}
                  >
                    {moment(date).format('YYYY년 M월')}
                  </Text>
                )}
                dayComponent={({ date, state }) => {
                  if (!date) return null;
                  const day = date.day;
                  const dateString = date.dateString;
                  const dayOfWeek = new Date(dateString).getDay();
                  const isSelected = dateString === currentDateStr;
                  const isDisabled = state === 'disabled';

                  return (
                    <TouchableOpacity
                      disabled={isDisabled}
                      onPress={() => !isDisabled && onDaySelect(date)}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 20,
                          borderWidth: isSelected ? 2 : 0,
                          borderColor: isSelected ? '#F7F7FE' : 'transparent',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <Text
                          style={{
                            color: isDisabled
                              ? '#555'
                              : isSelected
                              ? '#F7F7FE'
                              : dayOfWeek === 0
                              ? '#E50000'
                              : dayOfWeek === 6
                              ? '#224CF1'
                              : '#F7F7FE',
                            fontWeight: isSelected ? 'bold' : 'normal',
                            fontSize: 16,
                          }}
                        >
          {day}
        </Text>
      </View>
    </TouchableOpacity>
  );
}}

              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    </SafeAreaView>
  );
};

export default DatePickerModal;