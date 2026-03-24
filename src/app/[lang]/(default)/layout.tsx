import 'bootstrap/dist/css/bootstrap.min.css';
import '../(basel)/basel.css';
import 'swiper/css';
import 'swiper/css/pagination';
import '../(basel)/simple-line-icons.css';

import { Lato } from 'next/font/google';
import BaselLayout from '@layouts/basel/layout';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
  variable: '--font-basel-body',
});

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { lang } = await params;
  return (
    <div className={lato.variable}>
      <BaselLayout lang={lang}>{children}</BaselLayout>
    </div>
  );
}
