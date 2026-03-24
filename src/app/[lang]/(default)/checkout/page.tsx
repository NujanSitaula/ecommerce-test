import CheckoutCard from '@components/checkout/checkout-card';
import Container from '@components/ui/container';
import CheckoutDetails from '@components/checkout/checkout-details';
import Divider from '@components/ui/divider';
import { Metadata } from 'next';
import CheckoutProtected from '@components/checkout/checkout-protected';
import { CheckoutProvider } from '@contexts/checkout.context';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default async function CheckoutPage({ params }: { params: any }) {
  const { lang } = await params;
  return (
    <>
      <Divider />
      <Container className="py-10 2xl:py-12 checkout">
        <CheckoutProtected lang={lang}>
          <CheckoutProvider>
            <div className="flex flex-col mx-auto xl:max-w-screen-xl">
              <div className="flex flex-col flex-wrap grid-cols-1 gap-x-7 xl:gap-x-8 lg:grid lg:grid-cols-12">
                <div className="w-full col-start-1 col-end-9">
                  <CheckoutDetails lang={lang} />
                </div>
                <div className="w-full col-start-9 col-end-13 mt-7 lg:mt-0">
                  <CheckoutCard lang={lang} />
                </div>
              </div>
            </div>
          </CheckoutProvider>
        </CheckoutProtected>
      </Container>
      <Divider />
    </>
  );
}
