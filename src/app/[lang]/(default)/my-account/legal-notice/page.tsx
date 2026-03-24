import Legal from '@components/my-account/notice';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notice',
};

export default async function LegalNotice({ params }: { params: any }) {
  const { lang } = await params;
  return <Legal lang={lang} />;
}
