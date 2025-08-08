import { getUserInfo } from '@/src/apis/users';
import { useQuery } from '@tanstack/react-query';

export const useGetUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  });
};
