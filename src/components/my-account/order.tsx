import OrderTable from '@components/order/order-table';
import { useOrdersQuery } from '@framework/order/get-all-orders';

export default function OrdersTablePage({ lang }: { lang: string }) {
  const { data, isLoading } = useOrdersQuery({});
  return (
    <div className="pt-4">
      {!isLoading ? (
        <OrderTable orders={data?.data} lang={lang} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
