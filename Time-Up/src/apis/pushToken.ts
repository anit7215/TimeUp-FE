// src/apis/pushToken.ts
import { axiosInstance } from '@/src/apis/axiosInstance';
import { getAccessToken } from '@/src/utils/storage';
import { SavePushTokenRequest, SavePushTokenResponse } from '../types/pushToken';

export async function saveFCMPushToken(token: string): Promise<SavePushTokenResponse> {
  if (!token) {
    throw new Error('Push token is empty.');
  }

  const accessToken = await getAccessToken();

  const res = await axiosInstance.post<SavePushTokenResponse>(
    '/alarm/push-token',
    { token } as SavePushTokenRequest,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return res.data;
}