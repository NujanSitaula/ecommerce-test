'use client';

import Link from 'next/link';
import usePrice from '@framework/product/use-price';
import cn from 'classnames';
import { useCart } from '@contexts/cart/cart.context';
import Text from '@components/ui/text';
import Button from '@components/ui/button';
import Input from '@components/ui/form/input';
import { CheckoutItem } from '@components/checkout/checkout-card-item';
import { CheckoutCardFooterItem } from './checkout-card-footer-item';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@utils/routes';
import { useTranslation } from 'src/app/i18n/client';
import { useIsMounted } from '@utils/use-is-mounted';
import { useEffect, useState } from 'react';
import SearchResultLoader from '@components/ui/loaders/search-result-loader';
import { useCheckout } from '@contexts/checkout.context';
import { usePlaceOrderMutation } from '@framework/order/use-place-order';
import { toast } from 'react-toastify';
import { useApplyCouponMutation } from '@framework/cart/coupons';
import {
  useShippingQuoteQuery,
  useGuestShippingQuoteQuery,
} from '@framework/shipping/get-shipping-quote';
import { useUI } from '@contexts/ui.context';

const CheckoutCard: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { isAuthorized } = useUI();
  const { items, total, isEmpty, resetCart } = useCart();
  const {
    selectedAddressId,
    selectedContactNumberId,
    selectedPaymentMethodId,
    deliveryDate,
    giftWrapped,
    deliveryInstructions,
    leaveAtDoor,
    validateCheckout,
    couponCode,
    couponInfo,
    setCouponCode,
    setCouponInfo,
    clearCoupon,
    guestEmail,
    guestAddress,
    guestContact,
    guestPaymentMethodId,
    setGuestEmail,
  } = useCheckout();
  const { mutate: placeOrder, isPending: isPlacingOrder } =
    usePlaceOrderMutation();
  const { mutateAsync: applyCoupon, isPending: isApplyingCoupon } =
    useApplyCouponMutation();

  // Authenticated users: shipping quote by saved address
  const { data: shippingQuote } = useShippingQuoteQuery(
    isAuthorized ? selectedAddressId : null,
  );

  // Guests: shipping quote by selected country and state
  const guestCountryId = !isAuthorized ? guestAddress?.country_id ?? null : null;
  const guestStateId = !isAuthorized ? guestAddress?.state_id ?? null : null;
  const { data: guestShippingQuote, isLoading: isLoadingGuestShipping, isError: isErrorGuestShipping } = useGuestShippingQuoteQuery(guestCountryId, guestStateId);

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'checkout-card.tsx:guest-query',
        message: 'Guest shipping query state',
        data: {
          guestCountryId,
          guestShippingQuote,
          isLoadingGuestShipping,
          isErrorGuestShipping,
          shippingQuoteData: shippingQuote,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run6',
        hypothesisId: 'H-query-state',
      }),
    }).catch(() => {});
  }, [guestCountryId, guestShippingQuote, isLoadingGuestShipping, isErrorGuestShipping, shippingQuote]);
  // #endregion

  useEffect(() => {
    setLoading(false);
  }, []);

  const discountAmount = couponInfo?.discount_amount ?? 0;
  const shippingFee = isAuthorized
    ? shippingQuote?.shipping_fee ?? 0
    : guestShippingQuote?.shipping_fee ?? 0;
  const taxRate = isAuthorized
    ? (shippingQuote?.tax_rate ?? 0) / 100
    : (guestShippingQuote?.tax_rate ?? 0) / 100;
  const shippingTaxable = isAuthorized
    ? shippingQuote?.shipping_taxable ?? false
    : guestShippingQuote?.shipping_taxable ?? false;
  const taxableProducts = Math.max(0, total - discountAmount);
  const taxOnProducts = taxableProducts * taxRate;
  const taxOnShipping = shippingTaxable ? shippingFee * taxRate : 0;
  const taxAmount = Math.round((taxOnProducts + taxOnShipping) * 100) / 100;
  const finalTotalAmount = Math.max(
    0,
    total + shippingFee - discountAmount + taxAmount
  );

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'checkout-card.tsx:73',
        message: 'Shipping fee computation',
        data: {
          isAuthorized,
          selectedAddressId,
          guestAddressCountry: guestAddress?.country_id || null,
          guestAddressState: guestAddress?.state_id || null,
          shippingFee,
          discountAmount,
          total,
          finalTotalAmount,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run5',
        hypothesisId: 'H-shipping',
      }),
    }).catch(() => {});
  }, [
    isAuthorized,
    selectedAddressId,
    guestAddress?.country_id,
    guestAddress?.state_id,
    shippingFee,
    discountAmount,
    total,
    finalTotalAmount,
  ]);
  // #endregion

  const { price: subtotal } = usePrice({
    amount: total,
    currencyCode: 'USD',
  });

  const { price: shippingPrice } = usePrice({
    amount: shippingFee,
    currencyCode: 'USD',
  });

  const { price: discountPrice } = usePrice({
    amount: discountAmount,
    currencyCode: 'USD',
  });

  const { price: taxPrice } = usePrice({
    amount: taxAmount,
    currencyCode: 'USD',
  });

  const { price: totalAfterDiscount } = usePrice({
    amount: finalTotalAmount,
    currencyCode: 'USD',
  });

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'checkout-card.tsx:price-format',
        message: 'Price formatting values',
        data: {
          shippingFee,
          shippingFeeType: typeof shippingFee,
          shippingPrice,
          shippingPriceType: typeof shippingPrice,
          subtotal,
          discountPrice,
          totalAfterDiscount,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run6',
        hypothesisId: 'H-price-format',
      }),
    }).catch(() => {});
  }, [shippingFee, shippingPrice, subtotal, discountPrice, totalAfterDiscount]);
  // #endregion

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      const result = await applyCoupon({
        code: couponCode,
        cart_total: total,
      });
      setCouponInfo(result);
      toast.success('Coupon applied');
    } catch (error: any) {
      const message =
        error?.response?.data?.errors?.code?.[0] ||
        error?.response?.data?.message ||
        'Failed to apply coupon';
      toast.error(message);
      setCouponInfo(null);
    }
  };

  const handlePlaceOrder = () => {
    if (isEmpty) {
      return;
    }

    // Validate checkout (pass isAuthorized)
    const validation = validateCheckout(isAuthorized);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast.error(validation.errors.join(', '));
      return;
    }

    setValidationErrors([]);

    // Prepare order items
    const orderItems = items.map((item) => ({
      id: item.id,
      name: item.name || `Product ${item.id}`,
      slug: item.slug || String(item.id),
      quantity: item.quantity || 1,
      price: item.price || 0,
    }));

    // Prepare order data based on checkout type
    const orderData: any = {
      delivery_date: deliveryDate!,
      gift_wrapped: giftWrapped === 'gift_wrapped',
      delivery_instructions: deliveryInstructions || null,
      leave_at_door: leaveAtDoor || false,
      coupon_code: couponCode || null,
      items: orderItems,
    };

    if (isAuthorized) {
      // Authenticated user order
      orderData.address_id = selectedAddressId!;
      orderData.contact_number_id = selectedContactNumberId!;
      orderData.payment_method_id = selectedPaymentMethodId!;
    } else {
      // Guest order
      orderData.guest_email = guestEmail!;
      orderData.guest_address = guestAddress!;
      orderData.guest_contact = guestContact!;
      orderData.guest_payment_method_id = guestPaymentMethodId!;
    }

    // Place order
    placeOrder(orderData, {
      onSuccess: (order) => {
        // Clear cart
        resetCart();
        // Redirect to order confirmation page
        router.push(`/${lang}/order/${order.id}`);
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to place order. Please try again.';
        setValidationErrors([errorMessage]);
        toast.error(errorMessage);
      },
    });
  };

  const hasDiscount = !!couponInfo && discountAmount > 0;

  const checkoutFooter = [
    {
      id: 1,
      name: t('text-sub-total'),
      price: subtotal,
    },
    ...(hasDiscount
      ? [
          {
            id: 2,
            name: t('text-discount'),
            price: `-${discountPrice}`,
          },
        ]
      : []),
    {
      id: hasDiscount ? 3 : 2,
      name: t('text-shipping'),
      price: shippingPrice,
    },
    ...(taxAmount > 0
      ? [
          {
            id: hasDiscount ? 4 : 3,
            name: t('text-tax') || 'Tax',
            price: taxPrice,
          },
        ]
      : []),
    {
      id: hasDiscount ? (taxAmount > 0 ? 5 : 4) : taxAmount > 0 ? 4 : 3,
      name: t('text-total'),
      price: totalAfterDiscount,
    },
  ];

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'checkout-card.tsx:footer-array',
        message: 'Checkout footer array contents',
        data: {
          checkoutFooterLength: checkoutFooter.length,
          checkoutFooterItems: checkoutFooter.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            priceType: typeof item.price,
            priceLength: item.price?.length,
          })),
          shippingItem: checkoutFooter.find(item => item.name === t('text-shipping')),
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run6',
        hypothesisId: 'H-footer-display',
      }),
    }).catch(() => {});
  }, [checkoutFooter, t]);
  // #endregion
  const mounted = useIsMounted();
  return (
    <>
      <div className="px-4 pt-4 border rounded-md border-border-base text-brand-light xl:py-6 xl:px-7">
        <div className="flex pb-2 text-sm font-semibold rounded-md text-heading">
          <span className="font-medium text-15px text-brand-dark">
            {t('text-product')}
          </span>
          <span className="font-medium ltr:ml-auto rtl:mr-auto shrink-0 text-15px text-brand-dark">
            {t('text-sub-total')}
          </span>
        </div>
        {isLoading ? (
          <div className="w-full">
            <SearchResultLoader uniqueKey={`product-key`} />
          </div>
        ) : !isEmpty && mounted ? (
          items.map((item) => <CheckoutItem item={item} key={item.id} />)
        ) : (
          <p className="py-4 text-brand-danger text-opacity-70">
            {t('text-empty-cart')}
          </p>
        )}
        {mounted &&
          checkoutFooter.map((item: any) => (
            <CheckoutCardFooterItem item={item} key={item.id} />
          ))}
        {validationErrors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <ul className="list-disc list-inside text-sm text-red-600">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {mounted && (
          <Button
            variant="formButton"
            className={cn(
              'w-full mt-8 mb-5 rounded font-semibold px-4 py-3 transition-all',
              (isEmpty || isPlacingOrder)
                ? 'opacity-40 cursor-not-allowed'
                : '!bg-brand !text-brand-light',
            )}
            onClick={handlePlaceOrder}
            disabled={!!(isEmpty || isPlacingOrder)}
            loading={isPlacingOrder}
          >
            {isPlacingOrder
              ? t('text-processing') || 'Processing...'
              : t('button-order-now')}
          </Button>
        )}
      </div>
      {/* Guest email input */}
      {!isAuthorized && (
        <div className="mt-6 px-4 border rounded-md border-border-base py-4 xl:px-7">
          <Input
            name="email"
            type="email"
            value={guestEmail || ''}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder={
              (t('text-enter-email') as string) || 'Enter your email address'
            }
            variant="solid"
            label={t('text-email') || 'Email Address'}
            inputClassName="h-11 text-sm"
            lang={lang}
            required
          />
        </div>
      )}
      {/* Coupon input */}
      <div className="mt-6 px-4 border rounded-md border-border-base py-4 xl:px-7">
        <label
          htmlFor="checkout-coupon"
          className="mb-3 block text-sm text-brand-dark"
        >
          {t('text-use-coupon') || 'Use Coupon'}
        </label>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <Input
              name="coupon"
              id="checkout-coupon"
              type="text"
              value={couponCode || ''}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder={
                (t('text-enter-coupon') as string) || 'Enter coupon code'
              }
              variant="solid"
              inputClassName="h-11 text-sm"
              lang={lang}
            />
          </div>
          <Button
            variant="formButton"
            onClick={handleApplyCoupon}
            loading={isApplyingCoupon}
            disabled={!couponCode || isApplyingCoupon}
            className="h-11 px-4 whitespace-nowrap shrink-0"
          >
            {t('text-apply') || 'Apply'}
          </Button>
        </div>
        {couponInfo && (
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-green-700">
              {t('text-coupon-applied') || 'Coupon applied'}: {couponInfo.code}{' '}
              {couponInfo.type === 'percent'
                ? `(-${couponInfo.value}% off)`
                : couponInfo.type === 'flat'
                ? `(-$${couponInfo.discount_amount.toFixed(2)})`
                : t('text-free-shipping') || 'Free shipping'}
            </div>
            <button
              onClick={clearCoupon}
              className="text-xs text-brand hover:text-brand-dark underline"
            >
              {t('text-remove') || 'Remove'}
            </button>
          </div>
        )}
      </div>
      <Text className="mt-8">
        {t('text-by-placing-your-order')}{' '}
        <Link
          href={`/${lang}${ROUTES.TERMS}`}
          className="font-medium underline text-brand"
        >
          {t('text-terms-of-service')}{' '}
        </Link>
        {t('text-and')}{' '}
        <Link
          href={`/${lang}${ROUTES.PRIVACY}`}
          className="font-medium underline text-brand"
        >
          {t('text-privacy')}
        </Link>
        . {t('text-credit-debit')}
      </Text>
      <Text className="mt-4">{t('text-bag-fee')}</Text>
    </>
  );
};

export default CheckoutCard;
