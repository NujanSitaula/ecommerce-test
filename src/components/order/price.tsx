import usePrice from '@framework/product/use-price';
import { calculateTotal } from '@contexts/cart/cart.utils';

export const TotalPrice: React.FC<{ items?: any }> = ({ items }) => {
  // If items.total exists (order object), use it directly
  // Otherwise calculate from products array (for drawer/order details)
  let total: number;
  if (typeof items?.total === 'number') {
    total = items.total;
  } else {
    const products = items?.products || items?.items || [];
    total = calculateTotal(products) + (items?.delivery_fee || items?.shipping_fee || 0) - (items?.discount || 0);
  }
  
  const { price } = usePrice({
    amount: Math.round(total),
    currencyCode: 'USD',
  });
  return <span className="total_price">{price}</span>;
};

export const DiscountPrice = (discount: any) => {
  const { price } = usePrice({
    amount: discount?.discount,
    currencyCode: 'USD',
  });
  return <>-{price}</>;
};

export const DeliveryFee = (delivery: any) => {
  const amount = delivery?.delivery || delivery?.shipping_fee || delivery?.delivery_fee || 0;
  const { price } = usePrice({
    amount: amount,
    currencyCode: 'USD',
  });
  return <>{price}</>;
};

export const SubTotalPrice: React.FC<{ items?: any }> = ({ items }) => {
  // Support both old format (array of products) and new format (items?.items or items?.subtotal)
  const products = Array.isArray(items) ? items : (items?.products || items?.items || []);
  const subtotal = items?.subtotal ?? calculateTotal(products);
  
  const { price } = usePrice({
    amount: subtotal,
    currencyCode: 'USD',
  });
  return <>{price}</>;
};
