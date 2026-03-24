import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import ReviewCard from '@components/cards/review-card';
import ReviewForm from '@components/common/form/review-form';
import http from '@framework/utils/http';
import { getToken } from '@framework/utils/get-token';
import { useModalAction } from '@components/common/modal/modal.context';
import Button from '@components/ui/button';

type ReviewItem = {
  id: string | number;
  rating: number;
  title: string | null;
  description: string;
  author: string;
};

const ProductReviewRating: FC<{ lang: string; productSlug: string }> = ({
  lang,
  productSlug,
}) => {
  const { openModal } = useModalAction();

  const {
    data: reviewsResponse,
    isLoading,
    error,
  } = useQuery<ReviewItem[], Error>({
    queryKey: ['product-reviews', productSlug],
    enabled: Boolean(productSlug),
    queryFn: async () => {
      const res = await http.get(`/api/products/${productSlug}/reviews`, {
        params: { limit: 10 },
      });
      const payload = (res.data as any)?.data ?? res.data;
      return (Array.isArray(payload) ? payload : []) as ReviewItem[];
    },
  });

  const reviews = reviewsResponse ?? [];
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getToken()));
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:gap-x-10">
      <div className="pt-2 lg:w-1/2">
        {error ? (
          <p className="text-sm text-brand-muted">
            {error?.message || 'Failed to load reviews.'}
          </p>
        ) : isLoading ? (
          <p className="text-sm text-brand-muted">Loading reviews...</p>
        ) : reviews.length ? (
          reviews.map((item) => (
            <ReviewCard
              item={item}
              key={`review-key-${item.id}`}
              lang={lang}
            />
          ))
        ) : (
          <p className="text-sm text-brand-muted">No reviews yet.</p>
        )}
      </div>
      <div className="pt-10 lg:pt-0 lg:w-1/2">
        {isLoggedIn ? (
          <ReviewForm
            className="lg:ltr:pl-10 lg:rtl:pr-10 shrink-0 pt-0"
            lang={lang}
            productSlug={productSlug}
          />
        ) : (
          <div className="border border-border-four rounded-lg p-6">
            <div className="text-brand-dark font-semibold text-lg mb-2">
              Login to review
            </div>
            <div className="text-sm text-brand-muted mb-4">
              Please sign in to write a review for this product.
            </div>
            <Button
              type="button"
              variant="primary"
              className="w-full"
              onClick={() => openModal('LOGIN_VIEW')}
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviewRating;
