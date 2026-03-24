'use client';

import { useTranslation } from 'src/app/i18n/client';
import PaymentMethodsList from '@components/payments/payment-methods-list';
import { usePaymentMethodsQuery } from '@framework/payment/payment-methods';
import Heading from '@components/ui/heading';

export default function PaymentsPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const { t } = useTranslation(lang, 'common');
  const { data: methods = [], isLoading } = usePaymentMethodsQuery();

  return (
    <div className="space-y-6">
      <Heading className="text-lg font-semibold">
        {t('text-payment-methods') || 'Payment methods'}
      </Heading>
      {isLoading ? (
        <div>{t('text-loading') || 'Loading...'}</div>
      ) : (
        <>
          <PaymentMethodsList
            lang={lang}
            methods={methods}
            showActions={true}
          />
        </>
      )}
    </div>
  );
}


