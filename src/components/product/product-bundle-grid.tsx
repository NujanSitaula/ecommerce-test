'use client';

import ProductCardAlpine from '@components/product/product-cards/product-card-alpine';
import { useProductsQuery } from '@framework/product/get-all-products';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import Alert from '@components/ui/alert';
import cn from 'classnames';
import slice from 'lodash/slice';
import { Product } from '@framework/types';

interface ProductFeedProps {
  element?: any;
  className?: string;
  lang: string;
}

export default function ProductBundleGrid({
  element,
  className = '',
  lang,
}: ProductFeedProps) {
  const limit = 35;
  const { data, isLoading, error } = useProductsQuery({
    limit: limit,
  });

  return (
    <div className={cn(className)}>
      {error ? (
        <Alert message={error?.message} />
      ) : (
        <>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 md:gap-4 2xl:gap-5">
              {Array.from({ length: 30 }).map((_, idx) => (
                <ProductCardLoader
                  key={`product-loader-key-${idx}`}
                  uniqueKey={`product-loader-key-${idx}-unique`}
                />
              ))}
            </div>
          ) : (
            <>
              {data?.pages?.map((page: any, index: number) => {
                return (
                  <div
                    key={`product-bundle-grid-${index}`}
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 md:gap-4 2xl:gap-5"
                  >
                    {page?.data
                      ?.slice(0, 21)
                      ?.map((product: Product, idx: number) => (
                        <ProductCardAlpine
                          key={`product-card-key-${product.id}-${idx * 2.5}`}
                          product={product}
                          lang={lang}
                        />
                      ))}
                    {element && <div className="col-span-full">{element}</div>}
                    {page?.data?.length! > 21 &&
                      slice(page?.data, 21, page?.data?.length).map(
                        (product: any, idx: number) => (
                          <ProductCardAlpine
                            key={`product-key-alpine${product.id}-${idx}`}
                            product={product}
                            lang={lang}
                          />
                        ),
                      )}
                  </div>
                );
              })}
            </>
          )}
        </>
      )}
    </div>
  );
}
