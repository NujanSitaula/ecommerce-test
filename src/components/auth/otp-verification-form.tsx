'use client';

import { useForm } from 'react-hook-form';
import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import Logo from '@components/ui/logo';
import { useModalAction } from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import cn from 'classnames';
import { useVerifyOtpMutation } from '@framework/auth/use-verify-otp';
import { useResendOtpMutation } from '@framework/auth/use-resend-otp';
import { useTranslation } from 'src/app/i18n/client';

interface OtpVerificationFormProps {
  lang: string;
  email: string;
  mode?: 'signup' | 'email-change';
  isPopup?: boolean;
  className?: string;
}

interface OtpFormValues {
  code: string;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  lang,
  email,
  mode = 'signup',
  isPopup = true,
  className,
}) => {
  const { t } = useTranslation(lang);
  const { closeModal } = useModalAction();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>();

  const { mutate: verifyOtp, isPending } = useVerifyOtpMutation();
  const { mutate: resendOtp, isPending: isResending } = useResendOtpMutation();

  function onSubmit({ code }: OtpFormValues) {
    verifyOtp({ email, code, mode });
  }

  function handleResend() {
    resendOtp({ email, mode });
  }

  return (
    <div
      className={cn(
        'w-full md:w-[720px] lg:w-[920px] xl:w-[1000px] 2xl:w-[1200px] relative',
        className,
      )}
    >
      {isPopup === true && <CloseButton onClick={closeModal} />}

      <div className="flex mx-auto overflow-hidden rounded-lg bg-brand-light">
        <div className="w-full py-6 sm:py-10 px-4 sm:px-8 md:px-6 lg:px-8 xl:px-12 rounded-md flex flex-col justify-center">
          <div className="mb-6 text-center">
            <div onClick={closeModal}>
              <Logo />
            </div>
            <h4 className="text-xl font-semibold text-brand-dark sm:text-2xl sm:pt-3 ">
              {mode === 'email-change'
                ? 'Verify your new email'
                : t('common:text-verify-your-email') || 'Verify your email'}
            </h4>
            <div className="mt-3 mb-1 text-sm text-center sm:text-15px text-body">
              <span className="block">
                {t('common:text-we-sent-otp-to') || 'We have sent a code to'}
              </span>
              <span className="font-semibold text-brand-dark">{email}</span>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center"
            noValidate
          >
            <div className="flex flex-col space-y-4">
              <Input
                label={t('forms:label-otp-code') || 'Verification code'}
                type="text"
                variant="solid"
                {...register('code', {
                  required: 'forms:otp-required',
                })}
                error={errors.code?.message}
                lang={lang}
              />
              <div className="relative">
                <Button
                  type="submit"
                  loading={isPending}
                  disabled={isPending}
                  className="w-full mt-2 tracking-normal h-11 md:h-12 font-15px md:font-15px"
                  variant="formButton"
                >
                  {t('common:text-verify') || 'Verify'}
                </Button>
              </div>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="mt-2 text-sm font-semibold text-brand hover:text-brand-dark focus:outline-none"
              >
                {t('common:text-resend-code') || 'Resend code'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationForm;


