'use client';

import { useContactNumbersQuery } from '@framework/contact/contact';
import ContactBox from '@components/contact/contact-content';
import { useCheckout, GuestContact } from '@contexts/checkout.context';
import { useEffect } from 'react';
import { useUI } from '@contexts/ui.context';
import { useForm } from 'react-hook-form';
import Input from '@components/ui/form/input';
import { useTranslation } from 'src/app/i18n/client';

interface GuestContactFormValues {
  phone: string;
}

const ContactPage: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');
  const { isAuthorized } = useUI();
  const { data, isLoading } = useContactNumbersQuery();
  const {
    setSelectedContactNumberId,
    selectedContactNumberId,
    setGuestContact,
    guestContact,
  } = useCheckout();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GuestContactFormValues>({
    defaultValues: {
      phone: guestContact?.phone || '',
    },
  });

  // Auto-save guest contact when phone changes
  useEffect(() => {
    const subscription = watch((values) => {
      if (values.phone) {
        const contact: GuestContact = {
          phone: values.phone,
        };
        setGuestContact(contact);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setGuestContact]);

  useEffect(() => {
    if (isAuthorized && data && data.length > 0 && !selectedContactNumberId) {
      // Set default contact as selected if none selected
      const defaultContact = data.find((c: any) => c.is_default) || data[0];
      if (defaultContact?.id) {
        setSelectedContactNumberId(defaultContact.id);
      }
    }
  }, [data, selectedContactNumberId, setSelectedContactNumberId, isAuthorized]);

  const onSubmitGuestContact = (values: GuestContactFormValues) => {
    const contact: GuestContact = {
      phone: values.phone,
    };
    setGuestContact(contact);
  };

  // For authenticated users, show contact selection
  if (isAuthorized) {
    return !isLoading ? (
      <div className="w-full max-w-[1300px] mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full">
            <ContactBox
              contacts={data || []}
              lang={lang}
              selectedContactNumberId={selectedContactNumberId}
              onSelect={(contactId) => setSelectedContactNumberId(contactId)}
            />
          </div>
        </div>
      </div>
    ) : (
      <div>Loading...</div>
    );
  }

  // For guests, show phone input form
  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmitGuestContact)}
        noValidate
        className="space-y-4"
      >
        <Input
          variant="solid"
          label={t('text-contact-number') || 'Phone Number'}
          type="tel"
          {...register('phone', {
            required: 'Phone number is required',
            pattern: {
              value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
              message: 'Please enter a valid phone number',
            },
          })}
          error={errors.phone?.message}
          lang={lang}
        />
      </form>
    </div>
  );
};

export default ContactPage;
