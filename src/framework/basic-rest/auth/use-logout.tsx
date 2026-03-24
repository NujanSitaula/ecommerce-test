import { useUI } from '@contexts/ui.context';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

export interface LoginInputType {
  email: string;
  password: string;
  remember_me: boolean;
}
async function logout() {
  const { data } = await http.post(API_ENDPOINTS.LOGOUT);
  return data;
}
export const useLogoutMutation = (lang: string) => {
  const { unauthorize } = useUI();
  const router = useRouter();
  return useMutation({
    mutationFn: logout,
    onSuccess: (_data) => {
      Cookies.remove('auth_token');
      unauthorize();
      router.push(`/${lang}`);
    },
    onError: (data) => {
      console.log(data, 'logout error response');
    },
  });
};
