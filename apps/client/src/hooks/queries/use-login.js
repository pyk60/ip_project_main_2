import { useMutation } from '@tanstack/react-query';
import { unauthClient } from '../../clients/base';
import { toast } from 'sonner';

export const useLogin = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (data) => {
      const response = await unauthClient.post('/auth/login', data); // 로그인 요청
      return response.data; // 응답 데이터 반환
    },
    onSuccess: (data) => {
      toast.success('로그인 성공!');
      localStorage.setItem('authToken', data.accessToken); // JWT 토큰 저장
    },
    onError: (error) => {
      // error.response가 없을 경우 기본 메시지 설정
      const message =
        error?.response?.data?.message || '로그인 실패. 다시 시도하세요.';
      toast.error(message);
    },
  });
};
