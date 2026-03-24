import Container from '@components/ui/container';
import { refinedSixHeroBanner as heroBanner } from '@framework/static/banner';
import { Metadata } from 'next';
import DownloadAppsTwo from '@components/common/download-apps-two';
import HeroCarouselBlock from '@components/hero/hero-carousel-block';
import CategoryWithProduct from './category-with-products';

export const metadata: Metadata = {
  title: 'Refined',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;
  return (
    <>
      <Container>
        <HeroCarouselBlock heroBanner={heroBanner} lang={lang} />
        <CategoryWithProduct lang={lang} />
      </Container>
      <DownloadAppsTwo lang={lang} />
    </>
  );
}
