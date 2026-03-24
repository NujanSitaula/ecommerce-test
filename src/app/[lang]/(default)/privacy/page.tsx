import PageHeroSection from '@components/ui/page-hero-section';
import DownloadApps from '@components/common/download-apps';
import PrivacyPageContent from './privacy-page-content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;
  return (
    <>
      <PageHeroSection heroTitle="text-page-privacy-policy" lang={lang} />
      <PrivacyPageContent lang={lang} />
      <DownloadApps lang={lang} />
    </>
  );
}
