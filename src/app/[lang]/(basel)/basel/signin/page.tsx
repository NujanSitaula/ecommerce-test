import type { Metadata } from 'next';
import BaselBreadcrumb from '../basel-breadcrumb';
import LoginForm from '@components/auth/login-form';

export const metadata: Metadata = {
  title: 'Basel Sign In',
};

export default async function BaselSigninPage({ params }: { params: any }) {
  const { lang } = await params;

  return (
    <>
      <BaselBreadcrumb lang={lang} />

      <div className="pt-3 pt-lg-4 pb-4 pb-lg-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <LoginForm lang={lang} isPopup={false} className="w-100" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

