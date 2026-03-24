'use client';

import SectionHeader from '@components/common/section-header';
import ProductCardMaple from '@components/product/product-cards/product-card-maple';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import { LIMITS } from '@framework/utils/limits';
import Alert from '@components/ui/alert';
import cn from 'classnames';
import { useBestSellerGroceryProductsQuery } from '@framework/product/get-all-best-seller-grocery-products';
import Link from '@components/ui/link';
import { ROUTES } from '@utils/routes';
import { useTranslation } from 'src/app/i18n/client';

interface BestSellerProps {
  className?: string;
  lang: string;
}

const options = {
  slidesPerView: 1,
  spaceBetween: 15,
  grid: {
    rows: 2,
    fill: 'row',
  },
  breakpoints: {
    768: {
      slidesPerView: 1,
      grid: {
        rows: 2,
      },
    },
    820: {
      slidesPerView: 1,
      grid: {
        rows: 3,
      },
    },
    1024: {
      slidesPerView: 1,
      grid: {
        rows: 3,
      },
    },
    1280: {
      slidesPerView: 2,
      grid: {
        rows: 3,
      },
    },
    1400: {
      slidesPerView: 2,
      grid: {
        rows: 3,
      },
    },
    1536: {
      slidesPerView: 2,
      grid: {
        rows: 3,
      },
    },
    1700: {
      slidesPerView: 3,
      spaceBetween: 20,
      grid: {
        rows: 3,
        fill: 'row',
      },
    },
  },
};

const BestSellerGroceryProductFeedTwo: React.FC<BestSellerProps> = ({
  className,
  lang,
}) => {
  const { t } = useTranslation(lang, 'common');
  const limit = LIMITS.POPULAR_PRODUCTS_TWO_LIMITS;
  const { data, isLoading, error } = useBestSellerGroceryProductsQuery({
    limit: limit,
  });

  return (
    <div className={cn('-mt-2.5 mb-10', className)}>
      <SectionHeader
        sectionHeading="text-new-arrival"
        headingPosition="center"
        className="pb-6 lg:mb-4 xl:mb-2.5"
        lang={lang}
      />
      {error && <Alert message={error?.message} />}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-2 3xl:grid-cols-3 md:gap-4 2xl:gap-5">
        {!data?.length && isLoading
          ? Array.from({ length: limit! }).map((_, idx) => (
              <ProductCardLoader
                key={`popular-product-${idx}`}
                uniqueKey={`popular-product-${idx}`}
              />
            ))
          : data
              ?.slice(1, 10)
              ?.map((product: any) => (
                <ProductCardMaple
                  product={product}
                  key={`popular-product-${product.id}`}
                  lang={lang}
                />
              ))}
      </div>
      <div className="flex justify-center mt-6 md:mt-8">
        <Link
          href={`/${lang}${ROUTES?.SEARCH}`}
          className="text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-body font-semibold text-center justify-center rounded placeholder-white focus-visible:outline-none focus:outline-none h-12 bg-brand text-brand-light tracking-[0.2px] px-5 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-opacity-90"
        >
          {t('text-view-all')}
        </Link>
      </div>
    </div>
  );
};

export default BestSellerGroceryProductFeedTwo;
