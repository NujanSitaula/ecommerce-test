import { useUI } from '@contexts/ui.context';
import { useModalAction } from '@components/common/modal/modal.context';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

export interface LoginInputType {
  email: string;
  password: string;
  remember_me: boolean;
}
async function login(input: LoginInputType) {
  const { data } = await http.post(API_ENDPOINTS.LOGIN, input);
  return data;
}
export const useLoginMutation = () => {
  const { authorize } = useUI();
  const { closeModal } = useModalAction();
  return useMutation({
    mutationFn: (input: LoginInputType) => login(input),
    onSuccess: (data) => {
      const token = data?.token ?? data?.access_token;
      if (token) {
        Cookies.set('auth_token', token);
        authorize();
        closeModal();
      }
    },
    onError: (data) => {
      console.log(data, 'login error response');
    },
  });
};
