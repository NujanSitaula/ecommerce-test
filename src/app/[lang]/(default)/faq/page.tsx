import Container from '@components/ui/container';
import PageHeroSection from '@components/ui/page-hero-section';
import DownloadApps from '@components/common/download-apps';
import { Metadata } from 'next';
import Accordion from '@components/ui/accordion';
import { faq } from '@settings/faq-settings';

export const metadata: Metadata = {
  title: 'FAQ',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;
  return (
    <>
      <PageHeroSection
        heroTitle="text-page-faq"
        className="faq-banner-area"
        lang={lang}
      />
      <Container>
        <div className="flex flex-col max-w-2xl py-12 mx-auto 2xl:max-w-4xl md:py-20">
          {faq?.map((item, index) => (
            <Accordion
              key={`${item.title}-${index}`}
              item={item}
              translatorNS="faq"
              lang={lang}
            />
          ))}
        </div>
      </Container>
      <DownloadApps lang={lang} />
    </>
  );
}
