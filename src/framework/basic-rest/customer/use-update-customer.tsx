import { useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

export interface UpdateUserType {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface UpdateProfileResponse {
  message?: string;
  requires_email_verification?: boolean;
  pending_email?: string | null;
  data?: any;
}

export interface VerifyEmailChangeOtpInput {
  code: string;
}

export interface ResendEmailChangeOtpInput {
  email?: string;
}

async function updateUser(input: UpdateUserType): Promise<UpdateProfileResponse> {
  const name = [input.firstName, input.lastName].filter(Boolean).join(' ').trim();
  const payload = {
    name,
    phone: input.phoneNumber,
    email: input.email,
  };
  const { data } = await http.put(API_ENDPOINTS.PROFILE, payload);
  return data?.data ? data : data;
}

async function verifyEmailChangeOtp(input: VerifyEmailChangeOtpInput) {
  const { data } = await http.post(API_ENDPOINTS.PROFILE_EMAIL_VERIFY_OTP, input);
  return data;
}

async function resendEmailChangeOtp(_input: ResendEmailChangeOtpInput = {}) {
  const { data } = await http.post(API_ENDPOINTS.PROFILE_EMAIL_RESEND_OTP);
  return data;
}

async function cancelEmailChange() {
  const { data } = await http.post(API_ENDPOINTS.PROFILE_EMAIL_CANCEL);
  return data;
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserType) => updateUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PROFILE] });
    },
  });
};

export const useVerifyEmailChangeOtpMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VerifyEmailChangeOtpInput) => verifyEmailChangeOtp(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PROFILE] });
    },
  });
};

export const useResendEmailChangeOtpMutation = () => {
  return useMutation({
    mutationFn: (input: ResendEmailChangeOtpInput) => resendEmailChangeOtp(input),
  });
};

export const useCancelEmailChangeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelEmailChange(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PROFILE] });
    },
  });
};
