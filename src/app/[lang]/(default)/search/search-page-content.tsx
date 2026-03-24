'use client';

import { ProductGrid } from '@components/product/product-grid';
import { ShopFilters } from '@components/search/filters';
import SearchTopBar from '@components/search/search-top-bar';
import Container from '@components/ui/container';
import { Element } from 'react-scroll';
import { useState } from 'react';

export default function SearchPageContent({ lang }: { lang: string }) {
  const [itemsCount, setItemsCount] = useState(0);
  const [sort, setSort] = useState<string | undefined>(undefined);

  return (
    <Container>
      <Element name="grid" className="flex pb-16 pt-7 lg:pt-7 lg:pb-20">
        <div className="sticky hidden h-full lg:pt-4 shrink-0 ltr:pr-8 rtl:pl-8 xl:ltr:pr-16 xl:rtl:pl-16 lg:block w-80 xl:w-96 top-16">
          <ShopFilters lang={lang} />
        </div>
        <div className="w-full lg:pt-4 lg:ltr:-ml-4 lg:rtl:-mr-2 xl:ltr:-ml-8 xl:rtl:-mr-8 lg:-mt-1">
          <SearchTopBar
            lang={lang}
            itemsCount={itemsCount}
            onSortChange={setSort}
          />
          <ProductGrid
            lang={lang}
            onCountChange={setItemsCount}
            sort={sort}
          />
        </div>
      </Element>
    </Container>
  );
}
