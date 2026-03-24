import BannerGrid from '@components/common/banner-grid';
import Container from '@components/ui/container';
import DownloadApps from '@components/common/download-apps';
import { bannerGridThree as banners } from '@framework/static/banner';
import CollectionGrid from '@components/common/collection-grid';
import BestSellerGroceryProductFeed from '@components/product/feeds/best-seller-grocery-product-feed';
import PopularProductFeed from '@components/product/feeds/popular-product-feed';
import BundleComboGrid from '@components/bundle/bundle-combo-grid';
import { Metadata } from 'next';
import HeroBannerWithCategory from '@components/hero/hero-banner-with-category';
import { bundleData as bundle } from '@framework/static/bundle';

export const metadata: Metadata = {
  title: 'Trendy',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;
  return (
    <>
      <Container>
        <HeroBannerWithCategory lang={lang} />
        <BundleComboGrid data={bundle} lang={lang} />
        <BestSellerGroceryProductFeed lang={lang} />
        <BannerGrid
          data={banners}
          className="mb-12 lg:mb-14 xl:mb-16 2xl:mb-20 3xl:pb-2 pt-0.5 md:pt-0"
          lang={lang}
        />
        <PopularProductFeed
          className="mb-12 lg:mb-14 xl:mb-16 2xl:mb-20 3xl:pb-2"
          lang={lang}
        />
      </Container>
      <CollectionGrid headingPosition="center" lang={lang} />
      <DownloadApps lang={lang} />
    </>
  );
}
