import { Attachment, QueryOptionsType, Product } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchRelatedProducts = async ({ queryKey }: any) => {
  const [_key, productSlug, options] = queryKey as [
    string,
    string,
    QueryOptionsType | undefined,
  ];

  const { data } = await http.get(API_ENDPOINTS.RELATED_PRODUCTS_DYNAMIC(productSlug), {
    params: { limit: options?.limit ?? 12 },
  });

  const payload = (data as any)?.data ?? data;
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
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      image: resolvedImage,
      gallery,
      tag: (item as any).tag ?? (item as any).tags ?? [],
      category: (item as any).category ?? (item as any).categories?.[0],
      quantity: item.quantity ?? 0,
      price: item.price,
      sale_price: item.sale_price,
      unit: item.unit,
    } as Product;
  };

  return items.map(mapBackendProductToFrontendProduct);
};
export const useRelatedProductsQuery = (productSlug: string, options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey: [API_ENDPOINTS.RELATED_PRODUCTS_DYNAMIC(productSlug), productSlug, options],
    queryFn: fetchRelatedProducts,
    enabled: Boolean(productSlug),
  });
};
