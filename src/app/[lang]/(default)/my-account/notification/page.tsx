import Notifications from '@components/my-account/notification';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notification',
};

export default async function Notification({ params }: { params: any }) {
  const { lang } = await params;
  return <Notifications lang={lang} />;
}
