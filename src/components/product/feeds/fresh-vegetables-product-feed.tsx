'use client';

import { useFreshVegetablesProductsQuery } from '@framework/product/get-all-fresh-vegetables-products';
import ProductsCarousel from '@components/product/products-carousel';
import { ROUTES } from '@utils/routes';
import { LIMITS } from '@framework/utils/limits';

export default function FreshVegetablesProductFeed({ lang }: { lang: string }) {
  const { data, isLoading, error } = useFreshVegetablesProductsQuery({
    limit: LIMITS.FRESH_VEGETABLES_PRODUCTS_LIMITS,
  });
  return (
    <ProductsCarousel
      sectionHeading="text-fresh-vegetables"
      categorySlug={ROUTES.PRODUCTS}
      products={data}
      loading={isLoading}
      error={error?.message}
      limit={LIMITS.FRESH_VEGETABLES_PRODUCTS_LIMITS}
      uniqueKey="fresh-vegetable"
      lang={lang}
    />
  );
}
