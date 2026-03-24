'use client';

import { useMutation } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

interface ResendOtpInput {
  email?: string;
  mode?: 'signup' | 'email-change';
}

async function resendOtp(input: ResendOtpInput) {
  if (input.mode === 'email-change') {
    const { data } = await http.post(API_ENDPOINTS.PROFILE_EMAIL_RESEND_OTP);
    return data;
  }
  const { data } = await http.post(API_ENDPOINTS.RESEND_OTP, {
    email: input.email,
  });
  return data;
}

export const useResendOtpMutation = () => {
  return useMutation({
    mutationFn: (input: ResendOtpInput) => resendOtp(input),
  });
};


