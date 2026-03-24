import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import React from 'react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string,
);

export const StripeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const options: StripeElementsOptions = {
    // Customize if needed (locale, appearance, etc.)
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};


