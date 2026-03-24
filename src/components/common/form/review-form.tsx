import { useState } from 'react';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import TextArea from '@components/ui/form/text-area';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import cn from 'classnames';
import Rate from '@components/ui/rate';
import { useTranslation } from 'src/app/i18n/client';
import http from '@framework/utils/http';
import { toast } from 'react-toastify';
import { useProfileQuery } from '@framework/contact/contact';

interface ReviewFormProps {
  className?: string;
  lang: string;
  productSlug: string;
  onSubmitted?: () => void;
}
interface ReviewFormValues {
  message: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  lang,
  className = '',
  productSlug,
  onSubmitted,
}) => {
  const { t } = useTranslation(lang);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormValues>();
  const [rating_custom_icon, set_rating_custom_icon] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: profile } = useProfileQuery() as { data?: any };
  const reviewerName = profile?.name ?? 'Customer';
  const reviewerEmail = profile?.email ?? '';

  async function onSubmit(values: ReviewFormValues) {
    setIsSubmitting(true);
    try {
      await http.post(`/api/products/${productSlug}/reviews`, {
        rating: rating_custom_icon,
        title: '',
        message: values.message,
        name: reviewerName,
        email: reviewerEmail,
      });

      toast.success('Your review is submitted and pending admin approval.');
      reset();
      onSubmitted?.();
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        'Failed to submit review.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn(className)}>
      <Heading className="mb-2">Write your review</Heading>
      <Text>
        Your review helps other shoppers make better decisions.
      </Text>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center w-full mx-auto mt-5 lg:mt-7 xl:mt-9"
        noValidate
      >
        <div className="flex flex-col space-y-5 md:space-y-6 lg:space-y-7">
          <div className="rounded-md border border-border-base bg-gray-50 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
              You are reviewing as
            </p>
            <p className="mb-0 text-sm text-brand-dark">{reviewerName}</p>
            <p className="mb-0 text-xs text-brand-muted">{reviewerEmail}</p>
            <p className="mb-0 mt-1 text-xs text-brand-muted">
              This information may be shown publicly.
            </p>
          </div>
          <div className="pb-1.5 flex items-center">
            <label className="block text-sm leading-none cursor-pointer shrink-0 text-brand-dark md:text-15px ltr:pr-3 rtl:pl-3">
              {t('forms:label-your-rating')}
            </label>
            <Rate
              size="lg"
              defaultValue={1}
              value={rating_custom_icon}
              className="-mb-2"
              onChange={(value) => set_rating_custom_icon(value)}
            />
          </div>
          <TextArea
            variant="solid"
            label="forms:label-message-star"
            {...register('message', { required: 'Message is required' })}
            error={errors.message?.message}
            lang={lang}
          />
          <div className="pt-1">
            <Button
              type="submit"
              className="w-full h-12 text-sm md:mt-1 lg:text-base sm:w-auto"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {t('common:button-submit')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
