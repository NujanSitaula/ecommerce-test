import { useState } from 'react';
import { Label, Radio, RadioGroup } from '@headlessui/react';
import cn from 'classnames';
import { useTranslation } from 'src/app/i18n/client';

const deliveryTip = ['$5', '$10', '$15', '$20', '$25'];

export default function DeliveryTips({ lang }: { lang: string }) {
  const { t } = useTranslation(lang, 'common');
  const [deliveryTips, setDeliveryTips] = useState(deliveryTip[0]);

  return (
    <div className="w-full">
      <div className="w-full mx-auto">
        <RadioGroup value={deliveryTips} onChange={setDeliveryTips}>
          <Label className="sr-only">{t('text-delivery-tip')}</Label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {deliveryTip.map((tips) => (
              <Radio
                key={tips}
                value={tips}
                className={({ checked }) =>
                  cn(
                    'relative rounded-lg px-5 py-4 cursor-pointer focus:outline-none',
                    checked ? 'bg-brand text-white' : 'bg-gray-100',
                  )
                }
              >
                {({ checked }) => (
                  <div className="text-center">
                    <RadioGroup.Label
                      as="p"
                      className={`text-base font-semibold  ${
                        checked ? 'text-brand-light' : 'text-brand-dark'
                      }`}
                    >
                      {tips}
                    </RadioGroup.Label>
                  </div>
                )}
              </Radio>
            ))}
          </div>
        </RadioGroup>
        {/* End of date schedule */}
      </div>
    </div>
  );
}
