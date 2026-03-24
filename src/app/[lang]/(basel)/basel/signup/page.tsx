import type { Metadata } from 'next';
import BaselBreadcrumb from '../basel-breadcrumb';
import SignUpForm from '@components/auth/sign-up-form';

export const metadata: Metadata = {
  title: 'Basel Sign Up',
};

export default async function BaselSignupPage({ params }: { params: any }) {
  const { lang } = await params;

  return (
    <>
      <BaselBreadcrumb lang={lang} />

      <div className="pt-3 pt-lg-4 pb-4 pb-lg-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <SignUpForm lang={lang} isPopup={false} className="w-100" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

