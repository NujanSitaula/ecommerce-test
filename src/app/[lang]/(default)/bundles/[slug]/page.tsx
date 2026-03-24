import Container from '@components/ui/container';
import { Metadata } from 'next';
import DownloadApps from '@components/common/download-apps';
import ProductBundleGrid from '@components/product/product-bundle-grid';
import BundleHeroSection from '@components/bundle/bundle-hero-section';
import BannerGridTwo from '@components/common/banner-grid-two';
import { bannerGridTwo as banners } from '@framework/static/banner';

export const metadata: Metadata = {
  title: 'Bundles',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;
  return (
    <>
      <BundleHeroSection lang={lang} />

      <Container>
        <ProductBundleGrid
          className="pb-20 mt-7 md:mt-8 xl:mt-10"
          element={
            <BannerGridTwo data={banners} className="py-5" lang={lang} />
          }
          lang={lang}
        />
      </Container>
      <DownloadApps lang={lang} />
    </>
  );
}
