import BannerGrid from '@components/common/banner-grid';
import Container from '@components/ui/container';
import DownloadApps from '@components/common/download-apps';
import CategoryGridListBlock from '@components/common/category-grid-list-block';
import BundleGrid from '@components/bundle/bundle-grid';
import {
  bannerGridThree as banners,
  homeThreeHeroBanner as heroBanner,
} from '@framework/static/banner';
import CollectionGrid from '@components/common/collection-grid';
import HeroBannerCard from '@components/hero/hero-banner-card';
import BestSellerGroceryProductFeed from '@components/product/feeds/best-seller-grocery-product-feed';
import PopularProductFeed from '@components/product/feeds/popular-product-feed';
import { bundleDataTwo as bundle } from '@framework/static/bundle';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Standard',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;
  return (
    <>
      <HeroBannerCard
        banner={heroBanner}
        className="min-h-[400px] md:min-h-[460px] lg:min-h-[500px] xl:min-h-[550px] 2xl:min-h-[650px] py-20 py:pt-24 mb-5"
        lang={lang}
      />
      <Container>
        <BundleGrid
          data={bundle}
          className="mb-12 lg:mb-14 xl:mb-16 2xl:mb-20"
          lang={lang}
        />
        <CategoryGridListBlock lang={lang} />
        <BestSellerGroceryProductFeed lang={lang} />
        <BannerGrid
          data={banners}
          className="mb-12 lg:mb-14 xl:mb-16 2xl:mb-20"
          lang={lang}
        />
        <PopularProductFeed lang={lang} />
      </Container>
      <CollectionGrid
        headingPosition="center"
        className="pb-1 mb-12 lg:pb-0 lg:mb-14 xl:mb-16 2xl:pt-4"
        lang={lang}
      />
      <DownloadApps lang={lang} />
    </>
  );
}
