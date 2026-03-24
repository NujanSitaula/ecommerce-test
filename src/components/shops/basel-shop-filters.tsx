'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCategoriesQuery } from '@framework/category/get-all-categories';

interface BaselShopFiltersProps {
  lang: string;
}

export default function BaselShopFilters({ lang }: BaselShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    data,
    isLoading: loadingCategories,
    error: categoriesError,
  } = useCategoriesQuery({ limit: 50 });

  const categories = data?.categories?.data ?? [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams?.toString());

    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    // Reset pagination when filters change
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const currentSearch = searchParams?.get('search') ?? '';
  const activeCategory = searchParams?.get('category') ?? '';

  const handleCategoryClick = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (!value) {
      params.delete('category');
    } else {
      params.set('category', value);
    }

    // Reset pagination when category changes
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className="basel-shopFilters">
      <div className="basel-filterSidebar">
        <div className="basel-filterSidebarHeader">Filter products</div>
        <div className="basel-filterSidebarBody">
          <div className="mb-4">
            <h2 className="h6 text-uppercase mb-3">Search</h2>
            <input
              type="search"
              className="form-control"
              placeholder="Search products"
              aria-label="Search products"
              defaultValue={currentSearch}
              onChange={handleSearchChange}
            />
          </div>

          <div>
            <h2 className="h6 text-uppercase mb-3">Product categories</h2>
            {loadingCategories && (
              <div className="small text-muted">Loading categories...</div>
            )}
            {categoriesError && !loadingCategories && (
              <div className="small text-danger">Failed to load categories.</div>
            )}
            {!loadingCategories && !categoriesError && (
              <ul className="list-unstyled mb-0">
                <li className="mb-1">
                  <button
                    type="button"
                    className={`btn btn-link p-0 w-100 text-start small ${
                      !activeCategory ? 'fw-semibold text-dark' : 'text-muted'
                    }`}
                    onClick={() => handleCategoryClick('')}
                  >
                    All
                  </button>
                </li>
                {categories.map((cat: any) => {
                  const value = cat.slug;
                  const label = cat.name;
                  const isActive = (activeCategory || '') === (value || '');
                  return (
                    <li key={cat.id ?? value} className="mb-1">
                      <button
                        type="button"
                        className={`btn btn-link p-0 w-100 text-start small ${
                          isActive ? 'fw-semibold text-dark' : 'text-muted'
                        }`}
                        onClick={() => handleCategoryClick(value)}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

