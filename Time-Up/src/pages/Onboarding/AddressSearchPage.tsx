import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SearchIcon from '../../../assets/images/SearchIcon.svg';
import BeforeHeader from '../../components/common/BeforeHeader';
import useAppNavigation from '../../hooks/useAppNavigation';

import { fetchAddress } from '../../apis/googleAddress';
import { AddressItem } from '../../types/address';

export default function AddressSearchPage() {
  const navigation = useAppNavigation();

  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<AddressItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    setLoading(true);
    const res = await fetchAddress(searchText);
    setResults(res);
    setLoading(false);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleConfirm = () => {
    const selected = results.find((item) => item.id === selectedId);
    if (selected) {
      console.log('선택된 주소:', selected);
      navigation.goBack();
    }
  };

  const renderItem = ({ item, index }: { item: AddressItem; index: number }) => {
    const isSelected = item.id === selectedId;
    const isFirst = index === 0;
    const isLast = index === results.length - 1;

    const roundedStyle = isFirst
      ? 'rounded-t-[20px]'
      : isLast
      ? 'rounded-b-[20px]'
      : 'rounded-none';

    return (
      <TouchableOpacity onPress={() => handleSelect(item.id)}>
        <View
          className={`${roundedStyle} px-4 py-3 ${
            isSelected ? 'bg-blue' : 'bg-gray-800'
          } border-b border-black`}
        >
          <Text className="text-slate-50 text-base font-normal leading-tight mb-1">{item.region}</Text>
          <Text className="text-gray-200 text-sm font-normal leading-tight">{item.address}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-black px-4 pt-6">
      <BeforeHeader rightLabel="확인" onRightPress={handleConfirm} />

      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white text-xl font-medium leading-7">주소 검색</Text>
        <TouchableOpacity>
          <Text className="text-gray-300 underline text-sm font-normal leading-tight">나중에 입력할게요.</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center border border-gray-300 rounded-[20px] px-4 py-3 mb-3">
        <TextInput
          className="flex-1 text-white text-base font-normal leading-tight"
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

      {loading && <Text className="text-white text-center mb-3">검색 중...</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
