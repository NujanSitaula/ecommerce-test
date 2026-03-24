import BaselShopPageContent from '@components/shops/basel-shop-page-content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;

  return (
    <BaselShopPageContent lang={lang} />
  );
}
