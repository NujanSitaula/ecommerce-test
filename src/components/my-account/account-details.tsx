'use client';

import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import { useForm } from 'react-hook-form';
import {
  useUpdateUserMutation,
  UpdateUserType,
  useCancelEmailChangeMutation,
} from '@framework/customer/use-update-customer';
import Text from '@components/ui/text';
import { useTranslation } from 'src/app/i18n/client';
import { useProfileQuery } from '@framework/contact/contact';
import { useModalAction } from '@components/common/modal/modal.context';
import { toast } from 'react-toastify';
import React from 'react';

const defaultValues: UpdateUserType = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
};

const AccountDetails: React.FC<{ lang: string }> = ({ lang }) => {
  const { mutate: updateUser, isPending } = useUpdateUserMutation();
  const { mutate: cancelEmailChange, isPending: isCancellingEmailChange } =
    useCancelEmailChangeMutation();
  const { openModal } = useModalAction();
  const { data: profile } = useProfileQuery() as { data?: any };
  const { t } = useTranslation(lang);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserType>({
    defaultValues,
  });
  React.useEffect(() => {
    if (!profile) return;
    const name = (profile?.name ?? '').trim();
    const [firstName, ...rest] = name.split(' ').filter(Boolean);
    const lastName = rest.join(' ');
    reset({
      firstName: firstName ?? '',
      lastName,
      phoneNumber: profile?.phone ?? '',
      email: profile?.email ?? '',
    });
  }, [profile, reset]);

  function onSubmit(input: UpdateUserType) {
    updateUser(input, {
      onSuccess: (response: any) => {
        if (response?.requires_email_verification && response?.pending_email) {
          toast.success(
            response?.message ?? 'Verification code sent to your new email.',
          );
          openModal('OTP_VERIFICATION', {
            email: response.pending_email,
            mode: 'email-change',
          });
          return;
        }
        toast.success(response?.message ?? 'Account details updated successfully.');
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ?? 'Could not update account details.';
        toast.error(message);
      },
    });
  }
  return (
    <div className="flex flex-col w-full">
      <Heading variant="titleLarge" className="mb-5 md:mb-6 lg:mb-7 lg:-mt-1">
        {t('common:text-account-details-personal')}
      </Heading>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center w-full mx-auto"
        noValidate
      >
        <div className="border-b border-border-base pb-7 md:pb-8 lg:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                label={t('forms:label-first-name') as string}
                {...register('firstName', {
                  required: 'forms:first-name-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.firstName?.message}
                lang={lang}
              />
              <Input
                label={t('forms:label-last-name') as string}
                {...register('lastName', {
                  required: 'forms:last-name-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.lastName?.message}
                lang={lang}
              />
            </div>
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                type="tel"
                label={t('forms:label-phone') as string}
                {...register('phoneNumber', {
                  required: 'forms:phone-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.phoneNumber?.message}
                lang={lang}
              />
              <Input
                type="email"
                label={t('forms:label-email-star') as string}
                {...register('email', {
                  required: 'forms:email-required',
                  pattern: {
                    value:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'forms:email-error',
                  },
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.email?.message}
                lang={lang}
              />
            </div>
          </div>
        </div>
        {profile?.has_pending_email_change && (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-amber-900">
                  Email change pending verification
                </p>
                <p className="mt-0.5 truncate text-xs text-amber-800">
                  Pending: <span className="font-semibold">{profile?.pending_email}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="formButton"
                  className="!h-8 !min-h-0 !box-border !rounded !px-3 !py-0 !text-xs !font-medium !leading-none tracking-normal normal-case"
                  onClick={() =>
                    openModal('OTP_VERIFICATION', {
                      email: profile?.pending_email,
                      mode: 'email-change',
                    })
                  }
                >
                  Verify OTP
                </Button>
              <Button
                type="button"
                  variant="formButton"
                  className="!h-8 !min-h-0 !box-border !rounded !px-3 !py-0 !text-xs !font-body !font-semibold !leading-none !tracking-normal !normal-case !bg-transparent !text-brand-dark !border !border-border-four hover:!bg-transparent"
                loading={isCancellingEmailChange}
                disabled={isCancellingEmailChange}
                onClick={() =>
                  cancelEmailChange(undefined, {
                    onSuccess: (res: any) => {
                      toast.success(
                        res?.message ?? 'Pending email change cancelled.',
                      );
                    },
                    onError: (error: any) => {
                      toast.error(
                        error?.response?.data?.message ??
                          'Could not cancel pending email change.',
                      );
                    },
                  })
                }
              >
                Cancel
              </Button>
              </div>
            </div>
          </div>
        )}
        <div className="relative flex pb-2 mt-5 sm:ltr:ml-auto sm:rtl:mr-auto lg:pb-0">
          <Button
            type="submit"
            loading={isPending}
            disabled={isPending}
            variant="formButton"
            className="w-full sm:w-auto"
          >
            {t('common:button-save-changes')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
