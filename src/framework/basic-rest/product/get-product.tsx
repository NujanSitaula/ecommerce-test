import { Attachment, Product } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

const mapBackendProductToFrontendProduct = (item: any): Product => {
  if (!item) return item;

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

  const rawGallery: Attachment[] = Array.isArray(item.gallery)
    ? item.gallery.map((g: any, index: number) => {
        if (typeof g === 'string') {
          return {
            id: `${item.id}-g-${index}`,
            original: g,
            thumbnail: g,
          };
        }
        const original =
          g.original_url ?? g.original ?? g.url ?? '';
        const thumbnail =
          g.thumbnail_url ?? g.thumbnail ?? g.original_url ?? g.url ?? '';
        return {
          id: g.id ?? `${item.id}-g-${index}`,
          original,
          thumbnail,
        };
      })
    : [];

  const gallery: Attachment[] = rawGallery.filter(
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

async function fetchFromDynamicApi(slug: string) {
  if (!slug) return null;
  try {
    const { data } = await http.get(`${API_ENDPOINTS.PRODUCTS_DYNAMIC}/${slug}`);
    const payload = (data as any)?.data ?? data;
    return mapBackendProductToFrontendProduct(payload);
  } catch {
    return null;
  }
}

async function fetchFromStaticJson(slug: string) {
  // Static JSON fallback is not used in this deployment.
  // Keep the function for compatibility but always return null to avoid
  // trying to fetch demo JSON files on the server (which can cause Invalid URL errors).
  return null;
}

export const fetchProduct = async (slug: string) => {
  // Try backend dynamic route first, then (optionally) fall back to demo JSON.
  const fromApi = await fetchFromDynamicApi(slug);
  if (fromApi) return fromApi;
  const fromStatic = await fetchFromStaticJson(slug);
  return fromStatic;
};

export const useProductQuery = (slug: string) => {
  return useQuery<Product, Error>({
    queryKey: [API_ENDPOINTS.PRODUCT, slug],
    queryFn: () => fetchProduct(slug),
    enabled: Boolean(slug),
  });
};
