import { useMutation } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

export interface ChangePasswordInputType {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
async function changePassword(input: ChangePasswordInputType) {
  const { data } = await http.put(API_ENDPOINTS.PROFILE_PASSWORD, {
    current_password: input.currentPassword,
    password: input.newPassword,
    password_confirmation: input.confirmNewPassword,
  });
  return data?.data ?? data;
}
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (input: ChangePasswordInputType) => changePassword(input),
    onSuccess: (data) => {
      console.log(data, 'ChangePassword success response');
    },
    onError: (data) => {
      console.log(data, 'ChangePassword error response');
    },
  });
};
