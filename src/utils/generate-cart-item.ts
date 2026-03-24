import isEmpty from 'lodash/isEmpty';
interface Item {
  id: string | number;
  name?: string;
  title?: string;
  product_name?: string;
  productName?: string;
  slug?: string;
  image?: {
    thumbnail?: string;
    [key: string]: unknown;
  };
  thumbnail_url?: string;
  original_url?: string;
  gallery?: Array<{
    thumbnail?: string;
    original?: string;
    [key: string]: unknown;
  }>;
  price?: number;
  sale_price?: number;
  quantity?: number;
  [key: string]: unknown;
}
interface Variation {
  id: string | number;
  title: string;
  price: number;
  sale_price?: number;
  quantity: number;
  [key: string]: unknown;
}
export function generateCartItem(item: Item, variation: Variation, personalizations?: Record<string, any>) {
  const {
    id,
    name,
    title,
    product_name,
    productName,
    slug,
    image,
    price,
    sale_price,
    quantity,
    unit,
  } = item;
  const resolvedName =
    name || title || product_name || productName || slug || 'Unknown item';
  const resolvedSlug = slug || '';
  const resolvedImage =
    image?.thumbnail ||
    item.thumbnail_url ||
    item.original_url ||
    (Array.isArray(item.gallery) && item.gallery[0]?.thumbnail) ||
    (Array.isArray(item.gallery) && item.gallery[0]?.original) ||
    undefined;
  const resolvedPrice = sale_price ?? price ?? 0;
  const resolvedQuantity = quantity ?? 0;
  const baseItem = {
    personalizations: personalizations || undefined,
  };
  if (!isEmpty(variation)) {
    return {
      ...baseItem,
      id: `${id}.${variation.id}`,
      productId: id,
      name: `${resolvedName} - ${variation.title}`,
      slug: resolvedSlug,
      unit,
      stock: variation.quantity,
      price: variation.sale_price ? variation.sale_price : variation.price,
      image: resolvedImage,
      variationId: variation.id,
    };
  }
  return {
    ...baseItem,
    id,
    name: resolvedName,
    slug: resolvedSlug,
    unit,
    image: resolvedImage,
    stock: resolvedQuantity,
    price: resolvedPrice,
  };
}
