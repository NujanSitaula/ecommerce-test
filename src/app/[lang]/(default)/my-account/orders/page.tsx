import { Metadata } from 'next';
import OrdersPageContent from './orders-page-content';

export const metadata: Metadata = {
  title: 'Orders',
};

export default async function OrdersTablePage({ params }: { params: any }) {
  const { lang } = await params;
  return <OrdersPageContent lang={lang} />;
}
