import { QueryOptionsType, Product } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchSearchedProducts = async ({ queryKey }: any) => {
  const options = queryKey[1];
  const text = options?.text?.trim();
  if (!text) return [];

  const params = {
    search: text,
    pageSize: options?.limit ?? 5,
  };

  const { data } = await http.get(API_ENDPOINTS.PRODUCTS_DYNAMIC, { params });

  const items = Array.isArray(data?.data)
    ? (data.data as any[])
    : Array.isArray(data)
    ? (data as any[])
    : [];

  return items as Product[];
};

export const useSearchQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_ENDPOINTS.SEARCH, options],
    queryFn: fetchSearchedProducts,
    enabled: Boolean(options?.text?.trim()),
  });
};
