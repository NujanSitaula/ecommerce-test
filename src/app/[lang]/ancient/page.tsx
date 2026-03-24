import Container from '@components/ui/container';
import {
  heroSevenBanner,
  homeTwoBannerMedium,
  homeSixBannerMedium,
  bannerDiscount,
} from '@framework/static/banner';
import BannerCard from '@components/cards/banner-card';
import BannerAllCarousel from '@components/common/banner-all-carousel';
import DownloadAppsTwo from '@components/common/download-apps-two';
import CollectionMediumGrid from '@components/common/collection-medium-grid';
import BestSellerGroceryProductFeedTwo from '@components/product/feeds/best-seller-grocery-product-feed-two';
import CategoryWithProducts from '@components/common/category-with-products';
import Footer from '@layouts/footer/footer';
import { Metadata } from 'next';
import CartSidebar from '@components/cart/cart-sidebar';

export const metadata: Metadata = {
  title: 'Ancient',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;
  return (
    <>
      <Container className="flex gap-x-7 mx-auto max-w-[1920px] relative" clean>
        <div className="w-full 2xl:w-[calc(100%-428px)] 3xl:w-[calc(100%-478px)] px-4 md:px-6 lg:px-8 ltr:2xl:pl-10 rtl:2xl:pr-10 ltr:2xl:pr-0 rtl:2xl:pl-0">
          <BannerCard
            banner={heroSevenBanner}
            effectActive={true}
            lang={lang}
          />
          <BannerAllCarousel
            data={bannerDiscount}
            className="mb-7 pt-4 mt-0.5"
            lang={lang}
          />
          <CategoryWithProducts lang={lang} />
          <BannerCard
            banner={homeTwoBannerMedium}
            className="pb-1 mb-12 md:mb-14"
            lang={lang}
          />
          <BestSellerGroceryProductFeedTwo lang={lang} />
          <BannerCard
            banner={homeSixBannerMedium}
            className="mb-12 lg:mb-14"
            effectActive={true}
            lang={lang}
          />
          <CollectionMediumGrid headingPosition="center" lang={lang} />
          <DownloadAppsTwo variant="modern" lang={lang} />
          <Footer variant="medium" lang={lang} />
        </div>
        <div className="hidden 2xl:block 2xl:w-[400px] 3xl:w-[450px] h-[calc(100vh-80px)] shrink-0 fixed bg-white 2xl:ltr:right-0 2xl:rtl:left-0 4xl:ltr:left-[calc(50%+512px)] 4xl:rtl:right-[calc(50%+512px)] border border-gray-100 top-20">
          <CartSidebar lang={lang} />
        </div>
      </Container>
    </>
  );
}
