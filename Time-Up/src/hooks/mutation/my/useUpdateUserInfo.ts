import { putUserInfo } from '@/src/apis/users';
import { useMutation } from '@tanstack/react-query';

export const useUpdateUserInfo = () => {
  return useMutation({
    mutationFn: putUserInfo,
  });
};
