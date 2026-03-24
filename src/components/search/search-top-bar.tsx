import { Drawer } from '@components/common/drawer/drawer';
import FilterIcon from '@components/icons/filter-icon';
import { useUI } from '@contexts/ui.context';
import FilterSidebar from '@components/search/filter-sidebar';
import ListBox from '@components/ui/filter-list-box';
import { useTranslation } from 'src/app/i18n/client';
import { getDirection } from '@utils/get-direction';
import motionProps from '@components/common/drawer/motion';

export default function SearchTopBar({
  lang,
  itemsCount = 0,
  onSortChange,
}: {
  lang: string;
  itemsCount?: number;
  onSortChange?: (value: string) => void;
}) {
  const { openFilter, displayFilter, closeFilter } = useUI();
  const { t } = useTranslation(lang, 'common');
  const dir = getDirection(lang);
  const contentWrapperCSS = dir === 'ltr' ? { left: 0 } : { right: 0 };
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        className="flex items-center px-4 py-2 text-sm font-semibold transition duration-200 ease-in-out border rounded-md lg:hidden text-brand-dark border-border-base focus:outline-none hover:border-brand hover:text-brand"
        onClick={openFilter}
      >
        <FilterIcon />
        <span className="ltr:pl-2.5 rtl:pr-2.5">{t('text-filters')}</span>
      </button>
      <div className="flex items-center justify-end w-full lg:justify-between">
        <div className="shrink-0 text-brand-dark font-medium text-15px leading-4 md:ltr:mr-6 md:rtl:ml-6 hidden lg:block mt-0.5">
          {itemsCount} {t('text-items-found')}
        </div>
        <ListBox
          options={[
            { name: 'text-recommended', value: '' },
            { name: 'text-lowest-price', value: 'lowest' },
            { name: 'text-highest-price', value: 'highest' },
          ]}
          lang={lang}
          onChange={(option: any) => onSortChange?.(option?.value ?? '')}
        />
      </div>
      {/*TODO: multiple drawer uses throughout the app is a bad practice */}
      <Drawer
        placement={dir === 'rtl' ? 'right' : 'left'}
        open={displayFilter}
        onClose={closeFilter}
        // @ts-ignore
        level={null}
        contentWrapperStyle={contentWrapperCSS}
        {...motionProps}
      >
        <FilterSidebar lang={lang} />
      </Drawer>
    </div>
  );
}
