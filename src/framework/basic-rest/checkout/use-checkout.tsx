import { useMutation } from '@tanstack/react-query';

export interface CheckoutInputType {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  save: boolean;
  note: string;
}
async function checkout(input: CheckoutInputType) {
  return input;
}
export const useCheckoutMutation = () => {
  return useMutation({
    mutationFn: (input: CheckoutInputType) => checkout(input),
    onSuccess: (data) => {
      console.log(data, 'Checkout success response');
    },
    onError: (data) => {
      console.log(data, 'Checkout error response');
    },
  });
};
