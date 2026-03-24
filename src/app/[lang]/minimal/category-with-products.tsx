'use client';

import BannerCard from '@components/cards/banner-card';
import CategoryDropdownSidebar from '@components/category/category-dropdown-sidebar';
import BannerAllCarousel from '@components/common/banner-all-carousel';
import AllProductFeed from '@components/product/feeds/all-products-feed';
import { Element } from 'react-scroll';
import {
  bannerDiscount,
  homeTwoBanner as banner,
} from '@framework/static/banner';
import Container from '@components/ui/container';

export default function CategoryWithProduct({ lang }: { lang: string }) {
  return (
    <Container>
      {/* @ts-ignore */}
      <Element name="grid" className="flex mb-11 md:mb-14 xl:mb-16 pb-2.5">
        <CategoryDropdownSidebar
          className="shrink-0 ltr:pr-8 rtl:pl-8 hidden lg:block w-80 xl:w-[370px] lg:sticky lg:top-20"
          lang={lang}
        />
        <div className="w-full minimal-main-content">
          <BannerAllCarousel
            data={bannerDiscount}
            className="mb-12 xl:mb-14"
            lang={lang}
          />
          <AllProductFeed
            element={
              <BannerCard banner={banner} className="py-5" lang={lang} />
            }
            lang={lang}
          />
        </div>
      </Element>
    </Container>
  );
}
