import Container from '@components/ui/container';
import Divider from '@components/ui/divider';
import { Metadata } from 'next';
import OrderConfirmationContent from '@components/order/order-confirmation-content';

export const metadata: Metadata = {
  title: 'Order Confirmation',
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: any;
}) {
  const { lang, id } = await params;
  return (
    <>
      <Divider />
      <Container className="py-10 2xl:py-12">
        <OrderConfirmationContent lang={lang} orderId={Number(id)} />
      </Container>
      <Divider />
    </>
  );
}

