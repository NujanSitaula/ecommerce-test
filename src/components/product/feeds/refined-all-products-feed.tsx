import { Fragment, FC } from 'react';
import ProductCardAlpine from '@components/product/product-cards/product-card-alpine';
import { useProductsQuery } from '@framework/product/get-all-products';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import SectionHeader from '@components/common/section-header';
import { useModalAction } from '@components/common/modal/modal.context';
import Alert from '@components/ui/alert';
import cn from 'classnames';
import { useTranslation } from 'src/app/i18n/client';
import { usePathname, useRouter } from 'next/navigation';
import { LIMITS } from '@framework/utils/limits';
import { Product } from '@framework/types';
import useQueryParam from '@utils/use-query-params';
interface ProductFeedProps {
  lang: string;
  className?: string;
}
const RefinedAllProductFeed: FC<ProductFeedProps> = ({
  lang,
  className = '',
}) => {
  const { t } = useTranslation(lang, 'common');
  const pathname = usePathname();
  const { getParams, query } = useQueryParam(pathname ?? '/');
  const newQuery: any = getParams(
    // @ts-ignore
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}${query}`,
  );
  const {
    isFetching: isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    data,
    error,
  } = useProductsQuery({
    limit: LIMITS.REFINED_PRODUCTS_LIMITS,
    // @ts-ignore
    newQuery,
  });

  const { openModal } = useModalAction();

  function handleCategoryPopup() {
    openModal('CATEGORY_VIEW');
  }

  return (
    <div className={cn(className)}>
      <div className="xl:hidden flex items-center justify-between pb-0.5 mb-4 lg:mb-5 xl:mb-6">
        <SectionHeader
          sectionHeading="All Products"
          className="mb-0"
          lang={lang}
        />
        <div
          className="transition-all text-brand -mt-1.5 font-semibold text-sm md:text-15px hover:text-brand-dark"
          role="button"
          onClick={handleCategoryPopup}
        >
          {t('text-categories')}
        </div>
      </div>
      {error ? (
        <Alert message={error?.message} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 3xl:grid-cols-4 md:gap-4 2xl:gap-5">
          {isLoading && !data?.pages?.length ? (
            Array.from({ length: LIMITS.REFINED_PRODUCTS_LIMITS }).map(
              (_, idx) => (
                <ProductCardLoader
                  key={`product--key-${idx}`}
                  uniqueKey={`product--key-${idx}`}
                />
              ),
            )
          ) : (
            <>
              {data?.pages?.map((page: any, index) => {
                return (
                  <Fragment key={index}>
                    {page?.data
                      ?.slice(0, LIMITS.REFINED_PRODUCTS_LIMITS)
                      ?.map((product: Product) => (
                        <ProductCardAlpine
                          key={`product--key${product.id}`}
                          product={product}
                          lang={lang}
                        />
                      ))}
                  </Fragment>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RefinedAllProductFeed;
