import { useState } from 'react';
import { OrderDetailsContent } from './order-details-content';
import { formatAddress } from '@utils/format-address';
import { IoClose } from 'react-icons/io5';
import { BiCheck, BiPackage, BiMap } from 'react-icons/bi';
import {
  DiscountPrice,
  DeliveryFee,
  TotalPrice,
  SubTotalPrice,
} from '@components/order/price';

import { useUI } from '@contexts/ui.context';
import { useTranslation } from 'src/app/i18n/client';
import { downloadOrderInvoice, downloadGuestOrderInvoice } from '@utils/download-invoice';
import dayjs from 'dayjs';

const ORDER_STEPS = [
  { serial: 1, label: 'Received' },
  { serial: 2, label: 'Placed' },
  { serial: 3, label: 'Shipped' },
  { serial: 4, label: 'Delivered' },
];

const OrderDrawer: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');
  const { data, closeDrawer } = useUI();
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const handleDownloadInvoice = async () => {
    const orderId = data?.id;
    if (!orderId) return;
    try {
      setInvoiceLoading(true);
      if (data?.guest_email && !data?.user_id) {
        await downloadGuestOrderInvoice(orderId, data.guest_email);
      } else {
        await downloadOrderInvoice(orderId);
      }
    } catch (err) {
      console.error('Invoice download failed:', err);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const shipping_address = data?.shipping_address || data?.address;
  const items = data?.products || data?.items || [];
  const currentSerial = data?.status?.serial ?? 0;

  if (data === '' || !data) return null;

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Order #{data?.tracking_number || data?.id}
          </h2>
          {data?.created_at && (
            <p className="mt-0.5 text-xs text-gray-400">
              {dayjs(data.created_at).format('MMM D, YYYY · h:mm A')}
            </p>
          )}
        </div>
        <button
          onClick={closeDrawer}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="close"
        >
          <IoClose size={18} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Status stepper */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center">
            {ORDER_STEPS.map((step, i) => {
              const done = currentSerial >= step.serial;
              return (
                <div key={step.serial} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                        done
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {done ? <BiCheck size={16} /> : i + 1}
                    </span>
                    <span
                      className={`mt-1.5 text-[10px] leading-tight ${
                        done ? 'font-medium text-emerald-600' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < ORDER_STEPS.length - 1 && (
                    <div
                      className={`mx-1 h-0.5 flex-1 rounded ${
                        currentSerial > step.serial
                          ? 'bg-emerald-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping address */}
        {shipping_address && (
          <div className="mx-5 mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <BiMap className="text-gray-400" size={14} />
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Delivery address
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              {formatAddress(shipping_address)}
            </p>
          </div>
        )}

        {/* Items */}
        <div className="px-5">
          <div className="mb-2 flex items-center gap-1.5">
            <BiPackage className="text-gray-400" size={14} />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Items ({items.length})
            </span>
          </div>
          <div className="rounded-lg border border-gray-200">
            <div className="px-3">
              {items.map((item: any, index: number) => (
                <OrderDetailsContent key={item.id || index} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Price summary */}
        <div className="mx-5 mt-4 mb-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>
                <SubTotalPrice items={items} />
              </span>
            </div>

            {typeof data?.discount_amount === 'number' &&
              data.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>
                    -<DiscountPrice discount={{ discount: data.discount_amount }} />
                  </span>
                </div>
              )}

            {typeof data?.shipping_discount === 'number' &&
              data.shipping_discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Shipping discount</span>
                  <span>
                    -<DeliveryFee delivery={{ delivery: data.shipping_discount }} />
                  </span>
                </div>
              )}

            {(typeof data?.delivery_fee === 'number' ||
              typeof data?.shipping_fee === 'number') && (
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>
                  <DeliveryFee
                    delivery={data.delivery_fee || data.shipping_fee}
                  />
                </span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>
                <TotalPrice items={data} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="border-t border-gray-200 px-5 py-4">
        <div className="flex gap-2">
          {data?.status?.serial !== 0 && data?.id && (
            <button
              type="button"
              onClick={handleDownloadInvoice}
              disabled={invoiceLoading}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {invoiceLoading
                ? t('text-loading') || 'Downloading...'
                : t('text-download-invoice') || 'Download Invoice'}
            </button>
          )}
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-medium text-gray-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          >
            Report
          </button>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDrawer;
