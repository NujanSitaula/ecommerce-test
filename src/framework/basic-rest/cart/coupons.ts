import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useMutation } from '@tanstack/react-query';

export interface CouponPreview {
  code: string;
  type: 'free_shipping' | 'percent' | 'flat';
  value: number;
  discount_amount: number;
  shipping_discount: number;
}

export const applyCoupon = async (input: {
  code: string;
  cart_total: number;
}): Promise<CouponPreview> => {
  const { data } = await http.post(API_ENDPOINTS.COUPON_APPLY, input);
  return data;
};

export const useApplyCouponMutation = () => {
  return useMutation({
    mutationFn: applyCoupon,
  });
};


