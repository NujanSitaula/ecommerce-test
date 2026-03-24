'use client';

import { useShopQuery } from '@framework/shop/get-shop';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useUI } from '@contexts/ui.context';
import { getDirection } from '@utils/get-direction';
import { Element } from 'react-scroll';
import Container from '@components/ui/container';
import { Drawer } from '@components/common/drawer/drawer';
import ShopSidebar from '@components/shops/shop-sidebar';
import ShopSidebarDrawer from '@components/shops/shop-sidebar-drawer';
import AllProductFeed from '@components/product/feeds/all-products-feed';
import useWindowSize from '@utils/use-window-size';
import motionProps from '@components/common/drawer/motion';
import { useTranslation } from 'src/app/i18n/client';

export default function ShopsSingleDetails({ lang }: { lang: string }) {
  const { t } = useTranslation(lang, 'common');
  const pathname = useParams();
  const { slug } = pathname;
  const { data, isLoading } = useShopQuery(slug as string);
  const { openShop, displayShop, closeShop } = useUI();
  const { width } = useWindowSize();
  const dir = getDirection(lang);
  const contentWrapperCSS = dir === 'ltr' ? { left: 0 } : { right: 0 };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <div
        className="flex justify-center w-full h-56 bg-center bg-no-repeat bg-cover md:h-64"
        style={{
          backgroundImage: `url(${
            width! <= 480
              ? data?.cover_image?.original!
              : data?.cover_image?.thumbnail!
          })`,
        }}
      />
      <div className="flex items-center px-4 py-4 border-b lg:hidden md:px-6 border-border-base mb-7">
        <div className="flex shrink-0">
          <Image
            src={data?.logo?.original as string}
            alt={`${data?.name}`}
            width={66}
            height={66}
            className="rounded-md"
            style={{ width: 'auto' }}
          />
        </div>
        <div className="ltr:pl-4 rtl:pr-4">
          <h2 className="font-semibold text-brand-dark text-15px">
            {data?.name}
          </h2>
          <button
            className="block text-sm font-medium transition-all text-brand hover:text-brand-muted"
            onClick={openShop}
          >
            {t('text-more-info')}
          </button>
        </div>
      </div>
      <Container>
        {/* @ts-ignore */}
        <Element
          name="grid"
          className="flex flex-col pb-16 lg:flex-row lg:pt-8 lg:pb-20"
        >
          <div className="shrink-0 hidden lg:block lg:w-80 xl:w-[350px] 2xl:w-96 lg:sticky lg:top-20 category-mobile-sidebar">
            <div className="border border-[#EFF2F4] shadow-vendorSidebar rounded-lg">
              <ShopSidebar data={data} lang={lang} />
            </div>
          </div>

          <div className="w-full lg:ltr:pl-7 lg:rtl:pr-7">
            <AllProductFeed lang={lang} />
          </div>
        </Element>
      </Container>
      {/*TODO: multiple drawer uses throughout the app is a bad practice */}
      <Drawer
        placement={dir === 'rtl' ? 'right' : 'left'}
        open={displayShop}
        onClose={closeShop}
        // @ts-ignore
        level={null}
        contentWrapperStyle={contentWrapperCSS}
        {...motionProps}
      >
        <ShopSidebarDrawer data={data} lang={lang} />
      </Drawer>
    </>
  );
}
