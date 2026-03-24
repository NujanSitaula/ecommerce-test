'use client';

import CollectionCard from '@components/cards/collection-card';
import SectionHeader from '@components/common/section-header';
import useWindowSize from '@utils/use-window-size';
import Carousel from '@components/ui/carousel/carousel';
import { SwiperSlide } from '@components/ui/carousel/slider';
import { ROUTES } from '@utils/routes';

const data = [
  {
    id: 1,
    slug: 'feel-the-thirsty-in-summer-anytime',
    image: '/assets/images/collection/1.png',
    title: 'collection-title-one',
    description: 'collection-description-one',
  },
  {
    id: 2,
    slug: 'most-popular-item-for-Fast-food',
    image: '/assets/images/collection/2.png',
    title: 'collection-title-two',
    description: 'collection-description-two',
  },
  {
    id: 3,
    slug: 'authentic-japanese-food-in-real-taste',
    image: '/assets/images/collection/3.png',
    title: 'collection-title-three',
    description: 'collection-description-three',
  },
];

interface Props {
  lang: string;
  className?: string;
  headingPosition?: 'left' | 'center';
}

const breakpoints = {
  '1024': {
    slidesPerView: 3,
  },
  '768': {
    slidesPerView: 3,
  },
  '540': {
    slidesPerView: 2,
  },
  '0': {
    slidesPerView: 1,
  },
};

const CollectionMediumGrid: React.FC<Props> = ({
  lang,
  className = 'mb-12 lg:mb-14 xl:mb-16',
  headingPosition = 'left',
}) => {
  const { width } = useWindowSize();
  return (
    <div className={className}>
      <SectionHeader
        sectionHeading="text-curated-collections"
        headingPosition={headingPosition}
        className="pb-6 lg:mb-4 xl:mb-2.5"
        lang={lang}
      />
      {width! < 1536 ? (
        <Carousel
          breakpoints={breakpoints}
          autoplay={{ delay: 4000 }}
          prevButtonClassName="ltr:-left-2.5 rtl:-right-2.5 -top-14"
          nextButtonClassName="ltr:-right-2.5 rtl:-left-2.5 -top-14"
          className="-mx-1.5 md:-mx-2 xl:-mx-2.5 -my-4"
          prevActivateId="collection-carousel-button-prev"
          nextActivateId="collection-carousel-button-next"
          lang={lang}
        >
          {data?.map((item) => (
            <SwiperSlide
              key={`collection-key-${item.id}`}
              className="px-1.5 md:px-2 xl:px-2.5 py-4"
            >
              <CollectionCard
                key={item.id}
                collection={item}
                href={`${ROUTES.BUNDLE}/${item.slug}`}
                lang={lang}
              />
            </SwiperSlide>
          ))}
        </Carousel>
      ) : (
        <div className="gap-5 2xl:grid 2xl:grid-cols-3 3xl:gap-7">
          {data?.map((item) => (
            <CollectionCard
              key={item.id}
              collection={item}
              href={`${ROUTES.BUNDLE}/${item.slug}`}
              lang={lang}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionMediumGrid;
