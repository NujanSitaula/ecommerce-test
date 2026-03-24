'use client';

import Modal from '@components/common/modal/modal';
import { StripeProvider } from '@components/payments/stripe-provider';
import dynamic from 'next/dynamic';
import {
  useModalAction,
  useModalState,
} from '@components/common/modal/modal.context';
const LoginForm = dynamic(() => import('@components/auth/login-form'));
const SignUpForm = dynamic(() => import('@components/auth/sign-up-form'));
const ForgetPasswordForm = dynamic(
  () => import('@components/auth/forget-password-form'),
);
const ProductPopup = dynamic(() => import('@components/product/product-popup'));
const AddressPopup = dynamic(
  () => import('@components/common/form/add-address'),
);
const PaymentPopup = dynamic(
  () => import('@components/common/form/add-payment'),
);
const CardPopup = dynamic(
  () => import('@components/payments/add-card-form'),
);
const PhoneNumberPopup = dynamic(
  () => import('@components/common/form/add-contact'),
);
const DeliveryAddresses = dynamic(
  () => import('@components/address/delivery-addresses'),
);
const CategoryPopup = dynamic(
  () => import('@components/category/category-popup'),
);
const OtpVerificationForm = dynamic(
  () => import('@components/auth/otp-verification-form'),
);

export default function ManagedModal({ lang }: { lang: string }) {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();

  if (view === 'CATEGORY_VIEW') {
    return (
      <Modal open={isOpen} onClose={closeModal} variant="bottom">
        {view === 'CATEGORY_VIEW' && <CategoryPopup lang={lang} />}
      </Modal>
    );
  }

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {view === 'LOGIN_VIEW' && <LoginForm lang={lang} />}
      {view === 'SIGN_UP_VIEW' && <SignUpForm lang={lang} />}
      {view === 'FORGET_PASSWORD' && <ForgetPasswordForm lang={lang} />}
      {view === 'PRODUCT_VIEW' && <ProductPopup lang={lang} />}
      {view === 'ADDRESS_VIEW_AND_EDIT' && <AddressPopup lang={lang} />}
      {view === 'PAYMENT' && <PaymentPopup lang={lang} />}
      {view === 'CARD_VIEW' && (
        <StripeProvider>
          <CardPopup lang={lang} buttonText="Save card" />
        </StripeProvider>
      )}
      {view === 'PHONE_NUMBER' && <PhoneNumberPopup lang={lang} />}
      {view === 'DELIVERY_VIEW' && <DeliveryAddresses lang={lang} />}
      {view === 'OTP_VERIFICATION' && (
        <OtpVerificationForm
          lang={lang}
          email={data?.email}
          mode={data?.mode ?? 'signup'}
        />
      )}
    </Modal>
  );
}
