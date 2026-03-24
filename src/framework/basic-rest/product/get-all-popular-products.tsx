import { QueryOptionsType, Product } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchPopularProducts = async ({ queryKey }: any) => {
  const { data } = await http.get(API_ENDPOINTS.POPULAR_PRODUCTS_DYNAMIC);

  const payload = Array.isArray((data as any)?.data)
    ? (data as any).data
    : Array.isArray(data)
    ? (data as any)
    : [];

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'debug-session',
      runId: 'popular-pre',
      hypothesisId: 'H1',
      location: 'get-all-popular-products.tsx:fetchPopularProducts',
      message: 'Raw popular response',
      data: {
        endpoint: API_ENDPOINTS.POPULAR_PRODUCTS_DYNAMIC,
        type: typeof data,
        isArray: Array.isArray(data),
        hasDataKey: Boolean((data as any)?.data),
        keys: data && typeof data === 'object' ? Object.keys(data) : null,
        sample:
          Array.isArray(payload) && payload.length
            ? {
                id: (payload as any)[0]?.id,
                name: (payload as any)[0]?.name,
                slug: (payload as any)[0]?.slug,
              }
            : null,
        snippet:
          typeof data === 'string'
            ? (data as string).slice(0, 200)
            : null,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const items = Array.isArray(payload) ? (payload as any[]) : [];
  return items as Product[];
};

export const usePopularProductsQuery = (options?: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_ENDPOINTS.POPULAR_PRODUCTS_DYNAMIC, options],
    queryFn: () => fetchPopularProducts(options),
  });
};
