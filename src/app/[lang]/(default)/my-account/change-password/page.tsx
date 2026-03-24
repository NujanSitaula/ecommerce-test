import ChangePassword from '@components/my-account/change-password';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Password',
};

export default async function ChangePasswordPage({ params }: { params: any }) {
  const { lang } = await params;
  return <ChangePassword lang={lang} />;
}
