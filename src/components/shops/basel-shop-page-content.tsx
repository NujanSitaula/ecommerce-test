'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@components/product/product-grid';
import Heading from '@components/ui/heading';
import BaselBreadcrumb from 'src/app/[lang]/(basel)/basel/basel-breadcrumb';
import BaselShopFilters from './basel-shop-filters';
import BaselShopSortBar from './basel-shop-sort-bar';

interface BaselShopPageContentProps {
  lang: string;
}

export default function BaselShopPageContent({ lang }: BaselShopPageContentProps) {
  const [itemsCount, setItemsCount] = useState(0);
  const [sort, setSort] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const activeCategory = searchParams?.get('category') ?? '';

  return (
    <>
      <BaselBreadcrumb lang={lang} />
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
            <div>
              <div className="basel-sectionKicker mb-2">Shop</div>
              <Heading variant="heading" className="basel-sectionTitle mb-1">
                All products
              </Heading>
              <p className="text-muted mb-0">
                Browse our full Basel collection and filter by search or sort by price.
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-3">
              <BaselShopFilters lang={lang} />
            </div>
            <div className="col-12 col-lg-9">
              <BaselShopSortBar
                lang={lang}
                itemsCount={itemsCount}
                sort={sort}
                onSortChange={setSort}
              />
              <ProductGrid
                lang={lang}
                variant="basel"
                sort={sort}
                activeCategory={activeCategory}
                onCountChange={setItemsCount}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
