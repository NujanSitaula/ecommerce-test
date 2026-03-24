'use client';

import { useMemo, useState, useEffect } from 'react';
import { Description, Label, Radio, RadioGroup } from '@headlessui/react';
import cn from 'classnames';
import { useTranslation } from 'src/app/i18n/client';
import { useCheckout } from '@contexts/checkout.context';

const giftOptions = [
  { label: 'Gift wrapped', value: 'gift_wrapped' },
  { label: 'No gift wrap', value: 'none' },
];

function buildDateOptions(count = 5, bufferDays = 2) {
  const options: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + bufferDays + i);
    options.push(
      d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    );
  }
  return options;
}

export default function Schedule({ lang }: { lang: string }) {
  const { t } = useTranslation(lang, 'common');
  const { deliveryDate, giftWrapped, setDeliveryDate, setGiftWrapped } =
    useCheckout();
  const deliveryDateSchedule = useMemo(() => buildDateOptions(), []);
  const [dateSchedule, setDateSchedule] = useState(
    deliveryDate || deliveryDateSchedule[0],
  );
  const [giftChoice, setGiftChoice] = useState<string | null>(
    giftWrapped || null,
  );

  useEffect(() => {
    if (dateSchedule) {
      setDeliveryDate(dateSchedule);
    }
  }, [dateSchedule, setDeliveryDate]);

  useEffect(() => {
    if (giftChoice) {
      setGiftWrapped(giftChoice);
    }
  }, [giftChoice, setGiftWrapped]);
  function getDay(date: string) {
    const day = date.split(',');
    return day[0];
  }
  function getMonth(date: string) {
    const month = date.split(',');
    return month[1];
  }

  return (
    <div className="w-full">
      <div className="w-full mx-auto">
        <RadioGroup value={dateSchedule} onChange={setDateSchedule}>
          <Label className="sr-only">{t('text-delivery-schedule')}</Label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {deliveryDateSchedule.map((date) => (
              <Radio
                key={date}
                value={date}
                className={({ checked }) =>
                  cn(
                    'relative rounded-lg px-5 py-3 cursor-pointer focus:outline-none',
                    checked ? 'bg-brand text-brand-light' : 'bg-gray-100',
                  )
                }
              >
                {({ checked }) => (
                  <div className="text-center">
                    <Label
                      as="p"
                      className={`text-base font-semibold  ${
                        checked ? 'text-brand-light' : 'text-gray-900'
                      }`}
                    >
                      {getDay(date)}
                    </Label>
                    <Description
                      as="span"
                      className={`text-15px ${
                        checked ? 'text-brand-light' : 'text-gray-500'
                      }`}
                    >
                      {getMonth(date)}
                    </Description>
                  </div>
                )}
              </Radio>
            ))}
          </div>
        </RadioGroup>
        {/* End of date schedule */}

        <p className="mt-4 text-sm text-gray-600">
          {t('text-delivery-date-note') ||
            'Dates are tentative and may adjust slightly based on traffic and delivery conditions.'}
        </p>

        <RadioGroup
          className="mt-10"
          value={giftChoice}
          onChange={setGiftChoice}
        >
          <Label className="sr-only">{t('text-delivery-schedule')}</Label>
          <div className="flex flex-wrap gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {giftOptions.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                className="cursor-pointer focus:outline-none"
              >
                {({ checked }) => (
                  <div className="flex items-center">
                    <span
                      className={cn(
                        'flex w-6 h-6 rounded-full',
                        checked
                          ? 'border-[6px] border-brand'
                          : 'border-2 border-gray-200',
                      )}
                    />
                    <Label
                      as="p"
                      className="text-sm text-black ltr:ml-2 rtl:mr-2"
                    >
                      {option.label}
                    </Label>
                  </div>
                )}
              </Radio>
            ))}
          </div>
        </RadioGroup>
        {/* End of gift wrap choice */}
      </div>
    </div>
  );
}
