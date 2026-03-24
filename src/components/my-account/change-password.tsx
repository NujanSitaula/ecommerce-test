'use client';

import PasswordInput from '@components/ui/form/password-input';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import { useForm } from 'react-hook-form';
import {
  useChangePasswordMutation,
  ChangePasswordInputType,
} from '@framework/customer/use-change-password';
import { useTranslation } from 'src/app/i18n/client';
import { toast } from 'react-toastify';

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

const ChangePassword: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang);
  const { mutate: changePassword, isPending } = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInputType>({
    defaultValues,
  });
  const newPassword = watch('newPassword');
  function onSubmit(input: ChangePasswordInputType) {
    changePassword(input, {
      onSuccess: (response: any) => {
        toast.success(response?.message ?? 'Password changed successfully.');
        reset(defaultValues);
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ?? 'Could not change password.';
        toast.error(message);
      },
    });
  }
  return (
    <>
      <Heading variant="titleLarge">
        {t('common:text-account-details-password')}
      </Heading>
      <div className="flex flex-col w-full mt-6 lg:w-10/12 2xl:w-9/12 lg:mt-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center w-full mx-auto "
        >
          <div className="flex flex-col space-y-5 lg:space-y-7">
            <PasswordInput
              label={t('forms:label-current-password')}
              error={errors.currentPassword?.message}
              {...register('currentPassword', {
                required: `${t('forms:password-old-required')}`,
              })}
              lang={lang}
            />
            <PasswordInput
              label={t('forms:label-new-password')}
              error={errors.newPassword?.message}
              {...register('newPassword', {
                required: `${t('forms:password-new-required')}`,
              })}
              lang={lang}
            />
            <PasswordInput
              label={t('forms:label-confirm-password')}
              error={errors.confirmNewPassword?.message}
              {...register('confirmNewPassword', {
                required: `${t('forms:password-confirm-required')}`,
                validate: (value) =>
                  value === newPassword || `${t('forms:password-confirm-mismatch')}`,
              })}
              lang={lang}
            />

            <div className="relative mt-3">
              <Button
                type="submit"
                loading={isPending}
                disabled={isPending}
                variant="formButton"
                className="w-full sm:w-auto"
              >
                {t('common:text-change-password')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
