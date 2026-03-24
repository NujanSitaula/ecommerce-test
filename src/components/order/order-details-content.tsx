import usePrice from '@framework/product/use-price';
import Image from '@components/ui/image';
import { productPlaceholder } from '@assets/placeholders';

export const OrderDetailsContent: React.FC<{ item?: any }> = ({ item }) => {
  const { price } = usePrice({
    amount: item.price,
    currencyCode: 'USD',
  });

  const thumbnail =
    item?.product?.thumbnail_url ||
    item?.image?.thumbnail ||
    item?.image?.original ||
    productPlaceholder;

  const name = item?.product_name || item?.name || 'Product';

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
        <Image
          src={thumbnail}
          alt={name}
          width={48}
          height={48}
          quality={85}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-800 leading-tight">
          {name}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">
          Qty: {item.quantity ?? 1}
        </p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-gray-800">
        {price}
      </span>
    </div>
  );
};
