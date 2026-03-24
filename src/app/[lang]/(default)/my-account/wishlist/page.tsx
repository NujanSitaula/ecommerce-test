import Wishlist from '@components/my-account/wishlist';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wishlist',
};

export default async function WishlistPage({ params }: { params: any }) {
  const { lang } = await params;
  return <Wishlist lang={lang} />;
}
