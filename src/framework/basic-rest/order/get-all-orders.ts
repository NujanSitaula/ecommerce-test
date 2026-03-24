import { QueryOptionsType, Order } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';
import { Order as BackendOrder } from './use-place-order';

const fetchOrders = async () => {
  const { data } = await http.get(API_ENDPOINTS.ORDERS_DYNAMIC);
  return {
    data: data?.data ?? data ?? [],
  };
};

const useOrdersQuery = (options: QueryOptionsType) => {
  return useQuery<{ data: BackendOrder[] }>({
    queryKey: [API_ENDPOINTS.ORDERS_DYNAMIC, options],
    queryFn: fetchOrders,
  });
};

export { useOrdersQuery, fetchOrders };
