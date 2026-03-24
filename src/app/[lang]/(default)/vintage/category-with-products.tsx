'use client';

import BannerCard from '@components/cards/banner-card';
import CategoryDropdownSidebar from '@components/category/category-dropdown-sidebar';
import AllProductFeed from '@components/product/feeds/all-products-feed';
import React from 'react';
import { Element } from 'react-scroll';

export default function CategoryWithProduct({
  banner,
  lang,
}: {
  banner: any;
  lang: string;
}) {
  return (
    //@ts-ignore
    <Element name="grid" className="flex mb-16 pb-2.5">
      <CategoryDropdownSidebar
        className="ltr:pr-8 rtl:pl-8 hidden lg:block w-80 xl:w-[370px] lg:sticky lg:top-20 shrink-0"
        lang={lang}
      />
      <AllProductFeed
        className="w-full"
        element={<BannerCard banner={banner} className="py-5" lang={lang} />}
        lang={lang}
      />
    </Element>
  );
}
