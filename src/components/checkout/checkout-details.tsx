'use client';

import { useState, useMemo } from 'react';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import Contact from '@components/contact/contact';
import Address from './address';
import DeliveryNotes from './delivery-instruction';
import DeliverySchedule from './schedule';
import StripeCheckoutInlineForm from './stripe-checkout-inline-form';
import { useTranslation } from 'src/app/i18n/client';
import { useIsMounted } from '@utils/use-is-mounted';

const CheckoutDetails: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');
  const [bindIndex, setBindIndex] = useState(0);
  
  // Memoize components to prevent re-creation on every render
  const addressComponent = useMemo(() => <Address lang={lang} />, [lang]);
  const scheduleComponent = useMemo(() => <DeliverySchedule lang={lang} />, [lang]);
  const contactComponent = useMemo(() => <Contact lang={lang} />, [lang]);
  const paymentComponent = useMemo(() => <StripeCheckoutInlineForm lang={lang} />, [lang]);
  const notesComponent = useMemo(() => <DeliveryNotes lang={lang} />, [lang]);
  
  const data = useMemo(() => [
    {
      id: 1,
      title: 'text-delivery-address',
      component: addressComponent,
    },
    {
      id: 2,
      title: 'text-delivery-schedule',
      component: scheduleComponent,
    },
    {
      id: 3,
      title: 'text-contact-number',
      component: contactComponent,
    },
    {
      id: 4,
      title: 'text-payment-option',
      component: paymentComponent,
    },
    {
      id: 5,
      title: 'text-delivery-instructions',
      component: notesComponent,
    },
  ], [addressComponent, scheduleComponent, contactComponent, paymentComponent, notesComponent]);
  const changeItem = (itemIndex: any) => {
    if (itemIndex !== bindIndex) {
      setBindIndex(itemIndex);
    }
  };
  const mounted = useIsMounted();
  return (
    <div className="border rounded-md border-border-base text-brand-light">
      {mounted &&
        data?.map((item, index) => {
          return (
            <div
              key={index}
              className={`accordion__panel ${
                !(data?.length - 1 === index)
                  ? 'border-b border-border-base'
                  : ''
              } ${bindIndex !== index ? 'collapsed' : 'expanded'}
            `}
              onClick={() => changeItem(index)}
            >
              <div
                id={`index_${index}`}
                className="flex items-center p-4 pb-6 cursor-pointer sm:p-8 accordion__button"
              >
                <span className="flex items-center justify-center font-semibold border-2 border-current rounded-full h-9 w-9 text-brand ltr:mr-3 rtl:ml-3">
                  {index + 1}
                </span>
                <Heading>{t(item?.title)}</Heading>
              </div>

              <div
                data-aria-label={`index_${index}`}
                className="pb-6 ltr:pl-5 rtl:pr-5 sm:ltr:pl-9 sm:rtl:pr-9 lg:ltr:pl-20 lg:rtl:pr-20 sm:ltr:pr-9 sm:rtl:pl-9 ltr:pr-5 rtl:pl-5 accordion__content"
              >
                <div className="mb-6" key={`component-${item.id}`}>{item?.component}</div>
                {!(data?.length - 1 === index) ? (
                  <div className="ltr:text-right rtl:text-left">
                    <Button
                      onClick={() => changeItem(index + 1)}
                      variant="formButton"
                      className="px-4 py-3 text-sm font-semibold rounded bg-brand text-brand-light"
                    >
                      {t('button-next-steps')}
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CheckoutDetails;
