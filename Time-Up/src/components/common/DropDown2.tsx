import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

interface DropdownItem {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  data: DropdownItem[];
  placeholder?: string;
  value: string | null;
  onChange: (value: string) => void;
}

export default function CustomDropdown({
  data,
  placeholder = '선택하세요',
  value,
  onChange,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = data.find((d) => d.value === value)?.label;

  return (
    <View style={styles.container}>
      {/* Trigger Button */}
      <Pressable
        style={styles.dropdown}
        onPress={() => setOpen((prev) => !prev)}
      >
        <Text style={value ? styles.selectedText : styles.placeholderText}>
          {selectedLabel || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#979B9F" />
      </Pressable>

      {/* Dropdown List */}
      {open && (
        <View style={styles.dropdownList}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => {
              const isSelected = item.value === value;
              return (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.item,
                    (pressed || isSelected) && styles.selectedItem,
                  ]}
                >
                  <Text
                    style={[
                      styles.itemText,
                      isSelected && styles.selectedItemText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#979B9F',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#121212',
    width: '100%',
  },
  placeholderText: {
    fontSize: 16,
    color: '#979B9F',
    fontFamily: 'Pretendard',
  },
  selectedText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Pretendard',
  },
  dropdownList: {
    backgroundColor: '#33373B',
    borderRadius: 20,
    paddingVertical: 8,
    maxHeight: 300,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  selectedItem: {
    backgroundColor: '#4D4DFF',
  },
  itemText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Pretendard',
  },
  selectedItemText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
