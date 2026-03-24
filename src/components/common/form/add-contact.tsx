import CloseButton from '@components/ui/close-button';
import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import {
  useModalState,
  useModalAction,
} from '@components/common/modal/modal.context';
import { useTranslation } from 'src/app/i18n/client';
import { useCreateOrUpdateContactNumberMutation } from '@framework/contact/contact';

interface ContactFormValues {
  title: string;
  phone: string;
  is_default: boolean;
}

const AddContactForm: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang);
  const { data } = useModalState();
  const { closeModal } = useModalAction();
  const { mutateAsync, isPending: isLoading } =
    useCreateOrUpdateContactNumberMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      title: data?.title ?? '',
      phone: data?.phone ?? '',
      is_default: data?.is_default ?? false,
    },
  });

  async function onSubmit(values: ContactFormValues) {
    await mutateAsync({
      id: data?.id,
      title: values.title,
      phone: values.phone,
      is_default: values.is_default,
    });
    closeModal();
  }

  return (
    <div className="w-full md:w-[510px] mx-auto p-5 sm:p-8 bg-brand-light rounded-md">
      <CloseButton onClick={closeModal} />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-6">
          <Input
            variant="solid"
            label="forms:label-contact-title"
            {...register('title')}
            error={errors.title?.message}
            lang={lang}
          />
        </div>
        <div className="mb-6">
          <Input
            variant="solid"
            label="forms:label-contact-number"
            {...register('phone', {
              required: 'forms:contact-number-required',
            })}
            error={errors.phone?.message}
            lang={lang}
          />
        </div>
        <div className="mb-6">
          <input
            id="default-contact-number"
            type="checkbox"
            className="w-5 h-5 transition duration-500 ease-in-out border border-gray-300 rounded cursor-pointer form-checkbox focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none focus:checked:bg-brand hover:checked:bg-brand checked:bg-brand"
            {...register('is_default')}
          />
          <label
            htmlFor="default-contact-number"
            className="text-sm align-middle cursor-pointer ltr:ml-3 rtl:mr-3 text-brand-muted"
          >
            {t('common:text-default-contact-number')}
          </label>
        </div>
        <Button
          className="h-11 md:h-12 w-full mt-1.5"
          type="submit"
          loading={isLoading}
        >
          {t('common:text-save-number')}
        </Button>
      </form>
    </div>
  );
};

export default AddContactForm;
