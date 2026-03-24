'use client';

import OrderInformation from '@components/order/order-information';
import Container from '@components/ui/container';
import Divider from '@components/ui/divider';
import { useCart } from '@contexts/cart/cart.context';
import { useEffect } from 'react';

export default function CompleteOrderContent({ lang }: { lang: string }) {
  const { resetCart } = useCart();
  useEffect(() => {
    resetCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Divider />
      <Container>
        <OrderInformation lang={lang} />
      </Container>
      <Divider />
    </>
  );
}
