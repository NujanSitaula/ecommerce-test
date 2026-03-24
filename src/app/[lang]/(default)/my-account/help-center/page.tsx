import Help from '@components/my-account/help';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help',
};

export default async function HelpCenter({ params }: { params: any }) {
  const { lang } = await params;
  return <Help lang={lang} />;
}
