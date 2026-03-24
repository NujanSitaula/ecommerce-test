'use client';

import TextArea from '@components/ui/form/text-area';
import { useTranslation } from 'src/app/i18n/client';
import Text from '@components/ui/text';
import { useCheckout } from '@contexts/checkout.context';
import { useEffect } from 'react';

const DeliveryInstructions: React.FC<{ data?: any; lang: string }> = ({
  data,
  lang,
}) => {
  const { t } = useTranslation(lang);
  const {
    deliveryInstructions,
    leaveAtDoor,
    setDeliveryInstructions,
    setLeaveAtDoor,
  } = useCheckout();

  useEffect(() => {
    if (data?.instructionNote) {
      setDeliveryInstructions(data.instructionNote);
    }
    if (data?.default) {
      setLeaveAtDoor(data.default);
    }
  }, [data, setDeliveryInstructions, setLeaveAtDoor]);

  return (
    <div className="w-full">
      <div className="w-full mx-auto">
        <div className="mb-6">
          <TextArea
            variant="normal"
            name="delivery_instructions"
            inputClassName="focus:border-2 focus:outline-none focus:border-brand"
            label="forms:label-delivery-instructions-note"
            value={deliveryInstructions || ''}
            onChange={(e) => setDeliveryInstructions(e.target.value || null)}
            lang={lang}
          />
        </div>
        <div className="mb-6">
          <input
            id="default-type"
            type="checkbox"
            checked={leaveAtDoor}
            onChange={(e) => setLeaveAtDoor(e.target.checked)}
            className="w-5 h-5 transition duration-500 ease-in-out border border-gray-300 rounded cursor-pointer form-checkbox focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none focus:checked:bg-brand hover:checked:bg-brand checked:bg-brand"
          />
          <label
            htmlFor="default-type"
            className="font-medium align-middle ltr:ml-3 rtl:mr-3 text-brand-dark text-15px"
          >
            {t('forms:label-leave-at-my-door')}
          </label>
          <Text className="ltr:ml-8 rtl:mr-8 pt-2.5" variant="small">
            {t('common:text-selecting-this-option')}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInstructions;
