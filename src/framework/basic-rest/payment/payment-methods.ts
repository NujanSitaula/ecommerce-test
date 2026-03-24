import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface PaymentMethod {
  id: number;
  brand?: string | null;
  last4?: string | null;
  cardholder_name?: string | null;
  exp_month?: number | null;
  exp_year?: number | null;
  is_default: boolean;
}

export const fetchPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const { data } = await http.get(API_ENDPOINTS.PAYMENT_METHODS);
  return data?.data ?? data ?? [];
};

export const usePaymentMethodsQuery = () => {
  return useQuery<PaymentMethod[]>({
    queryKey: [API_ENDPOINTS.PAYMENT_METHODS],
    queryFn: fetchPaymentMethods,
  });
};

export const createSetupIntent = async () => {
  const { data } = await http.post(API_ENDPOINTS.PAYMENT_METHODS_SETUP_INTENT);
  return data;
};

export const useCreateSetupIntentMutation = () => {
  return useMutation({
    mutationFn: createSetupIntent,
  });
};

export const confirmPaymentMethod = async (input: {
  payment_method_id: string;
  make_default?: boolean;
}) => {
  const { data } = await http.post(API_ENDPOINTS.PAYMENT_METHODS_CONFIRM, input);
  return data?.data ?? data;
};

export const useConfirmPaymentMethodMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PAYMENT_METHODS],
      });
    },
  });
};

export const deletePaymentMethod = async (id: number) => {
  const { data } = await http.delete(`${API_ENDPOINTS.PAYMENT_METHODS}/${id}`);
  return data;
};

export const useDeletePaymentMethodMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PAYMENT_METHODS],
      });
    },
  });
};


