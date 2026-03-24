import Button from '@components/ui/button';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCreditCard,
} from 'react-icons/fa';
import { useTranslation } from 'src/app/i18n/client';
import {
  PaymentMethod,
  useDeletePaymentMethodMutation,
} from '@framework/payment/payment-methods';
import { RadioGroup } from '@headlessui/react';
import { useEffect, useMemo, useState } from 'react';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import http from '@framework/utils/http';
import { useQueryClient } from '@tanstack/react-query';
import { useModalAction } from '@components/common/modal/modal.context';

interface PaymentMethodsListProps {
  lang: string;
  methods: PaymentMethod[];
  selectedId?: number | null;
  onChange?: (id: number) => void;
  showActions?: boolean;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({
  lang,
  methods,
  selectedId,
  onChange,
  showActions = true,
}) => {
  const { t } = useTranslation(lang, 'common');
  const { mutateAsync: deleteMethod } = useDeletePaymentMethodMutation();
  const queryClient = useQueryClient();
  const defaultMethodId = useMemo(
    () => methods.find((m) => m.is_default)?.id ?? methods[0]?.id ?? null,
    [methods],
  );
  const [currentId, setCurrentId] = useState<number | null>(selectedId ?? null);
  const { openModal } = useModalAction();

  useEffect(() => {
    setCurrentId(selectedId ?? defaultMethodId ?? null);
  }, [selectedId, defaultMethodId]);

  const getBrandIcon = (brand?: string | null) => {
    const b = (brand || '').toLowerCase();
    if (b.includes('visa')) return <FaCcVisa className="text-xl text-[#1A1F71]" />;
    if (b.includes('master')) return <FaCcMastercard className="text-xl text-[#EB001B]" />;
    if (b.includes('amex')) return <FaCcAmex className="text-xl text-[#2E77BB]" />;
    if (b.includes('discover')) return <FaCcDiscover className="text-xl text-[#FF6000]" />;
    return <FaCreditCard className="text-xl text-brand" />;
  };

  const handleChange = async (id: number) => {
    setCurrentId(id);
    if (onChange) onChange(id);
  };

  const handleSetDefault = async (id: number) => {
    await http.post(`${API_ENDPOINTS.PAYMENT_METHODS}/${id}/default`);
    await queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.PAYMENT_METHODS],
    });
  };

  const handleDelete = async (id: number) => {
    await deleteMethod(id);
  };

  if (!methods.length) {
    return (
      <button
        type="button"
        className="border-2 transition-all border-border-base rounded font-semibold p-5 px-10 cursor-pointer text-brand flex justify-start hover:border-brand items-center min-h-[72px] h-full"
        onClick={() => openModal('CARD_VIEW')}
      >
        <AiOutlinePlus size={18} className="ltr:mr-2 rtl:ml-2" />
        {t('text-add-card') || 'Add new card'}
      </button>
    );
  }

  return (
    <RadioGroup
      value={currentId}
      onChange={handleChange}
      className="grid grid-cols-1 gap-4"
    >
      {methods.map((m) => (
        <RadioGroup.Option
          key={m.id}
          value={m.id}
          className={({ checked }) =>
            `border rounded p-4 flex justify-between items-center cursor-pointer ${
              checked ? 'border-brand' : 'border-border-base'
            }`
          }
        >
          {({ checked }) => (
            <>
              <div className="flex items-start gap-3">
                <div className="mt-1">{getBrandIcon(m.brand)}</div>
                <div>
                  <div className="text-sm font-semibold text-brand-dark">
                    {(m.brand?.toUpperCase() || 'CARD') + ' •••• ' + (m.last4 || '')}
                  </div>
                  {m.cardholder_name && (
                    <div className="text-xs text-brand-muted mt-0.5">
                      {t('text-cardholder') || 'Name'}: {m.cardholder_name}
                    </div>
                  )}
                  <div className="text-xs text-brand-muted mt-0.5">
                    {t('text-expiry') || 'Expiry'}:{' '}
                    {m.exp_month && m.exp_year
                      ? `${m.exp_month}/${m.exp_year}`
                      : t('text-not-available') || 'N/A'}
                  </div>
                  {m.is_default && (
                    <div className="mt-1 text-xs text-green-600">
                      {t('text-default') || 'Default'}
                    </div>
                  )}
                </div>
              </div>
              {showActions && (
                <div className="flex flex-col gap-2 items-end">
                  {!m.is_default && (
                    <Button
                      variant="border"
                      className="!h-10 !px-4 tracking-normal"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(m.id);
                      }}
                    >
                      {t('text-make-default') || 'Make default'}
                    </Button>
                  )}
                  <Button
                    variant="border"
                    className="!h-10 !px-4 tracking-normal text-brand-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(m.id);
                    }}
                  >
                    {t('text-delete') || 'Delete'}
                  </Button>
                  {checked && (
                    <span className="text-xs text-brand mt-1">
                      {t('text-selected') || 'Selected'}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </RadioGroup.Option>
      ))}
      <button
        type="button"
        className="border-2 transition-all border-border-base rounded font-semibold p-5 px-10 cursor-pointer text-brand flex justify-start hover:border-brand items-center min-h-[72px] h-full"
        onClick={() => openModal('CARD_VIEW')}
      >
        <AiOutlinePlus size={18} className="ltr:mr-2 rtl:ml-2" />
        {t('text-add-card') || 'Add new card'}
      </button>
    </RadioGroup>
  );
};

export default PaymentMethodsList;


