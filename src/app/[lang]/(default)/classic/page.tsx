import CollectionGrid from '@components/common/collection-grid';
import FeatureGrid from '@components/common/featured-grid';
import Container from '@components/ui/container';
import DownloadApps from '@components/common/download-apps';
import BestSellerProductFeed from '@components/product/feeds/best-seller-product-feed';
import FreshVegetablesProductFeed from '@components/product/feeds/fresh-vegetables-product-feed';
import CookiesProductFeed from '@components/product/feeds/cookies-product-feed';
import PopcornJerkyProductFeed from '@components/product/feeds/popcorn-jerky-product-feed';
import ChipsProductFeed from '@components/product/feeds/chips-product-feed';
import BannerGridTwo from '@components/common/banner-grid-two';
import { bannerGridTwo as banners } from '@framework/static/banner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Classic',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;
  return (
    <>
      <Container>
        <BannerGridTwo
          data={banners}
          className="my-3 md:my-4 lg:mt-0 lg:mb-5 xl:mb-6"
          lang={lang}
        />
        <FeatureGrid lang={lang} />
      </Container>
      <BestSellerProductFeed lang={lang} />
      <FreshVegetablesProductFeed lang={lang} />
      <ChipsProductFeed lang={lang} />
      <CollectionGrid className="mb-12 lg:mb-14 xl:mb-16" lang={lang} />
      <CookiesProductFeed lang={lang} />
      <PopcornJerkyProductFeed lang={lang} />
      <DownloadApps lang={lang} />
    </>
  );
}
