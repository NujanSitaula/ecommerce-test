import type { Metadata } from 'next';
import HomePage, { metadata as homeMetadata } from '../page';

export const metadata: Metadata = homeMetadata;

export default async function Page(props: { params: any }) {
  return HomePage(props);
}













