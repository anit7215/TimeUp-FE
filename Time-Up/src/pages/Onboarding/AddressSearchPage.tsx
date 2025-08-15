import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import SearchIcon from '../../../assets/images/SearchIcon.svg';
import { fetchAddress } from '../../apis/googleAddress';
import BeforeHeader from '../../components/common/BeforeHeader';
import AddressItemSkeleton from '../../components/skeleton/AddressItemSkeleton';
import { useProfileStore } from '../../stores/useProfileStore';
import { AddressItem } from '../../types/address';
import { RootStackParamList } from '../../types/navigation';

export default function AddressSearchPage() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'AddressSearchPage'>>();
  const { type, onSelectAddress } = route.params;
  const [hasSearched, setHasSearched] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<AddressItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setField = useProfileStore((state) => state.setField);
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setHasSearched(true);
    setLoading(true);
    setResults([]);
    try {
      const res = await fetchAddress(searchText);
      await sleep(1000); 
      setResults(res);
    } catch (error) {
      console.error(error);
      setResults([]); 
    } finally {
      setLoading(false); 
    }
  };

  const handleConfirm = () => {
    const selected = results.find((item) => item.id === selectedId);
    if (selected && onSelectAddress) {
      onSelectAddress(selected); 
      navigation.goBack();
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: AddressItem;
    index: number;
  }) => {
    const isSelected = item.id === selectedId;
    const isFirst = index === 0;
    const isLast = index === results.length - 1;

    const roundedStyle = isFirst
      ? 'rounded-t-[20px]'
      : isLast
      ? 'rounded-b-[20px]'
      : 'rounded-none';

    return (
      <TouchableOpacity onPress={() => setSelectedId(item.id)}>
        <View
          className={`${roundedStyle} px-4 py-3 ${
            isSelected ? 'bg-blue' : 'bg-gray-800'
          } border-b border-black`}
        >
          <Text className="text-slate-50 text-base font-normal leading-tight mb-1">
            {item.region}
          </Text>
          <Text className="text-gray-200 text-sm font-normal leading-tight">
            {item.address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-black px-4 pt-6">
      <BeforeHeader rightLabel="확인" onRightPress={handleConfirm} />
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white text-xl font-medium leading-7">
          주소 검색
        </Text>
        <TouchableOpacity 
          onPress={() => {
          setSelectedId(null);
          setSearchText('');
          setResults([]);
          setHasSearched(false); 
          if (type === 'home') {
            setField('homeAddress', null);
          } else if (type === 'work') {
            setField('workAddress', null);
          }
          navigation.goBack();
        }}>
          <Text className="text-gray-300 underline text-sm font-normal leading-tight">
            나중에 입력할게요.
          </Text>
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
      {loading && (
        <View>
          {[...Array(5)].map((_, idx) => (
            <AddressItemSkeleton key={idx} />
          ))}
        </View>
      )}
      {!loading && hasSearched && results.length === 0 && (
        <View className="flex-1 justify-center items-center mt-10 gap-2">
          <Text className="text-gray-400 text-xl">검색 결과가 없습니다</Text>
          <Text className="text-gray-600 text-base">정확한 주소를 입력해주세요</Text>
        </View>
      )}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}