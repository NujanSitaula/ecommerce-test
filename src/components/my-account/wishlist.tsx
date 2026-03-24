'use client';

import ProductWishlistGrid from '@components/product/wishlist-product';
import { useTranslation } from 'src/app/i18n/client';

export default function Wishlist({ lang }: { lang: string }) {
  const { t } = useTranslation(lang, 'common');
  return (
    <>
      <h2 className="text-base md:text-lg xl:text-[20px] font-semibold text-brand-dark  lg:pt-0">
        {t('text-account-wishlist')}
      </h2>
      <div className="flex flex-col pt-8 2xl:pt-12">
        <ProductWishlistGrid lang={lang} />
      </div>
    </>
  );
}
