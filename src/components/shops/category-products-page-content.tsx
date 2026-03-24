'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Heading from '@components/ui/heading';
import BaselBreadcrumb from 'src/app/[lang]/(basel)/basel/basel-breadcrumb';
import BaselShopSortBar from './basel-shop-sort-bar';
import { ProductGrid } from '@components/product/product-grid';
import { useCategoriesQuery } from '@framework/category/get-all-categories';

interface CategoryProductsPageContentProps {
  lang: string;
  categorySlug: string;
}

export default function CategoryProductsPageContent({
  lang,
  categorySlug,
}: CategoryProductsPageContentProps) {
  const [itemsCount, setItemsCount] = useState(0);
  const [sort, setSort] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: categoriesData } = useCategoriesQuery({ limit: 200 });
  const allCategories = categoriesData?.categories?.data ?? [];

  const categoryName = useMemo(() => {
    const found = allCategories.find((c: any) => c?.slug === categorySlug);
    return found?.name ?? categorySlug.replace(/-/g, ' ');
  }, [allCategories, categorySlug]);

  const minPrice = searchParams?.get('min_price') ?? '';
  const maxPrice = searchParams?.get('max_price') ?? '';
  const [minInput, setMinInput] = useState(minPrice);
  const [maxInput, setMaxInput] = useState(maxPrice);

  useEffect(() => {
    setMinInput(minPrice);
    setMaxInput(maxPrice);
  }, [minPrice, maxPrice]);

  const updateFilter = (nextMin: string, nextMax: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (nextMin) params.set('min_price', nextMin);
    else params.delete('min_price');
    if (nextMax) params.set('max_price', nextMax);
    else params.delete('max_price');
    params.delete('page');
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const resetFilter = () => updateFilter('', '');

  return (
    <>
      <BaselBreadcrumb lang={lang} />
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
            <div>
              <div className="basel-sectionKicker mb-2">Category</div>
              <Heading variant="heading" className="basel-sectionTitle mb-1 text-capitalize">
                {categoryName}
              </Heading>
              <p className="text-muted mb-0">
                Browse products in this category and refine by price.
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="mb-3">Price filter</h6>
                  <div className="d-flex flex-column gap-2">
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="Min price"
                      value={minInput}
                      onChange={(e) => setMinInput(e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="Max price"
                      value={maxInput}
                      onChange={(e) => setMaxInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm mt-1"
                      onClick={() => updateFilter(minInput, maxInput)}
                    >
                      Apply price
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm mt-1"
                      onClick={resetFilter}
                    >
                      Reset price
                    </button>
                  </div>
                </div>
              </div>
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
                activeCategory={categorySlug}
                onCountChange={setItemsCount}
                emptyMessage="No products in this category yet."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
