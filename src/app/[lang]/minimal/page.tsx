import DownloadApps from '@components/common/download-apps';
import { homeFourHeroBanner as heroBanner } from '@framework/static/banner';
import HeroBannerCard from '@components/hero/hero-banner-card';
import { Metadata } from 'next';
import CategoryWithProduct from './category-with-products';

export const metadata: Metadata = {
  title: 'Minimal',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;
  return (
    <>
      <HeroBannerCard
        banner={heroBanner}
        variant="medium"
        className="min-h-[400px] lg:min-h-[450px] 2xl:min-h-[480px] pt-20 lg:pt-32 pb-14 lg:pb-24 mb-7 md:mb-8 xl:mb-10"
        lang={lang}
      />
      <CategoryWithProduct lang={lang} />
      <DownloadApps lang={lang} />
    </>
  );
}
