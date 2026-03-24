import { QueryOptionsType, Product } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchCookiesProducts = async ({ queryKey }: any) => {
  const { data } = await http.get(API_ENDPOINTS.COOKIES_PRODUCTS);
  return data as Product[];
};
export const useCookiesProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_ENDPOINTS.COOKIES_PRODUCTS, options],
    queryFn: () => fetchCookiesProducts(options),
  });
};
