import cn from 'classnames';
import Image from '@components/ui/image';
import usePrice from '@framework/product/use-price';
import { Product } from '@framework/types';
import dynamic from 'next/dynamic';
import { productPlaceholder } from '@assets/placeholders';
import { useTranslation } from 'src/app/i18n/client';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@utils/routes';

const AddToCart = dynamic(() => import('@components/product/add-to-cart'), {
  ssr: false,
});

interface ProductProps {
  lang: string;
  product: Product;
  className?: string;
}

const ProductCardBasel: React.FC<ProductProps> = ({
  product,
  className,
  lang,
}) => {
  const { name, image, product_type } = product ?? {};
  const router = useRouter();
  const { t } = useTranslation(lang, 'common');
  const { price, basePrice, discount } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price,
    baseAmount: product?.price,
    currencyCode: 'USD',
  });

  function handleNavigate() {
    if (!product?.slug) return;
    router.push(`/${lang}${ROUTES.PRODUCT}/${product.slug}`);
  }

  return (
    <article
      className={cn('basel-productCard card h-100', className)}
      title={name}
    >
      <button
        type="button"
        className="basel-productImageBtn"
        onClick={handleNavigate}
      >
        <Image
          src={image?.thumbnail ?? productPlaceholder}
          alt={name || 'Product Image'}
          width={480}
          height={600}
          className="card-img-top basel-productImage"
          unoptimized
        />
        {discount && (
          <span className="basel-productBadge">
            {t('text-on-sale') ?? 'Sale'}
          </span>
        )}
      </button>
      <div className="card-body text-center d-flex flex-column">
        <h3 className="basel-productTitle mb-2">{name}</h3>
        <div className="basel-productMeta mt-auto">
          <div className="mb-3 basel-productPriceWrap">
            <span className="basel-productPrice">
              {price}
              {product_type === 'variable' && '*'}
            </span>
            {basePrice && (
              <del className="basel-productBasePrice ms-2">{basePrice}</del>
            )}
          </div>
          <div className="basel-productAdd">
            <AddToCart data={product} variant="venus" lang={lang} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCardBasel;

