'use client';

import HeroBannerCard from '@components/hero/hero-banner-card';
import Carousel from '@components/ui/carousel/carousel';
import { SwiperSlide } from '@components/ui/carousel/slider';

interface Props {
  lang: string;
  heroBanner?: any;
  className?: string;
  contentClassName?: string;
}

const HeroSliderBlock: React.FC<Props> = ({
  lang,
  heroBanner,
  className = 'mb-7',
  contentClassName = 'py-24',
}) => {
  return (
    <div className={`${className}`}>
      <Carousel
        pagination={{
          clickable: true,
        }}
        navigation={false}
        autoplay={false}
        lang={lang}
      >
        {heroBanner?.map((banner: any) => (
          <SwiperSlide key={`banner--key${banner.id}`}>
            <HeroBannerCard
              banner={banner}
              variant="slider"
              className={contentClassName}
              lang={lang}
            />
          </SwiperSlide>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroSliderBlock;
