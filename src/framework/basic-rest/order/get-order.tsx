import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';
import { Order } from './use-place-order';

export const fetchOrder = async (id: number): Promise<Order> => {
  const { data } = await http.get(API_ENDPOINTS.ORDER_DYNAMIC(id));
  return data?.data ?? data;
};

export const useOrderQuery = (id: number) => {
  return useQuery<Order>({
    queryKey: [API_ENDPOINTS.ORDERS_DYNAMIC, id],
    queryFn: () => fetchOrder(id),
    enabled: !!id,
  });
};

