'use client';

import BundleCard from '@components/cards/bundle-card';
import useWindowSize from '@utils/use-window-size';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import { SwiperSlide } from '@components/ui/carousel/slider';
import { ROUTES } from '@utils/routes';
const Carousel = dynamic(() => import('@components/ui/carousel/carousel'), {
  ssr: false,
});

interface Props {
  lang: string;
  className?: string;
  data: any;
}

const breakpoints = {
  '1024': {
    slidesPerView: 3,
    spaceBetween: 16,
  },
  '768': {
    slidesPerView: 2,
    spaceBetween: 16,
  },
  '680': {
    slidesPerView: 2,
    spaceBetween: 12,
  },
  '0': {
    slidesPerView: 1,
  },
};

const BundleGrid: React.FC<Props> = ({
  className = 'mb-12 pb-0.5',
  data,
  lang,
}) => {
  const { width } = useWindowSize();
  return (
    <div className={cn('heightFull', className)}>
      {width! < 1536 ? (
        <Carousel breakpoints={breakpoints} lang={lang}>
          {data?.map((item: any) => (
            <SwiperSlide key={`bundle-key-${item.id}`}>
              <BundleCard
                bundle={item}
                href={`${ROUTES.BUNDLE}/${item.slug}`}
                lang={lang}
              />
            </SwiperSlide>
          ))}
        </Carousel>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data?.map((item: any) => (
            <BundleCard
              key={`bundle-key-${item.id}`}
              bundle={item}
              href={`${ROUTES.BUNDLE}/${item.slug}`}
              lang={lang}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BundleGrid;
