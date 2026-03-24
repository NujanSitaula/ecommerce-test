import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';

export interface ForgetPasswordType {
  email: string;
}
async function forgetPassword() {
  return {
    ok: true,
    message: 'Forget password Successful!',
  };
}
export const useForgetPasswordMutation = () => {
  return useMutation({
    mutationFn: forgetPassword,
    onSuccess: (_data) => {
      Cookies.remove('auth_token');
    },
    onError: (data) => {
      console.log(data, 'forget password error response');
    },

    //     () => forgetPassword(), {
    //   onSuccess: (_data) => {
    //     Cookies.remove('auth_token');
    //   },
    //   onError: (data) => {
    //     console.log(data, 'forget password error response');
    //   },
    // }
  });
};
