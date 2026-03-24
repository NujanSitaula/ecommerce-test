import cn from 'classnames';
import Image from '@components/ui/image';
import usePrice from '@framework/product/use-price';
import { Product } from '@framework/types';
import Countdown, { zeroPad } from 'react-countdown';
import { productPlaceholder } from '@assets/placeholders';
import ProgressCard from '@components/ui/progress-card';
import { useTranslation } from 'src/app/i18n/client';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@utils/routes';

interface ProductProps {
  product: Product;
  className?: string;
  date?: string | number | Date | undefined;
  lang: string;
}

const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
  if (completed) {
    return null;
  } else {
    return (
      <span className="flex justify-center text-base xl:text-lg text-brand-dark text-opacity-50 font-semibold -mx-2.5">
        <span>
          <span className="flex items-center justify-center min-w-[40px] md:min-w-[50px] min-h-[36px] md:min-h-[40px] bg-[#DFDDD9] text-brand-dark rounded p-1 mx-1 md:mx-1.5 lg:mx-2.5">
            {zeroPad(days)}
          </span>
          <span className="block mt-2 font-medium text-15px text-black/30">
            DD
          </span>
        </span>
        <span className="mt-1">:</span>
        <span>
          <span className="flex items-center justify-center min-w-[40px] md:min-w-[50px] min-h-[36px] md:min-h-[40px] bg-[#DFDDD9] text-brand-dark rounded p-1 mx-1 md:mx-1.5 lg:mx-2.5">
            {zeroPad(hours)}
          </span>
          <span className="block mt-2 font-medium text-15px text-black/30">
            HH
          </span>
        </span>
        <span className="mt-1">:</span>
        <span>
          <span className="flex items-center justify-center min-w-[40px] md:min-w-[50px] min-h-[36px] md:min-h-[40px] bg-[#DFDDD9] text-brand-dark rounded p-1 mx-1 md:mx-1.5 lg:mx-2.5">
            {zeroPad(minutes)}
          </span>
          <span className="block mt-2 font-medium text-15px text-black/30">
            MM
          </span>
        </span>
        <span className="mt-1">:</span>
        <span>
          <span className="flex items-center justify-center min-w-[40px] md:min-w-[50px] min-h-[36px] md:min-h-[40px] bg-[#DFDDD9] text-brand-dark rounded p-1 mx-1 md:mx-1.5 lg:mx-2.5">
            {zeroPad(seconds)}
          </span>
          <span className="block mt-2 font-medium text-15px text-black/30">
            SS
          </span>
        </span>
      </span>
    );
  }
};

const ProductFlashSaleGobies: React.FC<ProductProps> = ({
  product,
  className,
  date,
  lang,
}) => {
  const { name, image, quantity, sold, product_type } = product ?? {};
  const router = useRouter();
  const { t } = useTranslation(lang, 'common');
  const { price, basePrice } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price,
    baseAmount: product?.price,
    currencyCode: 'USD',
  });
  const { price: minPrice } = usePrice({
    amount: product?.min_price ?? 0,
    currencyCode: 'USD',
  });
  const { price: maxPrice } = usePrice({
    amount: product?.max_price ?? 0,
    currencyCode: 'USD',
  });

  function handlePopupView() {
    if (!product?.slug) return;
    router.push(`/${lang}${ROUTES.PRODUCT}/${product.slug}`);
  }
  return (
    <article
      className={cn(
        'flex flex-col justify-between group cursor-pointer relative px-5 lg:px-7 pt-16 pb-10',
        className,
      )}
      onClick={handlePopupView}
      title={name}
    >
      <div className="absolute z-10 top-6 left-6">
        <span className="text-[11px] md:text-xs font-bold text-brand-light uppercase inline-block bg-[#fd5473] rounded-full px-2.5 py-[5px] pb-1 mx-0.5 sm:mx-1">
          {t('text-most-popular')}
        </span>
      </div>
      <figure className="relative flex items-center justify-center flex-grow w-full h-48 px-16 m-0 mx-auto lg:h-56 3xl:h-64">
        <Image
          src={image?.original ?? productPlaceholder}
          alt={name || 'Product Image'}
          width={100}
          height={100}
          style={{ width: 'auto', objectFit: 'cover' }}
          className="object-contain"
        />
      </figure>

      <div className="flex flex-col mt-8 mb-0.5 text-center">
        <div className="mb-2 lg:mb-2.5">
          <span className="inline-block mx-1 text-xl font-semibold xl:text-2xl text-brand-dark">
            {product_type === 'variable' ? `${minPrice} - ${maxPrice}` : price}
          </span>
          {basePrice && (
            <del className="mx-1 text-base text-opacity-50 xl:text-lg text-brand-dark">
              {basePrice}
            </del>
          )}
        </div>
        <h2 className="mb-8 text-sm leading-5 text-brand-dark lg:text-15px xl:text-base sm:leading-6">
          {name}
        </h2>
        <Countdown date={date} intervalDelay={1000} renderer={renderer} />
        <ProgressCard
          soldProduct={sold}
          totalProduct={quantity}
          className="pt-7 lg:pt-10"
          lang={lang}
        />
      </div>
    </article>
  );
};

export default ProductFlashSaleGobies;
