import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import {
  useModalAction,
  useModalState,
} from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import Heading from '@components/ui/heading';
import { useTranslation } from 'src/app/i18n/client';
import {
  useCreateOrUpdateAddressMutation,
} from '@framework/address/address';
import { useCountriesQuery } from '@framework/address/countries';

interface AddressFormValues {
  id?: number | string;
  title: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code?: string;
  country_id: number | string;
  state_id?: number | string;
  is_default?: boolean;
}

const AddAddressForm: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');
  const { data: modalData } = useModalState();
  const { closeModal } = useModalAction();
  const { data: countriesData } = useCountriesQuery();
  const { mutateAsync, isPending: isLoading } =
    useCreateOrUpdateAddressMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    defaultValues: {
      id: modalData?.id,
      title: modalData?.title ?? '',
      name: modalData?.name ?? '',
      address_line1: modalData?.address_line1 ?? '',
      address_line2: modalData?.address_line2 ?? '',
      city: modalData?.city ?? '',
      postal_code: modalData?.postal_code ?? '',
      country_id: modalData?.country?.id ?? '',
      state_id: modalData?.state?.id ?? '',
      is_default: modalData?.is_default ?? false,
    },
  });

  const countryId = watch('country_id');
  const countryStates =
    countriesData?.data?.find((c: any) => `${c.id}` === `${countryId}`)
      ?.states || [];

  const onSubmit = async (values: AddressFormValues) => {
    await mutateAsync(values);
    closeModal();
  };

  return (
    <div className="w-full md:w-[600px] lg:w-[800px] xl:w-[900px] mx-auto p-5 sm:p-8 bg-brand-light rounded-md">
      <CloseButton onClick={closeModal} />
      <Heading variant="title" className="mb-6 -mt-1.5">
        {t('text-add-delivery-address')}
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            variant="solid"
            label={t('text-address-title') || 'Address Title'}
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
            lang={lang}
          />
          <Input
            variant="solid"
            label={t('text-contact-name') || 'Contact Name'}
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
            lang={lang}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">
              {t('text-country') || 'Country'}
            </label>
            <select
              className="w-full h-11 md:h-12 px-4 rounded bg-white border border-border-base focus:border-brand focus:outline-none"
              {...register('country_id', { required: 'Country is required' })}
              value={countryId}
              onChange={(e) => {
                setValue('country_id', e.target.value);
                setValue('state_id', '');
              }}
            >
              <option value="">{t('text-select-country') || 'Select country'}</option>
              {countriesData?.data?.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.country_id && (
              <p className="text-sm text-red-500 mt-1">
                {errors.country_id.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">
              {t('text-state') || 'State'}
            </label>
            <select
              className="w-full h-11 md:h-12 px-4 rounded bg-white border border-border-base focus:border-brand focus:outline-none"
              {...register('state_id')}
              value={watch('state_id') || ''}
              onChange={(e) => setValue('state_id', e.target.value)}
              disabled={!countryId}
            >
              <option value="">
                {t('text-select-state') || 'Select state'}
              </option>
              {countryStates?.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.state_id && (
              <p className="text-sm text-red-500 mt-1">
                {errors.state_id.message as string}
              </p>
            )}
          </div>
        </div>

        <Input
          variant="solid"
          label={t('forms:label-address') || 'Address Line 1'}
          {...register('address_line1', { required: 'Address is required' })}
          error={errors.address_line1?.message}
          lang={lang}
        />
        <Input
          variant="solid"
          label={t('forms:label-street-address-2') || 'Address Line 2'}
          {...register('address_line2')}
          error={errors.address_line2?.message}
          lang={lang}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            variant="solid"
            label={t('forms:label-city') || 'City'}
            {...register('city', { required: 'City is required' })}
            error={errors.city?.message}
            lang={lang}
          />
          <Input
            variant="solid"
            label={t('forms:label-postcode') || 'Postal Code'}
            {...register('postal_code')}
            error={errors.postal_code?.message}
            lang={lang}
          />
        </div>

        <div className="flex items-center justify-end pt-2">
          <Button className="h-11 md:h-12" type="submit" loading={isLoading}>
            {t('common:text-save-address')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressForm;
