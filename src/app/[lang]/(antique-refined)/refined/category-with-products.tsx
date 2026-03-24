'use client';

import CategoryDropdownSidebar from '@components/category/category-dropdown-sidebar';
import RefinedSidebar from '@components/common/refined-sidebar';
import RefinedAllProductFeed from '@components/product/feeds/refined-all-products-feed';
import { Element } from 'react-scroll';

export default function CategoryWithProduct({ lang }: { lang: string }) {
  return (
    //@ts-ignore
    <Element name="grid" className="flex flex-col mb-16 md:flex-row">
      <CategoryDropdownSidebar
        className="shrink-0 ltr:pr-8 rtl:pl-8 xl:ltr:pr-10 xl:rtl:pl-10 hidden xl:block w-[350px] 2xl:w-96 lg:sticky lg:top-24"
        lang={lang}
      />
      <RefinedAllProductFeed
        className="w-full xl:ltr:-ml-3 xl:rtl:-mr-3 3xl:ltr:-ml-1 3xl:rtl:-mr-1 3xl:ltr:pr-2 3xl:rtl:pl-2"
        lang={lang}
      />
      <RefinedSidebar
        className="w-full md:w-[300px] lg:w-[350px] mt-10 md:mt-0 md:sticky md:top-20 lg:top-24"
        lang={lang}
      />
    </Element>
  );
}
