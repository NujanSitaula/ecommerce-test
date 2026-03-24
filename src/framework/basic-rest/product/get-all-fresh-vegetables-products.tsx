import { QueryOptionsType, Product } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchFreshVegetablesProducts = async ({ queryKey }: any) => {
  const { data } = await http.get(API_ENDPOINTS.FRESH_VEGETABLES_PRODUCTS);
  return data as Product[];
};
export const useFreshVegetablesProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_ENDPOINTS.FRESH_VEGETABLES_PRODUCTS, options],
    queryFn: () => fetchFreshVegetablesProducts(options),
  });
};
