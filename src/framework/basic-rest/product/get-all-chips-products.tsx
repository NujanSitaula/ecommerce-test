import { QueryOptionsType, Product } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchChipsProducts = async ({ queryKey }: any) => {
  const { data } = await http.get(API_ENDPOINTS.CHIPS_PRODUCTS);
  return data as Product[];
};
export const useChipsProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_ENDPOINTS.CHIPS_PRODUCTS, options],
    queryFn: () => fetchChipsProducts(options),
  });
};
