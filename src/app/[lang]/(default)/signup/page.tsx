import SignupForm from '@components/auth/sign-up-form';
import Divider from '@components/ui/divider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default async function Page({ params }: { params: any }) {
  const { lang } = await params;

  return (
    <>
      <Divider />
      <div className="flex items-center justify-center">
        <div className="px-4 py-16 lg:py-20 md:px-6 lg:px-8 2xl:px-10">
          <SignupForm
            isPopup={false}
            className="border rounded-lg border-border-base"
            lang={lang}
          />
        </div>
      </div>
      <Divider />
    </>
  );
}
