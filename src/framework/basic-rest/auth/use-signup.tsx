import { useUI } from '@contexts/ui.context';
import { useMutation } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

export interface SignUpInputType {
  email: string;
  password: string;
  name: string;
  remember_me: boolean;
}
async function signUp(input: SignUpInputType) {
  const payload = {
    name: input.name,
    email: input.email,
    password: input.password,
    password_confirmation: input.password,
  };

  const { data } = await http.post(API_ENDPOINTS.REGISTER, payload);
  return data;
}
export const useSignUpMutation = () => {
  const { closeModal } = useUI();
  return useMutation({
    mutationFn: (input: SignUpInputType) => signUp(input),
    onError: (data) => {
      console.log(data, 'login error response');
    },
  });
};
