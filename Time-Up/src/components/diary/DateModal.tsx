import moment from 'moment';
import 'moment/locale/ko';
import { FC } from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

interface DatePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDaySelect: (day: DateData) => void;
  currentDate: Date;
}

const DatePickerModal: FC<DatePickerModalProps> = ({ isVisible, onClose, onDaySelect, currentDate,}) => {
  const today = moment().format('YYYY-MM-DD');

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback>
            <View className="bg-[#333] rounded-t-2xl p-4">
              <Calendar
                current={moment(currentDate).format('YYYY-MM-DD')}
                maxDate={today}
                onDayPress={onDaySelect}
                theme={{
                  backgroundColor: '#333',
                  calendarBackground: '#333',
                  textSectionTitleColor: '#b6c1cd',
                  selectedDayBackgroundColor: '#007AFF',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#00adf5',
                  dayTextColor: '#d9e1e8',
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
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DatePickerModal;