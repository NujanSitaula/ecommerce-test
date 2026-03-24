import { Attachment, QueryOptionsType, Product } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const fetchWishlistProducts = async () => {
  const { data } = await http.get(API_ENDPOINTS.WISHLIST);
  const payload = data?.data ?? data;
  const items = Array.isArray(payload) ? payload : [];

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
        item.image?.url ??
        '',
    };

    const rawGallery: Attachment[] = Array.isArray(item.gallery)
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

    const gallery = rawGallery.filter(
      (g) => typeof g.original === 'string' && g.original.trim().length > 0,
    );
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
      ...(item as Product),
      image: resolvedImage,
      gallery,
      tag: (item as any).tag ?? (item as any).tags ?? [],
      category: (item as any).category ?? (item as any).categories?.[0],
    };
  };

  return items.map(mapBackendProductToFrontendProduct);
};

export const fetchWishlistIds = async () => {
  const { data } = await http.get(API_ENDPOINTS.WISHLIST_IDS);
  return data?.data ?? [];
};

export const useWishlistProductsQuery = (
  options: QueryOptionsType,
  enabled = true,
) => {
  return useQuery<Product[], Error>({
    queryKey: [API_ENDPOINTS.WISHLIST, options],
    queryFn: fetchWishlistProducts,
    enabled,
  });
};

export const useWishlistIdsQuery = (enabled = true) => {
  return useQuery<string[], Error>({
    queryKey: [API_ENDPOINTS.WISHLIST_IDS],
    queryFn: fetchWishlistIds,
    enabled,
  });
};

const addWishlistProduct = async (productId: string | number) => {
  const { data } = await http.post(API_ENDPOINTS.WISHLIST, {
    product_id: Number(productId),
  });
  return data?.data ?? data;
};

const removeWishlistProduct = async (productId: string | number) => {
  const { data } = await http.delete(`${API_ENDPOINTS.WISHLIST}/${productId}`);
  return data?.data ?? data;
};

export const useAddWishlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string | number) => addWishlistProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.WISHLIST] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.WISHLIST_IDS] });
    },
  });
};

export const useRemoveWishlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string | number) =>
      removeWishlistProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.WISHLIST] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.WISHLIST_IDS] });
    },
  });
};
