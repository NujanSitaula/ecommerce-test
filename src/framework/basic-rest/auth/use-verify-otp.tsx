'use client';

import { useUI } from '@contexts/ui.context';
import { useModalAction } from '@components/common/modal/modal.context';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQueryClient } from '@tanstack/react-query';

interface VerifyOtpInput {
  code: string;
  email?: string;
  mode?: 'signup' | 'email-change';
}

async function verifyOtp(input: VerifyOtpInput) {
  if (input.mode === 'email-change') {
    const { data } = await http.post(API_ENDPOINTS.PROFILE_EMAIL_VERIFY_OTP, {
      code: input.code,
    });
    return data;
  }
  const { data } = await http.post(API_ENDPOINTS.VERIFY_OTP, {
    email: input.email,
    code: input.code,
  });
  return data;
}

export const useVerifyOtpMutation = () => {
  const { authorize } = useUI();
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VerifyOtpInput) => verifyOtp(input),
    onSuccess: (data, variables) => {
      if (variables.mode === 'email-change') {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PROFILE] });
        closeModal();
        return;
      }
      const token = data?.token ?? data?.access_token;
      if (!token) return;
      Cookies.set('auth_token', token);
      authorize();
      closeModal();
    },
  });
};


