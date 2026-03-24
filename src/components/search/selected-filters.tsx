import Heading from '@components/ui/heading';
import { useTranslation } from 'src/app/i18n/client';
import { FilteredItem } from './filtered-item';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import useQueryParam from '@utils/use-query-params';

export default function SelectedFilters({ lang }: { lang: string }) {
  const { t } = useTranslation(lang, 'common');

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { clearQueryParam, updateQueryparams } = useQueryParam(pathname ?? '/');
  const [state, setState] = useState({});

  useEffect(() => {
    setState({});
    searchParams?.forEach((value, key) => {
      if (value.includes(',')) {
        setState((prev) => {
          return { ...prev, [key]: value.split(',') };
        });
      } else {
        setState((prev) => {
          return { ...prev, [key]: value };
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function handleArrayUpdate(key: string, item: string) {
    let o = searchParams?.get(key)?.split(',');
    if (o?.includes(item)) {
      updateQueryparams(key, o.filter((i) => i !== item).join(','));
    }
  }
  return (
    <>
      {!isEmpty(searchParams?.toString()) && (
        <div className="block -mb-3">
          <div className="flex items-center justify-between mb-4 -mt-1">
            <Heading>{t('text-filters')}</Heading>
            {/* @ts-ignore */}
            <button
              className="flex-shrink transition duration-150 ease-in text-13px focus:outline-none hover:text-brand-dark"
              aria-label={t('text-clear-all')}
              onClick={() => {
                push(pathname);
              }}
            >
              {t('text-clear-all')}
            </button>
          </div>
          <div className="flex flex-wrap -m-1">
            {Object.entries(state).map(([key, value]) => {
              if (Array.isArray(value)) {
                return value.map((item) => (
                  <FilteredItem
                    itemKey={key ? key : ' '}
                    key={item}
                    itemValue={item as any}
                    onClick={() => handleArrayUpdate(key, item)}
                  />
                ));
              } else {
                return (
                  <FilteredItem
                    itemKey={key ? key : ' '}
                    key={key}
                    itemValue={value as any}
                    onClick={() => {
                      clearQueryParam([key]);
                    }}
                  />
                );
              }
            })}
          </div>
        </div>
      )}
    </>
  );
}
