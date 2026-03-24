import type { Metadata } from 'next';
import BaselBreadcrumb from '../basel-breadcrumb';
import CheckoutProtected from '@components/checkout/checkout-protected';
import { CheckoutProvider } from '@contexts/checkout.context';
import CheckoutDetails from '@components/checkout/checkout-details';
import CheckoutCard from '@components/checkout/checkout-card';

export const metadata: Metadata = {
  title: 'Basel Checkout',
};

export default async function BaselCheckoutPage({ params }: { params: any }) {
  const { lang } = await params;

  return (
    <>
      <BaselBreadcrumb lang={lang} />

      <div className="pt-3 pt-lg-4 pb-4 pb-lg-5">
        <div className="container">
          <CheckoutProtected lang={lang}>
            <CheckoutProvider>
              <div className="row g-4">
                <div className="col-12 col-lg-8">
                  <h1 className="h4 mb-3">Checkout</h1>
                  <CheckoutDetails lang={lang} />
                </div>

                <div className="col-12 col-lg-4">
                  <div className="position-sticky" style={{ top: 96 }}>
                    <CheckoutCard lang={lang} />
                  </div>
                </div>
              </div>
            </CheckoutProvider>
          </CheckoutProtected>
        </div>
      </div>
    </>
  );
}

