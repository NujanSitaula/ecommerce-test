import { usePaymentQuery } from '@framework/payment/payment';
import PaymentBox from './payment-content';
import { useTranslation } from 'src/app/i18n/client';

const PaymentPage: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');
  let { data, isLoading } = usePaymentQuery();
  return !isLoading ? (
    <div className="w-full max-w-[1300px] mx-auto">
      <div className="flex flex-wrap">
        <div className="lg:w-[35%] w-full"></div>
        <div className="lg:w-[65%] w-full">
          <div className="p-4 border border-solid rounded md:px-12 md:py-10 border-border-base">
            <h2 className="mb-4 text-xl font-semibold text-brand-dark">
              {t('text-delivery-payment')}
            </h2>
            <PaymentBox items={data} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default PaymentPage;
