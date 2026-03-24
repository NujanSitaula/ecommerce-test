import { Metadata } from 'next';
import CategoryProductsPageContent from '@components/shops/category-products-page-content';

export const metadata: Metadata = {
  title: 'Category Products',
};

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  return <CategoryProductsPageContent lang={lang} categorySlug={slug} />;
}
