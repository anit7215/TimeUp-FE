import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteDiary, getDiaryDetail, getDiaryList, postDiary, updateDiary } from '../apis/diary';

export const useGetDiaryList = () => {
  return useQuery({
    queryKey: ['diaries'],
    queryFn: getDiaryList,
  });
};

export const useGetDiaryDetail = (diary_id?: number) => {
  return useQuery({
    queryKey: ['diaries', diary_id],
    queryFn: () => getDiaryDetail(diary_id!),
    enabled: !!diary_id,
  });
};

export const usePostDiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDiary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaries'] });
    },
  });
};

export const useUpdateDiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ diary_id, payload }: { diary_id: number; payload: any }) =>
      updateDiary(diary_id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['diaries'] });
      queryClient.invalidateQueries({ queryKey: ['diaries', variables.diary_id] });
    },
  });
};

export const useDeleteDiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDiary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaries'] });
    },
  });
};