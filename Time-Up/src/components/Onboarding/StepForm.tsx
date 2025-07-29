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
      <Text className="font-pretendard font-medium text-[24px] leading-[32px] tracking-[-0.02em] text-white mb-[28px]">
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
