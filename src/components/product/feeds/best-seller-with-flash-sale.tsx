'use client';

import { usePopularProductsQuery } from '@framework/product/get-all-popular-products';
import SectionHeader from '@components/common/section-header';
import ProductCardMaple from '@components/product/product-cards/product-card-maple';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import { LIMITS } from '@framework/utils/limits';
import Alert from '@components/ui/alert';
import ProductFlashSaleGobies from '@components/product/product-cards/product-flash-sale-gobies';
import cn from 'classnames';
import Carousel from '@components/ui/carousel/carousel';
import { SwiperSlide } from 'swiper/react';
import useWindowSize from '@utils/use-window-size';

interface BestSellerProps {
  lang: string;
  className?: string;
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

export default function BestSellerWithFlashSale({
  lang,
  className,
}: BestSellerProps) {
  const { width } = useWindowSize();
  const limit = LIMITS.POPULAR_PRODUCTS_TWO_LIMITS;
  const { data, isLoading, error } = usePopularProductsQuery({
    limit: limit,
  });

  return (
    <div className={cn('-mt-2.5 mb-12 lg:mb-14 xl:mb-16 2xl:mb-20', className)}>
      <SectionHeader
        sectionHeading="text-best-grocery-near-you"
        sectionSubHeading="text-fresh-grocery-items"
        headingPosition="center"
        lang={lang}
      />
      <div className="grid grid-cols-1 gap-y-6 md:gap-5 md:grid-cols-2 xl:grid-cols-12 lg:gap-5 xl:gap-7">
        <div className="grid grid-cols-1 gap-3 3xl:grid-cols-3 xl:col-span-8 3xl:col-span-9 md:gap-4 2xl:gap-5">
          {error ? (
            <Alert message={error?.message} className="col-span-full" />
          ) : width! < 1780 ? (
            <Carousel {...options} lang={lang}>
              {isLoading
                ? Array.from({ length: limit! }).map((_, idx) => (
                    <SwiperSlide key={`popular-product-${idx}`}>
                      <ProductCardLoader uniqueKey={`popular-product-${idx}`} />
                    </SwiperSlide>
                  ))
                : data?.slice(1, 10)?.map((product: any) => (
                    <SwiperSlide key={`popular-product-${product.id}`}>
                      <ProductCardMaple product={product} lang={lang} />
                    </SwiperSlide>
                  ))}
            </Carousel>
          ) : isLoading ? (
            Array.from({ length: limit! }).map((_, idx) => (
              <ProductCardLoader
                key={`popular-product-${idx}`}
                uniqueKey={`popular-product-${idx}`}
              />
            ))
          ) : (
            data
              ?.slice(1, 10)
              ?.map((product: any) => (
                <ProductCardMaple
                  product={product}
                  key={`popular-product-${product.id}`}
                  lang={lang}
                />
              ))
          )}
        </div>
        <div className="md:top-16 lg:top-20 xl:col-span-4 3xl:col-span-3 mb-3 md:mb-0 rounded bg-[#F2F1EF]">
          <ProductFlashSaleGobies
            product={data?.[0]!}
            date={Date.now() + 4000000 * 60}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
