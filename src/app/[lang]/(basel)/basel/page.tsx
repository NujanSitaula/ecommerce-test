import type { Metadata } from 'next';
import BaselHomeClient from './basel-home-client';

export const metadata: Metadata = {
  title: 'Basel',
};

export default function BaselHomePage({ params }: { params: any }) {
  const lang = params?.lang ?? 'en';
  return <BaselHomeClient lang={lang} />;
}

