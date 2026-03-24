import usePrice from '@framework/product/use-price';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'src/app/i18n/client';

export default function VariationPrice({
  selectedVariation,
  minPrice,
  maxPrice,
  lang,
}: any) {
  const { t } = useTranslation(lang, 'common');
  const toMoneyNumber = (value: unknown): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Handles values like "$100", "100 USD", "100.50"
      const cleaned = value.replace(/[^0-9.-]+/g, '');
      const parsed = Number(cleaned);
      return parsed;
    }
    return Number(value);
  };

  const selectedAmountRaw = selectedVariation?.sale_price
    ? selectedVariation.sale_price
    : selectedVariation?.price;

  const selectedAmount = toMoneyNumber(selectedAmountRaw);
  const selectedBaseAmount = toMoneyNumber(selectedVariation?.price);

  const selectedPriceData =
    selectedVariation &&
    Number.isFinite(selectedAmount) &&
    Number.isFinite(selectedBaseAmount)
      ? {
          amount: selectedAmount,
          baseAmount: selectedBaseAmount,
          currencyCode: 'USD',
        }
      : null;

  const { price, basePrice, discount } = usePrice(selectedPriceData);

  const minAmount = toMoneyNumber(minPrice);
  const maxAmount = toMoneyNumber(maxPrice);

  const { price: min_price } = usePrice(
    Number.isFinite(minAmount)
      ? { amount: minAmount, currencyCode: 'USD' }
      : null,
  );
  const { price: max_price } = usePrice(
    Number.isFinite(maxAmount)
      ? { amount: maxAmount, currencyCode: 'USD' }
      : null,
  );

  const hasSelectedPrice =
    !isEmpty(selectedVariation) && typeof price === 'string' && price.trim() !== '';
  return (
    <div className="flex items-center mt-5">
      <div className="text-brand-dark font-bold text-base md:text-xl xl:text-[22px]">
        {hasSelectedPrice
          ? `${price}`
          : `${min_price} - ${max_price}`}
      </div>
      {discount && (
        <>
          <del className="text-sm text-opacity-50 md:text-15px ltr:pl-3 rtl:pr-3 text-brand-dark">
            {basePrice}
          </del>
          <span className="inline-block rounded font-bold text-xs md:text-sm text-brand-tree bg-opacity-20 bg-brand-tree uppercase px-2 py-1 ltr:ml-2.5 rtl:mr-2.5">
            {discount} {t('text-off')}
          </span>
        </>
      )}
    </div>
  );
}
