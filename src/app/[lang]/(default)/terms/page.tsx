import PageHeroSection from '@components/ui/page-hero-section';
import DownloadApps from '@components/common/download-apps';
import { Metadata } from 'next';
import TermsPageContent from './terms-page-content';

export const metadata: Metadata = {
  title: 'Terms',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;
  return (
    <>
      <PageHeroSection heroTitle="text-page-terms-condition" lang={lang} />
      <TermsPageContent lang={lang} />
      <DownloadApps lang={lang} />
    </>
  );
}
