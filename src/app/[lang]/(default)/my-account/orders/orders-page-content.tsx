'use client';

import OrderTable from '@components/order/order-table';
import { useOrdersQuery } from '@framework/order/get-all-orders';
import { transformOrderForTable } from '@utils/order-status-mapper';
import SearchResultLoader from '@components/ui/loaders/search-result-loader';

export default function OrdersPageContent({ lang }: { lang: string }) {
  const { data, isLoading } = useOrdersQuery({});
  
  if (isLoading) {
    return (
      <div className="w-full">
        <SearchResultLoader uniqueKey="orders-list" />
      </div>
    );
  }

  const orders = data?.data?.map(transformOrderForTable) || [];

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="mb-4 text-lg font-semibold text-brand-dark">
          No orders found
        </h2>
        <p className="text-brand-muted">
          You haven&apos;t placed any orders yet.
        </p>
      </div>
    );
  }

  return <OrderTable orders={orders} lang={lang} />;
}
