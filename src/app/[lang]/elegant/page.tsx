import Container from '@components/ui/container';
import DownloadAppsTwo from '@components/common/download-apps-two';
import BundleGrid from '@components/bundle/bundle-grid-two';
import CollectionGrid from '@components/common/collection-grid';
import BestSellerGroceryProductFeed from '@components/product/feeds/best-seller-grocery-product-feed';
import { bundleDataThree as bundle } from '@framework/static/bundle';
import BannerGridTwo from '@components/common/banner-grid-two';
import BannerHeroGrid from '@components/common/banner-hero-grid';
import {
  bannersGridHero as bannersHero,
  elegantBannerGrid as banners,
} from '@framework/static/banner';
import FeatureCarousel from '@components/common/featured-carousel';
import PopularProductWithBestDeals from '@components/product/popular-product-with-best-deals';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Elegant',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;
  return (
    <>
      <Container>
        <BannerHeroGrid
          data={bannersHero}
          className="my-3 md:my-4 lg:mt-0 lg:mb-5 xl:mb-6"
          lang={lang}
        />
        <FeatureCarousel lang={lang} />
        <BestSellerGroceryProductFeed
          className="mb-12 lg:mb-14 xl:mb-16 2xl:mb-20"
          lang={lang}
        />
        <BundleGrid
          className="mb-12 lg:mb-14 xl:mb-16 2xl:mb-20"
          data={bundle}
          lang={lang}
        />
        <PopularProductWithBestDeals lang={lang} />

        <BannerGridTwo
          data={banners}
          className="mb-12 lg:mb-14 xl:mb-16 2xl:mb-20"
          girdClassName="xl:gap-5 3xl:gap-7"
          lang={lang}
        />
      </Container>

      <CollectionGrid
        headingPosition="center"
        className="pb-1 mb-12 lg:pb-0 lg:mb-14 xl:mb-16 2xl:mb-20"
        lang={lang}
      />
      <DownloadAppsTwo lang={lang} />
    </>
  );
}
