import { GOOGLE_PLACES_API_KEY } from '@env';
import axios from 'axios';
import { Platform } from 'react-native';
import { AddressItem } from '../types/address';

declare global {
  interface Window {
    google?: any;
  }
}

export const fetchAddress = async (input: string): Promise<AddressItem[]> => {
  if (!input.trim()) return [];

  if (Platform.OS === 'web') {
    if (typeof window === 'undefined' || !window.google?.maps?.places) {
      console.warn('Google Maps JS API is not loaded');
      return [];
    }

    return new Promise<AddressItem[]>((resolve, reject) => {
      const service = new window.google.maps.places.AutocompleteService();

      service.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: 'kr' },
          language: 'ko',
        },
        (predictions: any[], status: string) => {
          if ( 
            status !== window.google.maps.places.PlacesServiceStatus.OK ||
            !predictions ||
            predictions.length === 0
          ) {
            resolve([]);
            return;
          }

          const results = predictions.map((item) => ({
            id: item.place_id,
            address: item.description,
            region: item.structured_formatting?.main_text || item.description,
          }));

          resolve(results);
        }
      );
    });
  } else {
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
  }
};
