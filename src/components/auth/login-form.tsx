'use client';

import { useState } from 'react';
import Image from 'next/image';
import Input from '@components/ui/form/input';
import PasswordInput from '@components/ui/form/password-input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import { useLoginMutation, LoginInputType } from '@framework/auth/use-login';
import { useTranslation } from 'src/app/i18n/client';
import { useModalAction } from '@components/common/modal/modal.context';
import Switch from '@components/ui/switch';
import CloseButton from '@components/ui/close-button';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { siteSettings } from '@settings/site-settings';

interface LoginFormProps {
  lang: string;
  isPopup?: boolean;
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  lang,
  isPopup = true,
  className,
}) => {
  const { t } = useTranslation(lang);
  const { closeModal, openModal } = useModalAction();
  const { mutate: login, isPending } = useLoginMutation();
  const [remember, setRemember] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputType>();

  function onSubmit({ email, password, remember_me }: LoginInputType) {
    login(
      {
        email,
        password,
        remember_me,
      },
      {
        onSuccess: (data: any) => {
          const token = data?.token ?? data?.access_token;
          if (token) {
            closeModal();
            toast.success(
              t('common:text-login-success') ||
                'You have successfully logged in.',
              {
                position: 'top-right',
                autoClose: 3000,
                toastId: 'auth-success',
              },
            );
            return;
          }
          if (data?.requires_otp) {
            openModal('OTP_VERIFICATION', { email });
            return;
          }
        },
        onError: (err: any) => {
          const requiresOtp = err?.response?.data?.requires_otp;
          if (requiresOtp) {
            openModal('OTP_VERIFICATION', { email });
            return;
          }
          const messageFromBackend =
            err?.response?.data?.message ||
            (err?.response?.data?.errors &&
              Object.values(err.response.data.errors).flat().join(' '));
          const fallback =
            t('common:text-invalid-credentials') ||
            t('common:text-something-went-wrong') ||
            'Invalid username or password. Please try again.';
          const message =
            messageFromBackend && (messageFromBackend as string).length
              ? (messageFromBackend as string)
              : fallback;
          toast.dismiss('auth-error');
          toast.error(message, {
            position: 'top-right',
            autoClose: 4000,
            toastId: 'auth-error',
          });
        },
      },
    );
  }
  function handelSocialLogin() {
    login({
      email: 'demo@demo.com',
      password: 'demo',
      remember_me: true,
    });
    closeModal();
  }
  function handleSignUp() {
    return openModal('SIGN_UP_VIEW');
  }
  function handleForgetPassword() {
    return openModal('FORGET_PASSWORD');
  }
  return (
    <div
      className={cn(
        'w-full md:w-[720px] lg:w-[920px] xl:w-[1000px] 2xl:w-[1200px] relative',
        className,
      )}
    >
      {isPopup === true && <CloseButton onClick={closeModal} />}

      <div className="flex mx-auto overflow-hidden rounded-lg bg-white border border-border-base">
        <div className="w-full py-6 sm:py-8 px-4 sm:px-8 md:px-6 lg:px-8 xl:px-10 flex flex-col justify-center">
          <div className="mb-6 text-center">
            <div onClick={closeModal}>
              <Image
                src={siteSettings.logo.url}
                alt={siteSettings.logo.alt}
                width={160}
                height={40}
                priority
                className="mx-auto"
              />
            </div>
            <h4 className="text-xl font-medium text-brand-dark sm:text-2xl sm:pt-3 ">
              {t('common:text-welcome-back')}
            </h4>
            <div className="mt-3 mb-1 text-sm text-center sm:text-15px text-body">
              {t('common:text-don’t-have-account')}
              <button
                type="button"
                className="text-sm font-medium text-brand sm:text-15px ltr:ml-1 rtl:mr-1 hover:no-underline focus:outline-none"
                onClick={handleSignUp}
              >
                {t('common:text-create-account')}
              </button>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center"
            noValidate
          >
            <div className="flex flex-col space-y-3.5">
              <Input
                label={t('forms:label-email') as string}
                type="email"
                variant="solid"
                {...register('email', {
                  required: `${t('forms:email-required')}`,
                  pattern: {
                    value:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: t('forms:email-error'),
                  },
                })}
                error={errors.email?.message}
                lang={lang}
              />
              <PasswordInput
                label={t('forms:label-password') as string}
                error={errors.password?.message}
                {...register('password', {
                  required: `${t('forms:password-required')}`,
                })}
                lang={lang}
              />
              <div className="flex items-center justify-center">
                <div className="flex items-center shrink-0">
                  <label className="relative inline-block cursor-pointer switch">
                    <Switch checked={remember} onChange={setRemember} />
                  </label>
                  <label
                    onClick={() => setRemember(!remember)}
                    className="mt-1 text-sm cursor-pointer shrink-0 text-heading ltr:pl-2.5 rtl:pr-2.5"
                  >
                    {t('forms:label-remember-me')}
                  </label>
                </div>
                <div className="flex ltr:ml-auto rtl:mr-auto mt-[3px]">
                  <button
                    type="button"
                    onClick={handleForgetPassword}
                    className="text-sm ltr:text-right rtl:text-left text-heading ltr:pl-3 lg:rtl:pr-3 hover:no-underline hover:text-brand-dark focus:outline-none focus:text-brand-dark"
                  >
                    {t('common:text-forgot-password')}
                  </button>
                </div>
              </div>
              <div className="relative">
                <Button
                  type="submit"
                  loading={isPending}
                  disabled={isPending}
                  className="w-full mt-2 tracking-normal h-11 md:h-12 font-15px md:font-15px"
                  variant="formButton"
                >
                  {(t('common:text-sign-in') || 'Sign In')?.toUpperCase()}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
