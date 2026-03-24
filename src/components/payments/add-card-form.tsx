import CloseButton from '@components/ui/close-button';
import Button from '@components/ui/button';
import Input from '@components/ui/form/input';
import {
  CardElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import {
  useCreateSetupIntentMutation,
  useConfirmPaymentMethodMutation,
} from '@framework/payment/payment-methods';
import { useEffect, useState } from 'react';
import {
  useModalAction,
} from '@components/common/modal/modal.context';

interface AddCardFormProps {
  makeDefault?: boolean;
  buttonText: string;
  lang: string;
}

const AddCardForm: React.FC<AddCardFormProps> = ({
  makeDefault = true,
  buttonText,
  lang,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { mutateAsync: createSetupIntent } = useCreateSetupIntentMutation();
  const { mutateAsync: confirmPaymentMethod, status } =
    useConfirmPaymentMethodMutation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [clientSecretError, setClientSecretError] = useState<string | null>(
    null,
  );
  const [cardholderName, setCardholderName] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { closeModal } = useModalAction();

  useEffect(() => {
    async function init() {
      try {
        const data = await createSetupIntent();
        setClientSecret(data.client_secret);
      } catch (e: any) {
        setClientSecretError(
          e?.response?.data?.message ||
            'Unable to initialize card setup. Please try again.',
        );
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    setSubmitError(null);
    if (!stripe || !elements) {
      setSubmitError('Payment form is not ready yet.');
      return;
    }
    if (!clientSecret) {
      setSubmitError('Unable to start card setup. Please reload and try again.');
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setSubmitError('Card element not found.');
      return;
    }

    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: cardholderName ? { name: cardholderName } : undefined,
      },
    });

    if (result.error || !result.setupIntent?.payment_method) {
      setSubmitError(
        result.error?.message || 'Something went wrong while saving the card.',
      );
      return;
    }

    await confirmPaymentMethod({
      payment_method_id: result.setupIntent.payment_method as string,
      make_default: makeDefault,
    });

    closeModal();
  };

  return (
    <div className="w-full md:w-[510px] mx-auto p-5 sm:p-8 bg-brand-light rounded-md">
      <CloseButton onClick={closeModal} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        noValidate
      >
        <div className="mb-6">
          <Input
            variant="solid"
            label="Name on card"
            name="cardholder_name"
            value={cardholderName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCardholderName(e.target.value)
            }
            lang={lang}
          />
        </div>
        <div className="mb-4 rounded border border-border-base px-3 py-2 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#0F172A',
                  '::placeholder': { color: '#9CA3AF' },
                },
                invalid: { color: '#EF4444' },
              },
            }}
            onChange={(event) => {
              if (event.error) {
                setSubmitError(event.error.message || null);
              } else if (event.complete) {
                setSubmitError(null);
              }
            }}
          />
        </div>
        {(clientSecretError || submitError) && (
          <p className="mt-2 text-sm text-red-500">
            {clientSecretError || submitError}
          </p>
        )}
        <Button
          className="h-11 md:h-12 w-full mt-4"
          type="submit"
          variant="formButton"
          loading={status === 'pending'}
          disabled={status === 'pending' || !clientSecret}
        >
          {buttonText}
        </Button>
      </form>
    </div>
  );
};

export default AddCardForm;


