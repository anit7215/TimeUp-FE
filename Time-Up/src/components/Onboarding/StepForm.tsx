import React from 'react';
import { Text } from 'react-native';
import Dropdown from '../common/DropDown';

interface SelectOption {
  label: string;
  value: string;
}

interface StepFormProps {
  value: string | null;
  onChange: (val: string) => void;
  options: SelectOption[];
  text: string;
  placeholder: string;
}

export default function StepForm({ value, onChange, options, text, placeholder }: StepFormProps) {
  return (
    <>
      <Text className="font-pretendard font-medium text-2xl leading-loose text-white mb-8">
        {text}
      </Text>
      <Dropdown
        data={options}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </>
  );
}
