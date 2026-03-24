'use client';

import { useAddressQuery } from '@framework/address/address';
import AddressGrid from '@components/address/address-grid';
import { useCheckout, GuestAddress } from '@contexts/checkout.context';
import { useEffect } from 'react';
import React from 'react';
import { useUI } from '@contexts/ui.context';
import { useForm } from 'react-hook-form';
import Input from '@components/ui/form/input';
import { useTranslation } from 'src/app/i18n/client';
import { useCountriesQuery } from '@framework/address/countries';

interface GuestAddressFormValues {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country_id: number | string;
  state_id?: number | string;
}

const AddressPage: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');
  const { isAuthorized } = useUI();
  const { data: countriesData } = useCountriesQuery();
  let { data, isLoading } = useAddressQuery();
  const {
    setSelectedAddressId,
    selectedAddressId,
    setGuestAddress,
    guestAddress,
  } = useCheckout();

  // Use guestAddress from context as source of truth - it persists across re-mounts
  // Initialize form with guestAddress values if they exist
  const formDefaultValues = React.useMemo(() => ({
    first_name: guestAddress?.first_name || '',
    last_name: guestAddress?.last_name || '',
    address_line1: guestAddress?.address_line1 || '',
    address_line2: guestAddress?.address_line2 || '',
    city: guestAddress?.city || '',
    postal_code: guestAddress?.postal_code || '',
    country_id: guestAddress?.country_id ? String(guestAddress.country_id) : '',
    state_id: guestAddress?.state_id ? String(guestAddress.state_id) : '',
  }), [guestAddress?.country_id, guestAddress?.state_id]); // Only recompute when key fields change

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GuestAddressFormValues>({
    defaultValues: formDefaultValues,
  });

  // Sync form with guestAddress from context whenever it changes
  // This ensures form state persists across re-mounts
  const lastSyncedKeyRef = React.useRef<string>('');
  const isInitialMountRef = React.useRef(true);
  
  useEffect(() => {
    if (guestAddress && guestAddress.country_id) {
      const currentKey = `${guestAddress.country_id}-${guestAddress.state_id || ''}`;
      const currentFormCountryId = watch('country_id');
      
      // Always sync on initial mount if guestAddress exists, or if key changed
      const shouldSync = isInitialMountRef.current || lastSyncedKeyRef.current !== currentKey;
      
      if (shouldSync) {
        const formCountryMatches = currentFormCountryId === String(guestAddress.country_id);
        
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'address.tsx:78',
            message: 'Sync effect - checking if reset needed',
            data: {
              guestAddressExists: true,
              guestAddressCountryId: guestAddress.country_id,
              currentFormCountryId,
              formCountryMatches,
              currentKey,
              lastSyncedKey: lastSyncedKeyRef.current,
              isInitialMount: isInitialMountRef.current,
              shouldSync,
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run4',
            hypothesisId: 'G',
          }),
        }).catch(() => {});
        // #endregion
        
        // Reset form if it's initial mount OR values don't match
        if (isInitialMountRef.current || !formCountryMatches) {
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'address.tsx:95',
              message: 'Resetting form from guestAddress',
              data: {
                country_id: guestAddress.country_id,
                state_id: guestAddress.state_id,
                reason: isInitialMountRef.current ? 'initial_mount' : 'values_dont_match',
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run4',
              hypothesisId: 'G',
            }),
          }).catch(() => {});
          // #endregion
          
          reset({
            first_name: guestAddress.first_name || '',
            last_name: guestAddress.last_name || '',
            address_line1: guestAddress.address_line1 || '',
            address_line2: guestAddress.address_line2 || '',
            city: guestAddress.city || '',
            postal_code: guestAddress.postal_code || '',
            country_id: String(guestAddress.country_id),
            state_id: guestAddress.state_id ? String(guestAddress.state_id) : '',
          }, { keepDefaultValues: false });
          lastSyncedKeyRef.current = currentKey;
        } else {
          // Form already matches, just update the ref
          lastSyncedKeyRef.current = currentKey;
        }
        
        isInitialMountRef.current = false;
      }
    } else if (!guestAddress) {
      lastSyncedKeyRef.current = '';
      isInitialMountRef.current = true; // Reset on next mount if guestAddress appears
    }
  }, [guestAddress?.country_id, guestAddress?.state_id, reset, watch]);

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'address.tsx:43',
        message: 'Form initialized with default values',
        data: {
          defaultCountryId: guestAddress?.country_id || '',
          defaultStateId: guestAddress?.state_id || '',
          guestAddressExists: !!guestAddress,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'E',
      }),
    }).catch(() => {});
  }, []);
  // #endregion

  const countryId = watch('country_id');
  // Ensure countryId is always a string for the select element
  // Use guestAddress as fallback to ensure value persists across re-mounts
  // This is safe because select elements are client-only components
  const countryIdValue = countryId 
    ? String(countryId) 
    : (guestAddress?.country_id ? String(guestAddress.country_id) : '');
  const countryStates =
    countriesData?.data?.find((c: any) => `${c.id}` === `${countryIdValue || countryId}`)
      ?.states || [];

  // #region agent log (state select render)
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'address.tsx:state-render',
        message: 'State select render values',
        data: {
          countryIdValue,
          stateIdValue: watch('state_id'),
          guestState: guestAddress?.state_id || null,
          countryStatesCount: countryStates.length,
          countryStatesSample: countryStates.slice(0, 3),
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run6',
        hypothesisId: 'H-state-render',
      }),
    }).catch(() => {});
  }, [countryIdValue, countryStates, guestAddress?.state_id, watch]);
  // #endregion

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'address.tsx:56',
        message: 'Countries data loaded',
        data: {
          hasData: !!countriesData,
          dataLength: countriesData?.data?.length || 0,
          firstCountry: countriesData?.data?.[0] || null,
          currentCountryId: countryId,
          countryIdType: typeof countryId,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A',
      }),
    }).catch(() => {});
  }, [countriesData, countryId]);
  // #endregion

  // Auto-save guest address when form values change
  // IMPORTANT: Update immediately when country_id or state_id changes to prevent resets
  useEffect(() => {
    const subscription = watch((values) => {
      // Always update guestAddress if country_id is set, even if other fields are empty
      // This ensures the selection persists across re-mounts
      if (values.country_id) {
        const address: GuestAddress = {
          first_name: values.first_name || '',
          last_name: values.last_name || '',
          address_line1: values.address_line1 || '',
          address_line2: values.address_line2 || '',
          city: values.city || '',
          postal_code: values.postal_code || '',
          country_id: Number(values.country_id),
          state_id: values.state_id ? Number(values.state_id) : undefined,
        };
        setGuestAddress(address);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setGuestAddress]);

  // Emit live form state to logs to debug select value rendering
  useEffect(() => {
    const subscription = watch((values) => {
      fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'address.tsx:live-form-values',
          message: 'Live form values',
          data: {
            country_id: values.country_id,
            state_id: values.state_id,
            guestAddressCountry: guestAddress?.country_id || null,
            guestAddressState: guestAddress?.state_id || null,
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run6',
          hypothesisId: 'LiveForm',
        }),
      }).catch(() => {});
    });
    return () => subscription.unsubscribe();
  }, [watch, guestAddress?.country_id, guestAddress?.state_id]);

  useEffect(() => {
    if (isAuthorized && data && data.length > 0 && !selectedAddressId) {
      // Set first address as default if none selected
      setSelectedAddressId(data[0]?.id);
    }
  }, [data, selectedAddressId, setSelectedAddressId, isAuthorized]);

  const onSubmitGuestAddress = (values: GuestAddressFormValues) => {
    const address: GuestAddress = {
      first_name: values.first_name,
      last_name: values.last_name,
      address_line1: values.address_line1,
      address_line2: values.address_line2,
      city: values.city,
      postal_code: values.postal_code,
      country_id: Number(values.country_id),
      state_id: values.state_id ? Number(values.state_id) : undefined,
    };
    setGuestAddress(address);
  };

  // For authenticated users, show address selection
  if (isAuthorized) {
    return !isLoading ? (
      <AddressGrid
        address={data}
        lang={lang}
        selectedAddressId={selectedAddressId}
        onSelect={(addressId) => setSelectedAddressId(addressId)}
      />
    ) : (
      <div>Loading...</div>
    );
  }

  // For guests, show address form
  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmitGuestAddress)}
        noValidate
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            variant="solid"
            label={t('forms:label-first-name') || 'First Name'}
            {...register('first_name', { required: 'First name is required' })}
            error={errors.first_name?.message}
            lang={lang}
          />
          <Input
            variant="solid"
            label={t('forms:label-last-name') || 'Last Name'}
            {...register('last_name', { required: 'Last name is required' })}
            error={errors.last_name?.message}
            lang={lang}
          />
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
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">
              {t('text-country') || 'Country'}
            </label>
            <select
              className="w-full h-11 md:h-12 px-4 rounded bg-white border border-border-base focus:border-brand focus:outline-none text-brand-dark"
              {...register('country_id', { required: 'Country is required' })}
              value={countryIdValue || ''}
              onChange={(e) => {
                const newCountryId = e.target.value;
                setValue('country_id', newCountryId, { shouldValidate: true });
                setValue('state_id', '', { shouldValidate: false });
                // Immediately update guestAddress in context to persist selection
                const currentValues = watch();
                const address: GuestAddress = {
                  first_name: currentValues.first_name || guestAddress?.first_name || '',
                  last_name: currentValues.last_name || guestAddress?.last_name || '',
                  address_line1: currentValues.address_line1 || guestAddress?.address_line1 || '',
                  address_line2: currentValues.address_line2 || guestAddress?.address_line2 || '',
                  city: currentValues.city || guestAddress?.city || '',
                  postal_code: currentValues.postal_code || guestAddress?.postal_code || '',
                  country_id: Number(newCountryId),
                  state_id: undefined,
                };
                setGuestAddress(address);
              }}
            >
              <option value="">{t('text-select-country') || 'Select country'}</option>
              {countriesData?.data?.map((c: any) => (
                <option key={c.id} value={String(c.id)}>
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
              className="w-full h-11 md:h-12 px-4 rounded bg-white border border-border-base focus:border-brand focus:outline-none text-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
              {...register('state_id')}
              value={watch('state_id') ? String(watch('state_id')) : guestAddress?.state_id ? String(guestAddress.state_id) : ''}
              onChange={(e) => {
                const newStateId = e.target.value;
                setValue('state_id', newStateId, { shouldValidate: true });
                const currentValues = watch();
                const address: GuestAddress = {
                  first_name: currentValues.first_name || guestAddress?.first_name || '',
                  last_name: currentValues.last_name || guestAddress?.last_name || '',
                  address_line1: currentValues.address_line1 || guestAddress?.address_line1 || '',
                  address_line2: currentValues.address_line2 || guestAddress?.address_line2 || '',
                  city: currentValues.city || guestAddress?.city || '',
                  postal_code: currentValues.postal_code || guestAddress?.postal_code || '',
                  country_id: Number(currentValues.country_id) || guestAddress?.country_id || 0,
                  state_id: newStateId ? Number(newStateId) : undefined,
                };
                setGuestAddress(address);
              }}
              disabled={!countryIdValue}
            >
              <option value="">
                {t('text-select-state') || 'Select state'}
              </option>
              {countryStates?.map((s: any) => (
                <option key={s.id} value={String(s.id)}>
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
            {...register('postal_code', { required: 'Postal code is required' })}
            error={errors.postal_code?.message}
            lang={lang}
          />
        </div>
      </form>
    </div>
  );
};

export default AddressPage;
