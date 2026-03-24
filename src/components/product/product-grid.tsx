import type { FC } from 'react';
import { Suspense } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Alert from '@components/ui/alert';
import Button from '@components/ui/button';
import ProductCardAlpine from '@components/product/product-cards/product-card-alpine';
import ProductCardBasel from '@components/product/product-cards/product-card-basel';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import cn from 'classnames';
import { useDynamicProductsQuery } from '@framework/product/get-all-dynamic-products';
import { Product } from '@framework/types';
import { useCategoriesQuery } from '@framework/category/get-all-categories';
import { useTranslation } from 'src/app/i18n/client';
import { PiPackageLight } from 'react-icons/pi';

interface ProductGridProps {
  lang: string;
  className?: string;
  onCountChange?: (count: number) => void;
  sort?: string;
  variant?: 'alpine' | 'basel';
  activeCategory?: string;
  emptyMessage?: string;
}

const ProductGridInner: FC<ProductGridProps> = ({
  className = '',
  lang,
  onCountChange,
  sort,
  variant = 'alpine',
  activeCategory,
  emptyMessage,
}) => {
  const { t } = useTranslation(lang, 'common');
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams?.get('search') ?? undefined;
  const categoryFromUrl = searchParams?.get('category') ?? undefined;
  const minPriceFromUrl = searchParams?.get('min_price') ?? undefined;
  const maxPriceFromUrl = searchParams?.get('max_price') ?? undefined;

  // Prefer explicitly passed category, then fall back to URL param
  const effectiveCategory = activeCategory || categoryFromUrl || undefined;

  const { data: categoriesData } = useCategoriesQuery({ limit: 200 });
  const allCategories = categoriesData?.categories?.data ?? [];

  const { categoryParam, categoryIdParam } = useMemo(() => {
    const raw = (effectiveCategory ?? '').trim();
    if (!raw) return { categoryParam: undefined, categoryIdParam: undefined };

    const parts = raw
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    const slugs: string[] = [];
    const ids: number[] = [];

    for (const p of parts) {
      if (/^\d+$/.test(p)) {
        ids.push(parseInt(p, 10));
      } else {
        slugs.push(p);
      }
    }

    // If we only have slugs, try to resolve to ids via categories list
    if (slugs.length) {
      const resolved = slugs
        .map((slug) => allCategories.find((c: any) => c?.slug === slug)?.id)
        .filter((id): id is number => typeof id === 'number' && !Number.isNaN(id));
      ids.push(...resolved);
    }

    return {
      categoryParam: parts.join(','),
      categoryIdParam: ids.length ? Array.from(new Set(ids)).join(',') : undefined,
    };
  }, [effectiveCategory, allCategories]);

  const rawPage = searchParams?.get('page') ?? '';
  const currentPage =
    rawPage && !Number.isNaN(parseInt(rawPage, 10))
      ? Math.max(1, parseInt(rawPage, 10))
      : 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (!page || page <= 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(url, { scroll: false });
  };

  const pageSize = 20; // paginate 20 per page for search
  const queryOptions = {
    sort,
    pageSize,
    ...(search ? { search } : {}),
    ...(categoryParam ? { category: categoryParam } : {}),
    ...(categoryIdParam ? { category_id: categoryIdParam } : {}),
    ...(minPriceFromUrl ? { min_price: minPriceFromUrl } : {}),
    ...(maxPriceFromUrl ? { max_price: maxPriceFromUrl } : {}),
  };

  const {
    isFetching: isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    data,
    error,
  } = useDynamicProductsQuery({
    // @ts-ignore
    ...queryOptions,
  });

  const requestedPageIndex = Math.max(0, currentPage - 1);
  const pagesLength = data?.pages?.length ?? 0;
  const isRequestedPageLoaded = requestedPageIndex < pagesLength;

  // Keep last fully-loaded page rendered to avoid flicker when navigating
  const [renderedPageIndex, setRenderedPageIndex] = useState(0);

  useEffect(() => {
    if (variant !== 'basel') return;

    // If user navigates back to already loaded page, switch immediately
    if (requestedPageIndex < pagesLength) {
      setRenderedPageIndex(requestedPageIndex);
      return;
    }
    // Otherwise keep rendering the last loaded page until new one arrives
  }, [variant, requestedPageIndex, pagesLength]);

  const totalItems =
    data?.pages?.reduce(
      (sum: number, page: any) => sum + (page?.data?.length || 0),
      0,
    ) ?? 0;

  // For Basel variant, prefetch pages up to the requested page index
  useEffect(() => {
    if (variant !== 'basel') return;
    const loadedPages = data?.pages?.length ?? 0;
    if (currentPage > loadedPages && hasNextPage && !loadingMore) {
      fetchNextPage();
    }
  }, [variant, currentPage, data?.pages?.length, hasNextPage, loadingMore, fetchNextPage]);

  const baselPageProducts = useMemo(() => {
    if (variant !== 'basel') return [];
    const idx = Math.max(0, Math.min(renderedPageIndex, pagesLength - 1));
    const page = data?.pages?.[idx];
    const products: Product[] = page?.data ?? [];
    return products;
  }, [variant, renderedPageIndex, pagesLength, data?.pages]);

  const hasNoProducts =
    !isLoading &&
    !error &&
    (variant === 'basel'
      ? baselPageProducts.length === 0
      : (data?.pages?.reduce(
          (sum: number, page: any) => sum + (page?.data?.length ?? 0),
          0,
        ) ?? 0) === 0);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(totalItems);
    }
  }, [onCountChange, totalItems]);

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3 md:gap-4 2xl:gap-5',
          className,
        )}
      >
        {error ? (
          <div className="col-span-full">
            <Alert message={error?.message} />
          </div>
        ) : isLoading && !data?.pages?.length ? (
          Array.from({ length: 30 }).map((_, idx) => (
            <ProductCardLoader
              key={`product--key-${idx}`}
              uniqueKey={`product--key-${idx}`}
            />
          ))
        ) : hasNoProducts ? (
          <div className="col-span-full py-5">
            <div className="d-flex flex-column align-items-center justify-content-center text-center border rounded-3 p-4 p-md-5 bg-white">
              <PiPackageLight className="text-muted mb-2" size={34} />
              <h5 className="mb-1">No products found</h5>
              <p className="text-muted mb-0">
                {emptyMessage || 'No products in this category yet.'}
              </p>
            </div>
          </div>
        ) : variant === 'basel' ? (
          baselPageProducts.map((product: Product) => (
            <ProductCardBasel
              key={`product--key-${product.id}`}
              product={product}
              lang={lang}
            />
          ))
        ) : (
          data?.pages?.map((page: any) => {
            return page?.data?.map((product: Product) => (
              <ProductCardAlpine
                key={`product--key-${product.id}`}
                product={product}
                lang={lang}
              />
            ));
          })
        )}
        {/* end of error state */}
      </div>
      {variant === 'basel' && !isRequestedPageLoaded && (
        <div className="pt-3 text-end small text-muted">
          Loading page {currentPage}…
        </div>
      )}
      {variant === 'basel' && !hasNoProducts ? (
        (() => {
          const lastPage =
            (data?.pages?.[data.pages.length - 1]?.paginatorInfo
              ?.lastPage as number) ?? 1;
          if (!lastPage || lastPage <= 1) return null;

          const pages = Array.from({ length: lastPage }, (_, idx) => idx + 1);

          return (
            <nav
              className="pt-4 d-flex justify-content-end basel-paginationWrap"
              aria-label="Products pagination"
            >
              <ul className="pagination mb-0 basel-pagination">
                {pages.map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      page === currentPage ? 'active' : ''
                    }`}
                  >
                    <button
                      type="button"
                      className="page-link basel-pageLink"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })()
      ) : !hasNoProducts ? (
        hasNextPage && (
          <div className="pt-8 text-center xl:pt-10">
            <Button
              loading={loadingMore}
              disabled={loadingMore}
              onClick={() => fetchNextPage()}
            >
              {t('button-load-more')}
            </Button>
          </div>
        )
      ) : null}
    </>
  );
};

export const ProductGrid: FC<ProductGridProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3 md:gap-4 2xl:gap-5">
          {Array.from({ length: 10 }).map((_, idx) => (
            <ProductCardLoader
              key={`product-suspense-loader-${idx}`}
              uniqueKey={`product-suspense-loader-${idx}`}
            />
          ))}
        </div>
      }
    >
      <ProductGridInner {...props} />
    </Suspense>
  );
};
