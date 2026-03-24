'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'src/app/i18n/client';
import PaymentMethodsList from '@components/payments/payment-methods-list';
import { usePaymentMethodsQuery } from '@framework/payment/payment-methods';
import { useCheckout } from '@contexts/checkout.context';
import { useUI } from '@contexts/ui.context';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Button from '@components/ui/button';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string,
);

const GuestPaymentForm: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');
  const stripe = useStripe();
  const elements = useElements();
  const { setGuestPaymentMethodId } = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Get the card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        toast.error('Card element not found');
        setIsProcessing(false);
        return;
      }

      // Create payment method from the card element
      const { error: createError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

      if (createError) {
        console.error('Error creating payment method:', createError);
        toast.error(createError.message || 'Failed to save payment method');
        setIsProcessing(false);
        return;
      }

      if (paymentMethod) {
        setGuestPaymentMethodId(paymentMethod.id);
        toast.success('Payment method saved');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save payment method');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded border border-border-base px-3 py-2 bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '14px',
                color: '#0F172A',
                '::placeholder': {
                  color: '#9CA3AF',
                },
              },
              invalid: {
                color: '#EF4444',
              },
            },
          }}
        />
      </div>
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || isProcessing}
        loading={isProcessing}
        className="w-full"
      >
        {t('button-save-payment') || 'Save Payment Method'}
      </Button>
    </div>
  );
};

const StripeCheckoutInlineForm = ({ lang }: { lang: string }) => {
  const { t } = useTranslation(lang, 'common');
  const { isAuthorized } = useUI();
  const { data: methods = [], isLoading } = usePaymentMethodsQuery();
  const {
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
  } = useCheckout();

  useEffect(() => {
    if (
      isAuthorized &&
      methods.length > 0 &&
      !selectedPaymentMethodId
    ) {
      // Set default payment method as selected if none selected
      const defaultMethod = methods.find((m) => m.is_default) || methods[0];
      if (defaultMethod?.id) {
        setSelectedPaymentMethodId(defaultMethod.id);
      }
    }
  }, [
    methods,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    isAuthorized,
  ]);

  // For authenticated users, show payment method selection
  if (isAuthorized) {
    return (
      <div className="space-y-4">
        {isLoading ? (
          <div>{t('text-loading') || 'Loading...'}</div>
        ) : (
          <>
            <PaymentMethodsList
              lang={lang}
              methods={methods}
              selectedId={selectedPaymentMethodId ?? null}
              onChange={(id) => setSelectedPaymentMethodId(id)}
              showActions={false}
            />
          </>
        )}
      </div>
    );
  }

  // For guests, show Stripe Elements payment form
  // Use CardElement for guest checkout
  return (
    <div className="space-y-4">
      <Elements stripe={stripePromise}>
        <GuestPaymentForm lang={lang} />
      </Elements>
    </div>
  );
};

export default StripeCheckoutInlineForm;
