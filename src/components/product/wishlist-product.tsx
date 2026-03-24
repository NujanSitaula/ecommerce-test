import WishlistProductCard from '@components/product/wishlist-product-card';
import { useWishlistProductsQuery } from '@framework/product/get-wishlist-product';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import Alert from '@components/ui/alert';
import cn from 'classnames';
import { useUI } from '@contexts/ui.context';
import Link from 'next/link';
import { ROUTES } from '@utils/routes';

interface ProductWishlistProps {
  className?: string;
  lang: string;
}

export default function ProductWishlistGrid({
  className = '',
  lang,
}: ProductWishlistProps) {
  const { isAuthorized } = useUI();
  const limit = 35;
  const { data, isLoading, error } = useWishlistProductsQuery({
    limit: limit,
  }, isAuthorized);

  if (!isAuthorized) {
    return (
      <div className="text-sm text-brand-muted">
        Please{' '}
        <Link className="text-brand font-semibold" href={`/${lang}${ROUTES.LOGIN}`}>
          sign in
        </Link>{' '}
        to view your wishlist.
      </div>
    );
  }
  return (
    <div className={cn(className)}>
      {error ? (
        <Alert message={error?.message} />
      ) : (
        <div className="flex flex-col">
          {isLoading
            ? Array.from({ length: 35 }).map((_, idx) => (
                <ProductCardLoader
                  key={`product--key-${idx}`}
                  uniqueKey={`product--key-${idx}`}
                />
              ))
            : data?.map((product: any) => (
                <WishlistProductCard
                  key={`product--key${product.id}`}
                  product={product}
                  lang={lang}
                />
              ))}
        </div>
      )}
    </div>
  );
}
