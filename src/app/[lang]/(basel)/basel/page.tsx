import type { Metadata } from 'next';
import { Suspense } from 'react';
import BaselHomeClient from './basel-home-client';

export const metadata: Metadata = {
  title: 'Basel',
};

export default function BaselHomePage({ params }: { params: any }) {
  const lang = params?.lang ?? 'en';
  return (
    <Suspense fallback={<div className="py-10 text-center">Loading...</div>}>
      <BaselHomeClient lang={lang} />
    </Suspense>
  );
}

