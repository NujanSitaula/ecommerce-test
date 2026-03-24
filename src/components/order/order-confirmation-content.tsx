'use client';

import { useState } from 'react';
import { useOrderQuery } from '@framework/order/get-order';
import { useTranslation } from 'src/app/i18n/client';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import usePrice from '@framework/product/use-price';
import { formatAddress } from '@utils/format-address';
import SearchResultLoader from '@components/ui/loaders/search-result-loader';
import { downloadOrderInvoice, downloadGuestOrderInvoice } from '@utils/download-invoice';
import Button from '@components/ui/button';

const OrderConfirmationContent: React.FC<{
  lang: string;
  orderId: number;
}> = ({ lang, orderId }) => {
  const { t } = useTranslation(lang, 'common');
  const { data: order, isLoading, error } = useOrderQuery(String(orderId));
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const handleDownloadInvoice = async () => {
    if (!order) return;
    try {
      setInvoiceLoading(true);
      if (order.guest_email && !order.user_id) {
        await downloadGuestOrderInvoice(orderId, order.guest_email);
      } else {
        await downloadOrderInvoice(orderId);
      }
    } catch (err) {
      console.error('Invoice download failed:', err);
    } finally {
      setInvoiceLoading(false);
    }
  };

  // All hooks must be called before any conditional returns
  const { price: subtotalPrice } = usePrice({
    amount: order?.subtotal || 0,
    currencyCode: 'USD',
  });

  const { price: shippingPrice } = usePrice({
    amount: order?.shipping_fee || 0,
    currencyCode: 'USD',
  });

  const { price: totalPrice } = usePrice({
    amount: order?.total || 0,
    currencyCode: 'USD',
  });

  if (isLoading) {
    return (
      <div className="w-full">
        <SearchResultLoader uniqueKey="order-confirmation" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-10">
        <Heading className="mb-4">{t('text-order-not-found') || 'Order not found'}</Heading>
        <Text>{t('text-order-load-error') || 'Unable to load order details.'}</Text>
      </div>
    );
  }

  const orderItems = (order.items ?? order.products ?? []) as any[];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <Heading className="mb-2">
          {t('text-order-placed-successfully') || 'Order Placed Successfully!'}
        </Heading>
        <Text className="text-brand-muted">
          {t('text-order-confirmation-message') ||
            'Thank you for your order. We have received your order and will begin processing it shortly.'}
        </Text>
      </div>

      <div className="bg-white border rounded-lg border-border-base p-6 mb-6">
        <div className="mb-4 pb-4 border-b border-border-base">
          <Text className="text-sm font-semibold text-brand-muted mb-2">
            {t('text-order-number') || 'Order Number'}
          </Text>
          <Heading className="text-2xl">#{order.id}</Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Text className="text-sm font-semibold text-brand-muted mb-2">
              {t('text-delivery-address') || 'Delivery Address'}
            </Text>
            <Text className="text-brand-dark">
              {order.address?.name && (
                <div className="font-semibold mb-1">{order.address.name}</div>
              )}
              {formatAddress(order.address)}
            </Text>
          </div>

          <div>
            <Text className="text-sm font-semibold text-brand-muted mb-2">
              {t('text-contact-number') || 'Contact Number'}
            </Text>
            <Text className="text-brand-dark">
              {order.contact_number?.title && (
                <div className="font-semibold mb-1">
                  {order.contact_number.title}
                </div>
              )}
              {order.contact_number?.phone}
            </Text>
          </div>

          <div>
            <Text className="text-sm font-semibold text-brand-muted mb-2">
              {t('text-delivery-date') || 'Delivery Date'}
            </Text>
            <Text className="text-brand-dark">
              {order.delivery_date
                ? new Date(order.delivery_date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '—'}
            </Text>
            {order.gift_wrapped && (
              <Text className="text-sm text-brand mt-1">
                {t('text-gift-wrapped') || 'Gift Wrapped'}
              </Text>
            )}
            {order.leave_at_door && (
              <Text className="text-sm text-brand mt-1">
                {t('text-leave-at-door') || 'Leave at door'}
              </Text>
            )}
          </div>

          <div>
            <Text className="text-sm font-semibold text-brand-muted mb-2">
              {t('text-payment-method') || 'Payment Method'}
            </Text>
            <Text className="text-brand-dark">
              {order.payment_method?.brand?.toUpperCase() || 'CARD'} ••••{' '}
              {order.payment_method?.last4}
              {order.payment_method?.cardholder_name && (
                <div className="text-sm text-brand-muted mt-1">
                  {order.payment_method.cardholder_name}
                </div>
              )}
            </Text>
          </div>
        </div>

        {order.delivery_instructions && (
          <div className="mb-6 pt-4 border-t border-border-base">
            <Text className="text-sm font-semibold text-brand-muted mb-2">
              {t('text-delivery-instructions') || 'Delivery Instructions'}
            </Text>
            <Text className="text-brand-dark">{order.delivery_instructions}</Text>
          </div>
        )}
      </div>

      <div className="bg-white border rounded-lg border-border-base p-6 mb-6">
        <Heading className="mb-4">{t('text-order-items') || 'Order Items'}</Heading>
        <div className="space-y-4">
          {orderItems.map((item: any) => {
            const formatPrice = (amount: number) => {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(amount);
            };
            const itemName = item.product_name ?? item.name ?? 'Item';
            const itemSubtotal =
              typeof item.subtotal === 'number'
                ? item.subtotal
                : Number(item.price ?? 0) * Number(item.quantity ?? 0);
            return (
              <div
                key={item.id}
                className="flex justify-between items-start pb-4 border-b border-border-base last:border-0"
              >
                <div className="flex-1">
                  <Text className="font-semibold text-brand-dark mb-1">
                    {itemName}
                  </Text>
                  <Text className="text-sm text-brand-muted">
                    {t('text-quantity') || 'Quantity'}: {item.quantity} ×{' '}
                    {formatPrice(item.price)}
                  </Text>
                </div>
                <Text className="font-semibold text-brand-dark">
                  {formatPrice(itemSubtotal)}
                </Text>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border rounded-lg border-border-base p-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Text>{t('text-sub-total') || 'Subtotal'}</Text>
            <Text className="font-semibold">{subtotalPrice}</Text>
          </div>
          {(order.discount_amount ?? 0) > 0 && (
            <div className="flex justify-between text-sm text-green-700">
              <Text>
                {t('text-discount') || 'Discount'}
              </Text>
              <Text className="font-semibold">
                -
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(order.discount_amount ?? 0)}
              </Text>
            </div>
          )}
          {(order.shipping_discount ?? 0) > 0 && (
            <div className="flex justify-between text-sm text-green-700">
              <Text>
                {t('text-shipping-discount') || 'Shipping discount'}
              </Text>
              <Text className="font-semibold">
                -
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(order.shipping_discount ?? 0)}
              </Text>
            </div>
          )}
          <div className="flex justify-between">
            <Text>{t('text-shipping') || 'Shipping'}</Text>
            <Text className="font-semibold">{shippingPrice}</Text>
          </div>
          {(order.tax_amount ?? 0) > 0 && (
            <div className="flex justify-between">
              <Text>{t('text-tax') || 'Tax'}</Text>
              <Text className="font-semibold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(order.tax_amount ?? 0)}
              </Text>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-border-base">
            <Text className="text-lg font-semibold">
              {t('text-total') || 'Total'}
            </Text>
            <Text className="text-lg font-semibold">{totalPrice}</Text>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center space-y-4">
        <Text className="text-brand-muted">
          {t('text-order-status') || 'Order Status'}:{' '}
          <span className="font-semibold text-brand-dark capitalize">
            {order.status ?? 'processing'}
          </span>
        </Text>
        {(order.status ?? '') !== 'cancelled' && (
          <div>
            <Button
              variant="border"
              onClick={handleDownloadInvoice}
              disabled={invoiceLoading}
              className="inline-flex items-center gap-2"
            >
              {invoiceLoading ? (t('text-loading') || 'Downloading...') : (t('text-download-invoice') || 'Download Invoice')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationContent;

