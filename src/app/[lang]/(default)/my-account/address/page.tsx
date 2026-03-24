import { Metadata } from 'next';
import AddressPageContent from './address-page-content';

export const metadata: Metadata = {
  title: 'Address',
};

export default async function AccountDetailsPage({ params }: { params: any }) {
  const { lang } = await params;
  return <AddressPageContent lang={lang} />;
}
