import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

const fetchPayment = async () => {
  const { data } = await http.get(API_ENDPOINTS.PAYMENT);
  return {
    data: data,
  };
};

const usePaymentQuery = () => {
  return useQuery({
    queryKey: [API_ENDPOINTS.PAYMENT],
    queryFn: fetchPayment,
  });
};

export { usePaymentQuery, fetchPayment };
