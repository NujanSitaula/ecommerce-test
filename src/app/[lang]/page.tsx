import type { Metadata } from 'next';
import BaselLayout from '@layouts/basel/layout';
import BaselHomeClient from './(basel)/basel/basel-home-client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './(basel)/basel.css';
import 'swiper/css';
import 'swiper/css/pagination';
import './(basel)/simple-line-icons.css';

export const metadata: Metadata = {
  title: 'Basel',
};

export default async function HomePage({ params }: { params: any }) {
  const { lang } = await params;

  return (
    <BaselLayout lang={lang}>
      <BaselHomeClient lang={lang} />
    </BaselLayout>
  );
}

