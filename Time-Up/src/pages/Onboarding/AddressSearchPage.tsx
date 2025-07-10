import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SearchIcon from '../../../assets/images/SearchIcon.svg';
import BeforeButton from '../../components/Onboarding/BeforeButton';
import NextButton from '../../components/Onboarding/NextButton';
import useAppNavigation from '../../hooks/useAppNavigation';

export default function AddressSearchPage() {
  const navigation = useAppNavigation();
  const mockResults = [
    { id: 1, region: '서대문구 신촌동', address: '서울특별시' },
    { id: 2, region: '마포구 신촌', address: '서울특별시' },
    { id: 3, region: '서대문구 신촌역로', address: '서울특별시' },
    { id: 4, region: '서대문구 신촌로1길', address: '서울특별시' },
    { id: 5, region: '서대문구 신촌로3가길', address: '서울특별시' },
    { id: 6, region: '마포구 신촌로 14길', address: '서울특별시' },
  ];

  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const handleSearch = () => {
    const filtered =
      searchText.trim() === ''
        ? mockResults
        : mockResults.filter((item) => item.region.includes(searchText));
    setResults(filtered);
  };

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleConfirm = () => {
    const selected = results.find((item) => item.id === selectedId);
    if (selected) {
      console.log('선택된 주소:', selected);
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isSelected = item.id === selectedId;
    const isFirst = index === 0;
    const isLast = index === results.length - 1;

    const roundedStyle = isFirst
      ? 'rounded-t-xl'
      : isLast
      ? 'rounded-b-xl'
      : 'rounded-none';

      return (
        <TouchableOpacity
          onPress={() => handleSelect(item.id)}
        >
          <View
            className={`${roundedStyle} px-4 py-3 ${
              isSelected ? 'bg-blue' : 'bg-gray-700'
            }`}
          >
            <Text className="text-white font-medium text-[16px]">
              {item.region}
            </Text>
            <Text className="text-white text-[14px]">{item.address}</Text>
          </View>
        </TouchableOpacity>
      );
    };

  return (
    <View className="flex-1 bg-black px-4 pt-[88px]">
      <Text className="font-pretendard font-medium text-[20px] leading-[28px] tracking-[-0.02em] text-white mb-6">주소 검색</Text>

      <View className="w-full h-12 px-4 border border-gray rounded-[20px] flex-row items-center mt-4 mb-3">
        <TextInput
          className="flex-1 text-white"
          placeholder="주소 검색"
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <SearchIcon width={20} height={20} />
        </TouchableOpacity>
      </View>

      {results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
      )}

      <View className="absolute bottom-6 left-4 right-4 flex-row justify-between">
        <BeforeButton onPress={()=>navigation.goBack()}/>
        <NextButton
          onPress={handleConfirm}
          disabled={!selectedId}/>
      </View>
    </View>
  );
}
