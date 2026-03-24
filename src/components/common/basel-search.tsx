'use client';

import { useState } from 'react';
import cn from 'classnames';
import SearchBox from '@components/common/search-box';
import { useSearchQuery } from '@framework/product/use-search';
import SearchProduct from '@components/common/search-product';
import SearchResultLoader from '@components/ui/loaders/search-result-loader';
import { Product } from '@framework/types';
import SearchIcon from '@components/icons/search-icon';

export default function BaselSearch({ lang }: { lang: string }) {
  const [searchText, setSearchText] = useState('');
  const { data, isLoading } = useSearchQuery({
    text: searchText,
    limit: 10,
  });

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
  }

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    setSearchText(e.currentTarget.value);
  }

  function handleClear() {
    setSearchText('');
  }

  return (
    <div className="d-flex flex-column h-100">
      <SearchBox
        lang={lang}
        searchId="basel-search"
        name="search"
        value={searchText}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onClear={handleClear}
        variant="border"
      />

      <div className="mt-3 flex-grow-1 overflow-auto">
        {!searchText && (
          <div className="d-flex flex-column align-items-center justify-content-center text-muted py-5 gap-2">
            <SearchIcon className="w-6 h-6 mb-1" />
            <div className="small">Start typing to search products</div>
          </div>
        )}

        {searchText && (
          <div className="border rounded bg-white">
            {isLoading ? (
              <div className="p-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className={cn('py-2', { 'border-top': idx })}>
                    <SearchResultLoader
                      key={`basel-search-loader-${idx}`}
                      uniqueKey={`basel-search-${idx}`}
                    />
                  </div>
                ))}
              </div>
            ) : data && data.length > 0 ? (
              data.map((item: Product, index: number) => (
                <div
                  key={`basel-search-result-${index}`}
                  className={cn(
                    'px-3 py-2 basel-searchResultItem',
                    index > 0 && 'border-top',
                  )}
                >
                  <SearchProduct item={item} lang={lang} />
                </div>
              ))
            ) : (
              <div className="text-muted small px-3 py-3">
                No products match your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

