import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface GuestAddress {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country_id: number;
  state_id?: number;
}

export interface GuestContact {
  phone: string;
}

export interface PlaceOrderInput {
  // Authenticated user fields (required if not guest)
  address_id?: number;
  contact_number_id?: number;
  payment_method_id?: number;
  // Guest fields (required if not authenticated)
  guest_email?: string;
  guest_address?: GuestAddress;
  guest_contact?: GuestContact;
  guest_payment_method_id?: string; // Stripe payment method ID
  // Common fields
  delivery_date: string;
  gift_wrapped: boolean;
  delivery_instructions?: string | null;
  leave_at_door?: boolean;
  coupon_code?: string | null;
  items: Array<{
    id: string | number;
    name: string;
    slug: string;
    quantity: number;
    price: number;
  }>;
}

export interface Order {
  id: number;
  user_id: number;
  address: {
    id: number;
    title: string;
    name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    postal_code: string;
    country?: string;
    state?: string;
  };
  contact_number: {
    id: number;
    title: string;
    phone: string;
  };
  payment_method: {
    id: number;
    brand: string;
    last4: string;
    cardholder_name?: string;
  };
  stripe_payment_intent_id?: string;
  delivery_date: string;
  gift_wrapped: boolean;
  delivery_instructions?: string | null;
  leave_at_door: boolean;
  subtotal: number;
  shipping_fee: number;
  discount_amount?: number;
  shipping_discount?: number;
  tax_amount?: number;
  tax_rate?: number;
  tax_type?: string;
  total: number;
  status: string;
  items: Array<{
    id: number;
    order_id: number;
    product_id?: number;
    product_name: string;
    product_slug: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  created_at: string;
  updated_at: string;
}

export const placeOrder = async (input: PlaceOrderInput): Promise<Order> => {
  const { data } = await http.post(API_ENDPOINTS.ORDERS_DYNAMIC, input);
  return data?.data ?? data;
};

export const usePlaceOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ORDERS_DYNAMIC],
      });
    },
  });
};

