import { Attachment, QueryOptionsType, Product } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import http from '@framework/utils/http';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

type PaginatedProduct = {
  data: Product[];
  paginatorInfo: any;
};

const mapBackendProductToFrontendProduct = (item: any): Product => {
  const image: Attachment = {
    id: item.id,
    original:
      item.original_url ??
      item.thumbnail_url ??
      item.image_url ??
      (typeof item.image === 'string' ? item.image : undefined) ??
      item.image?.original ??
      item.image?.url ??
      '',
    thumbnail:
      item.thumbnail_url ??
      item.original_url ??
      item.image_url ??
      (typeof item.image === 'string' ? item.image : undefined) ??
      item.image?.thumbnail ??
      item.original_url ??
      item.image?.url ??
      '',
  };

  const gallery: Attachment[] = Array.isArray(item.gallery)
    ? item.gallery.map((g: any, index: number) => {
        if (typeof g === 'string') {
          return {
            id: `${item.id}-g-${index}`,
            original: g,
            thumbnail: g,
          };
        }
        return {
          id: g.id ?? `${item.id}-g-${index}`,
          original: g.original_url ?? g.original ?? g.url ?? '',
          thumbnail:
            g.thumbnail_url ?? g.thumbnail ?? g.original_url ?? g.url ?? '',
        };
      })
    : [];
  const resolvedImage: Attachment = {
    id: item.id,
    original: image.original || gallery[0]?.original || '',
    thumbnail:
      image.thumbnail ||
      gallery[0]?.thumbnail ||
      gallery[0]?.original ||
      image.original ||
      '',
  };

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: resolvedImage,
    gallery,
    quantity: item.quantity ?? 0,
    price: item.price,
    sale_price: item.sale_price,
    unit: item.unit,
    tag: item.tag ?? item.tags ?? [],
    category: item.category ?? item.categories?.[0] ?? undefined,
  } as Product;
};

export const fetchDynamicProducts = async ({ queryKey, pageParam }: any) => {
  const [, options] = queryKey;
  const params: any = {};

  if (options?.search) params.search = options.search;
  if (options?.type) params.type = options.type;
  if (options?.category) {
    // Be liberal in what we send: different backends expect different keys
    // - category: might be slug or id
    // - category_slug / categorySlug: common slug keys
    // - categories: common multi-select key (comma-separated)
    const category = options.category;
    params.category = category;
    params.category_slug = category;
    params.categorySlug = category;
    params.categories = category;
  }
  if (options?.category_id) {
    const categoryId = options.category_id;
    params.category_id = categoryId;
    params.categoryId = categoryId;
    params.categories_ids = categoryId;
    params.categoriesIds = categoryId;
  }
  if (options?.sort) params.sort = options.sort;
  if (options?.order) params.order = options.order;
  if (options?.min_price !== undefined && options?.min_price !== '') {
    params.min_price = options.min_price;
  }
  if (options?.max_price !== undefined && options?.max_price !== '') {
    params.max_price = options.max_price;
  }

  // Pagination params
  if (pageParam) params.page = pageParam;
  if (options?.pageSize) params.pageSize = options.pageSize;

  const { data } = await http.get(API_ENDPOINTS.PRODUCTS_DYNAMIC, { params });

  const items = Array.isArray(data?.data)
    ? (data.data as any[])
    : Array.isArray(data)
    ? (data as any[])
    : [];

  const meta = data?.meta || {};
  const links = data?.links || {};

  return {
    data: items.map(mapBackendProductToFrontendProduct),
    paginatorInfo: {
      nextPageUrl: links?.next ?? data?.next_page_url ?? null,
      currentPage: meta?.current_page ?? data?.current_page ?? 1,
      lastPage: meta?.last_page ?? data?.last_page ?? 1,
      total: meta?.total ?? data?.total ?? items.length,
    },
  };
};

export const useDynamicProductsQuery = (options: QueryOptionsType) => {
  return useInfiniteQuery<PaginatedProduct, Error>({
    queryKey: [API_ENDPOINTS.PRODUCTS_DYNAMIC, options],
    queryFn: ({ queryKey, pageParam }) =>
      fetchDynamicProducts({ queryKey, pageParam }),
    initialPageParam: 1,
    getNextPageParam: ({ paginatorInfo }) => {
      const nextPage = (paginatorInfo?.currentPage ?? 1) + 1;
      if (nextPage <= (paginatorInfo?.lastPage ?? 1)) {
        return nextPage;
      }
      return undefined;
    },
  });
};

export const useDynamicPopularProductsQuery = (options?: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_ENDPOINTS.POPULAR_PRODUCTS_DYNAMIC, options],
    queryFn: async () => {
      const { data } = await http.get(API_ENDPOINTS.POPULAR_PRODUCTS_DYNAMIC);
      const items = Array.isArray(data) ? (data as any[]) : [];
      return items.map(mapBackendProductToFrontendProduct);
    },
  });
};




