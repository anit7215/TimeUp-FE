import axios from 'axios';
import { GOOGLE_PLACES_API_KEY } from '@env';
import { AddressItem } from '../types/address';

export const fetchAddress = async (input: string): Promise<AddressItem[]> => {
  if (!input.trim()) return [];

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input,
          language: 'ko',
          components: 'country:kr',
          key: GOOGLE_PLACES_API_KEY,
        },
      }
    );

    if (response.data.status === 'OK') {
      return response.data.predictions.map((item: any) => ({
        id: item.place_id,
        region: item.structured_formatting.main_text,
        address: item.description,
      }));
    } else {
      console.error('Google API Error:', response.data.status);
      return [];
    }
  } catch (error) {
    console.error('API 요청 실패:', error);
    return [];
  }
};
