import Container from '@components/ui/container';
import {
  homeAntiqueHeroBanner as heroBanner,
  elegantBannerGrid as banners,
} from '@framework/static/banner';
import CollectionGrid from '@components/common/collection-grid';
import HeroBannerCard from '@components/hero/hero-banner-card';
import CategoryGridListBlock from '@components/common/category-grid-list-block';
import BestSellerGroceryProductFeed from '@components/product/feeds/best-seller-grocery-product-feed';
import BannerGridTwo from '@components/common/banner-grid-two';
import BestSellerWithFlashSale from '@components/product/feeds/best-seller-with-flash-sale';
import CallToActionMoscow from '@components/common/call-to-action/cta-moscow';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Antique',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;
  return (
    <>
      <HeroBannerCard
        banner={heroBanner}
        variant="antique"
        className="min-h-[400px] md:min-h-[460px] antique lg:min-h-[500px] xl:min-h-[800px] py-20 py:pt-24 2xl:bg-center bg-[#F8DF9C] relative"
        lang={lang}
      />
      <Container className="-mt-[60px] relative z-10">
        <CategoryGridListBlock variant="antique" lang={lang} />
      </Container>

      <Container>
        <BestSellerGroceryProductFeed variant="oak" lang={lang} />
        <BannerGridTwo
          data={banners}
          className="mb-12 lg:mb-14 xl:mb-16 2xl:mb-20"
          girdClassName="xl:gap-5 3xl:gap-7"
          lang={lang}
        />
        <BestSellerWithFlashSale lang={lang} />
      </Container>
      <CollectionGrid
        headingPosition="center"
        className="pb-1 mb-12 xl:pt-2 2xl:pt-4 3xl:pt-6 lg:pb-0 lg:mb-14 xl:mb-16 2xl:mb-20"
        lang={lang}
      />
      <Container>
        <BestSellerGroceryProductFeed variant="oak" lang={lang} />
        <CallToActionMoscow lang={lang} />
      </Container>
    </>
  );
}
