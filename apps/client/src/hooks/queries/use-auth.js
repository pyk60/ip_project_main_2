import { useMutation } from '@tanstack/react-query';
import { unauthClient } from '../../clients/base';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useSignUp = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (data) => {
      await unauthClient.post('/register', data);
    },
    onSuccess: () => {
      toast.success('Register new account successfully');
      navigate('/login');
    }
  });
};
