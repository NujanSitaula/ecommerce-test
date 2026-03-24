import SectionHeader from '@components/common/section-header';
import ProductCardAlpine from '@components/product/product-cards/product-card-alpine';
import { Product } from '@framework/types';
import Carousel from '@components/ui/carousel/carousel';
import { SwiperSlide } from '@components/ui/carousel/slider';
import Alert from '@components/ui/alert';
import SeeAll from '@components/ui/see-all';
import useWindowSize from '@utils/use-window-size';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import cn from 'classnames';
import { getDirection } from '@utils/get-direction';
import { useState } from 'react';

interface ProductsCarouselProps {
  sectionHeading: string;
  categorySlug?: string;
  className?: string;
  products?: Product[];
  loading: boolean;
  error?: string;
  limit?: number;
  uniqueKey?: string;
  carouselBreakpoint?: {} | any;
  lang: string;
}

const breakpoints = {
  '1921': {
    slidesPerView: 7,
  },
  '1780': {
    slidesPerView: 8,
  },
  '1536': {
    slidesPerView: 7,
  },
  '1280': {
    slidesPerView: 6,
  },
  '1024': {
    slidesPerView: 4,
  },
  '640': {
    slidesPerView: 3,
  },
  '360': {
    slidesPerView: 2,
  },
  '0': {
    slidesPerView: 1,
  },
};

const ProductsCarousel: React.FC<ProductsCarouselProps> = ({
  sectionHeading,
  categorySlug,
  className = 'mb-8 lg:mb-10 xl:mb-12',
  products,
  loading,
  error,
  limit,
  uniqueKey,
  carouselBreakpoint,
  lang,
}) => {
  const { width } = useWindowSize();
  const dir = getDirection(lang);
  const [sliderEnd, setSliderEnd] = useState(false);

  // console.log('sliderEnd', sliderEnd)

  return (
    <div
      className={cn(
        'max-w-[1920px] overflow-hidden 4xl:overflow-visible px-4 md:px-6 lg:px-8 2xl:ltr:pl-10 2xl:rtl:pr-10 2xl:ltr:pr-0 2xl:rtl:pl-0 4xl:ltr:pr-10 4xl:rtl:pl-10 mx-auto relative',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between mb-5 md:mb-6">
        <SectionHeader
          sectionHeading={sectionHeading}
          className="mb-0"
          lang={lang}
        />
      </div>
      {error ? (
        <div className="2xl:ltr:pr-10 2xl:rtl:pl-10">
          <Alert message={error} />
        </div>
      ) : (
        <div
          className={cn(
            'heightFull relative',
            dir === 'rtl'
              ? 'xl:-ml-40 2xl:-ml-28 4xl:ml-0'
              : 'xl:-mr-40 2xl:-mr-28 4xl:mr-0',
            !sliderEnd && 'after-item-opacity',
          )}
        >
          <Carousel
            breakpoints={carouselBreakpoint || breakpoints}
            className="-mx-1.5 md:-mx-2 xl:-mx-2.5 -mt-4"
            prevButtonClassName="ltr:-left-2 rtl:-right-2 md:ltr:-left-1 md:rtl:-right-1.5 lg:ltr:-left-2 rtl:-right-2 xl:ltr:-left-2.5 xl:rtl:-right-2.5 2xl:ltr:left-5 2xl:rtl:right-5 -top-12 3xl:top-auto 3xl:-translate-y-2"
            nextButtonClassName="xl:rtl:-translate-x-2.5 xl:lrt:translate-x-2.5 end-2 xl:end-40 -top-12 3xl:top-auto transform 2xl:translate-x-0 3xl:-translate-y-2 4xl:end-14"
            lang={lang}
            onSlideChange={(swiper) =>
              swiper.isEnd ? setSliderEnd(true) : setSliderEnd(false)
            }
          >
            {loading && !products?.length ? (
              Array.from({ length: limit! }).map((_, idx) => (
                <SwiperSlide
                  key={`${uniqueKey}-${idx}`}
                  className="px-1.5 md:px-2 xl:px-2.5 py-4"
                >
                  <ProductCardLoader uniqueKey={`${uniqueKey}-${idx}`} />
                </SwiperSlide>
              ))
            ) : (
              <>
                {products?.map((product: any, idx) => (
                  <SwiperSlide
                    key={`${uniqueKey}-${idx}`}
                    className="px-1.5 md:px-2 xl:px-2.5 py-4"
                  >
                    <ProductCardAlpine product={product} lang={lang} />
                  </SwiperSlide>
                ))}
                <SwiperSlide className="p-2.5 flex items-center justify-center">
                  <SeeAll href={categorySlug} lang={lang} />
                </SwiperSlide>
                {width! > 1024 && width! < 1921 && <SwiperSlide />}
              </>
            )}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default ProductsCarousel;
