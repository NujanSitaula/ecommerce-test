'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@components/ui/button';
import Counter from '@components/ui/counter';
import { useParams } from 'next/navigation';
import { ROUTES } from '@utils/routes';
import useWindowSize from '@utils/use-window-size';
import { useProductQuery } from '@framework/product/get-product';
import { getVariations } from '@framework/utils/get-variations';
import usePrice from '@framework/product/use-price';
import { useCart } from '@contexts/cart/cart.context';
import { generateCartItem } from '@utils/generate-cart-item';
import ProductAttributes from '@components/product/product-attributes';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
import ThumbnailCarousel from '@components/ui/carousel/thumbnail-carousel';
import Image from '@components/ui/image';
import CartIcon from '@components/icons/cart-icon';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import TagLabel from '@components/ui/tag-label';
import LabelIcon from '@components/icons/label-icon';
import { IoArrowRedoOutline } from 'react-icons/io5';
import SocialShareBox from '@components/ui/social-share-box';
import ProductDetailsTab from '@components/product/product-details/product-tab';
import VariationPrice from './variation-price';
import isEqual from 'lodash/isEqual';
import { useTranslation } from 'src/app/i18n/client';
import { useUI } from '@contexts/ui.context';
import {
  useAddWishlistMutation,
  useRemoveWishlistMutation,
  useWishlistIdsQuery,
} from '@framework/product/get-wishlist-product';
import PersonalizationForm from './personalization-form';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPinterestP,
  FaExchangeAlt,
} from 'react-icons/fa';

interface ProductSingleDetailsProps {
  lang: string;
  variant?: 'default' | 'basel';
}

const ProductSingleDetails: React.FC<ProductSingleDetailsProps> = ({
  lang,
  variant = 'default',
}) => {
  const { t } = useTranslation(lang, 'common');
  const pathname = useParams();
  const router = useRouter();
  const { slug } = pathname;
  const { isAuthorized } = useUI();
  const { width } = useWindowSize();
  const { data, isLoading } = useProductQuery(slug as string);
  const { addItemToCart, isInCart, getItemFromCart, isInStock } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [personalizations, setPersonalizations] =
    useState<Record<string, any>>({});
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [addToWishlistLoader, setAddToWishlistLoader] =
    useState<boolean>(false);
  const [shareButtonStatus, setShareButtonStatus] =
    useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageHover, setIsImageHover] = useState(false);
  const { data: wishlistIds = [] } = useWishlistIdsQuery(isAuthorized);
  const addWishlistMutation = useAddWishlistMutation();
  const removeWishlistMutation = useRemoveWishlistMutation();
  const [imageOrigin, setImageOrigin] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const productUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}${ROUTES.PRODUCT}/${pathname.slug}`;
  const displayName = String(
    data?.name ||
      data?.title ||
      data?.product_name ||
      data?.productName ||
      data?.slug ||
      '',
  );
  const storeName =
    process.env.NEXT_PUBLIC_STORE_NAME ||
    process.env.NEXT_PUBLIC_SITE_NAME ||
    'BoroBazar';

  useEffect(() => {
    if (!displayName) return;
    if (typeof document === 'undefined') return;
    document.title = `${displayName} - ${storeName}`;
  }, [displayName, storeName]);
  const { price, basePrice, discount } = usePrice(
    data && {
      amount: data.sale_price ? data.sale_price : data.price,
      baseAmount: data.price,
      currencyCode: 'USD',
    },
  );
  const handleChange = () => {
    setShareButtonStatus(!shareButtonStatus);
  };

  const variations = getVariations(data?.variations);

  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation),
      )
    : true;
  let selectedVariation: any = {};
  if (isSelected) {
    const dataVaiOption: any = data?.variation_options;
    selectedVariation = dataVaiOption?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort(),
      ),
    );
  }
  const item = data ? generateCartItem(data, selectedVariation, personalizations) : null;
  const cartItem = item && isInCart(item.id) ? getItemFromCart(item.id) : null;
  const cartQuantity = cartItem?.quantity ?? 0;
  const outOfStock = item ? isInCart(item.id) && !isInStock(item.id) : false;
  const remainingStock =
    item && typeof item.stock === 'number'
      ? Math.max(item.stock - cartQuantity, 0)
      : undefined;

  // Calculate available stock using new fields
  const availableStock = data?.available_quantity ?? remainingStock ?? data?.quantity ?? 0;
  const isMadeToOrder = data?.inventory_type === 'made_to_order' || data?.inventory_type === 'both';
  const isInStockType = data?.inventory_type === 'in_stock' || data?.inventory_type === 'both';
  const hasStock = isMadeToOrder || (isInStockType && availableStock > 0);
  const isLowStock = data?.is_low_stock && isInStockType;

  // Calculate production time
  const calculateProductionDays = (days: number | undefined) => {
    if (!days) return null;
    const today = new Date();
    let businessDays = 0;
    let count = 0;
    while (businessDays < days) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + count);
      const dayOfWeek = checkDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
      count++;
    }
    const minDays = Math.floor(days * 0.8);
    const maxDays = count;
    return { min: minDays, max: maxDays };
  };

  const productionTime = data?.production_time_days
    ? calculateProductionDays(data.production_time_days)
    : null;

  // Min/Max quantity validation
  const minQuantity = data?.min_quantity ?? 1;
  const maxQuantity = data?.max_quantity ?? availableStock;
  const quantityError =
    selectedQuantity < minQuantity
      ? `Minimum quantity is ${minQuantity}`
      : maxQuantity && selectedQuantity > maxQuantity
      ? `Maximum quantity is ${maxQuantity}`
      : null;

  // Validate personalizations
  const personalizationOptions = data?.personalization_options ?? [];
  const hasRequiredPersonalizations = personalizationOptions
    .filter((opt) => opt.required)
    .every((opt) => personalizations[opt.id]);
  const canAddToCart =
    isSelected && hasRequiredPersonalizations && !quantityError;
  const productId = data?.id ? String(data.id) : null;
  const favorite = productId ? wishlistIds.includes(productId) : false;

  if (isLoading || !data || !item) return <p>Loading...</p>;
  function addToCart() {
    if (!canAddToCart) return;
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 1500);

    const item = generateCartItem(data!, selectedVariation, personalizations);
    const qtyToAdd = selectedQuantity > 0 ? selectedQuantity : 1;
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'cart-counter',
        hypothesisId: 'H-add',
        location: 'product.tsx:addToCart',
        message: 'Add to cart clicked',
        data: {
          selectedQuantity,
          qtyToAdd,
          cartQuantity,
          itemId: item.id,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    addItemToCart(item, qtyToAdd);
    setSelectedQuantity(1);
    setPersonalizations({});
    toast('Added to the bag', {
      progressClassName: 'fancy-progress-bar',
      position: width! > 768 ? 'bottom-right' : 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
  async function addToWishlist() {
    if (!isAuthorized) {
      toast(t('text-login-for-add-favorite') || 'Please sign in first.');
      router.push(`/${lang}${ROUTES.LOGIN}`);
      return;
    }
    if (!productId) return;

    setAddToWishlistLoader(true);
    try {
      if (favorite) {
        await removeWishlistMutation.mutateAsync(productId);
      } else {
        await addWishlistMutation.mutateAsync(productId);
      }
      const toastStatus: string =
        favorite === true ? t('text-remove-favorite') : t('text-added-favorite');
      toast(toastStatus, {
        progressClassName: 'fancy-progress-bar',
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setAddToWishlistLoader(false);
    }
  }

  // Basel theme layout
  if (variant === 'basel') {
    const galleryItems =
      data?.gallery && data.gallery.length
        ? data.gallery
        : data?.image
        ? [
            {
              id: 'main',
              original: data.image.original,
              thumbnail: data.image.thumbnail ?? data.image.original,
            },
          ]
        : [];
    const safeIndex =
      activeImageIndex >= 0 && activeImageIndex < galleryItems.length
        ? activeImageIndex
        : 0;
    const activeItem = galleryItems[safeIndex];
    const activeImageSrc =
      activeItem &&
      typeof activeItem.original === 'string' &&
      activeItem.original.trim().length > 0
        ? activeItem.original
        : '/product-placeholder.svg';

    return (
      <div className="basel-productSingle py-4 py-md-5">
        <div className="row align-items-start gx-4 gx-lg-5">
          {/* Thumbnails column */}
          <div className="d-none d-sm-block col-sm-2 col-md-2 basel-productThumbsCol">
            {galleryItems.length > 0 && (
              <div className="basel-productThumbList">
                {galleryItems.map((img: any, index: number) => (
                  <button
                    key={img.id ?? index}
                    type="button"
                    className={`basel-productThumb${
                      index === safeIndex ? ' basel-productThumb--active' : ''
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={
                        (typeof img.thumbnail === 'string' &&
                        img.thumbnail.trim().length > 0
                          ? img.thumbnail
                          : typeof img.original === 'string' &&
                            img.original.trim().length > 0
                          ? img.original
                          : '/product-placeholder.svg') as string
                      }
                      alt={displayName}
                      width={90}
                      height={120}
                      className="img-fluid"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main image column */}
          <div className="col-12 col-sm-6 col-lg-6 mb-4 mb-lg-0 basel-productMainCol">
            {activeItem ? (
              <div
                className="basel-productMainImageWrap"
                onMouseEnter={() => setIsImageHover(true)}
                onMouseLeave={() => setIsImageHover(false)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setImageOrigin({
                    x: Math.min(100, Math.max(0, x)),
                    y: Math.min(100, Math.max(0, y)),
                  });
                }}
              >
                <Image
                  src={activeImageSrc}
                  alt={displayName}
                  width={900}
                  height={680}
                  className="basel-productMainImage"
                  style={{
                    width: '100%',
                    height: 'auto',
                    transform: isImageHover ? 'scale(1.8)' : 'scale(1)',
                    transformOrigin: `${imageOrigin.x}% ${imageOrigin.y}%`,
                    transition:
                      'transform 0.2s ease-out, transform-origin 0.2s ease-out',
                  }}
                  unoptimized
                />
              </div>
            ) : (
              <div className="text-center">
                <Image
                  src={data?.image?.original ?? '/product-placeholder.svg'}
                  alt={displayName}
                  width={900}
                  height={680}
                  className="img-fluid"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Summary column */}
          <div className="col-12 col-lg-4 basel-productSummaryCol mt-3 mt-lg-0">
            <div className="mb-3">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <h1 className="h3 mb-1">{displayName}</h1>
                {isMadeToOrder && (
                  <span className="badge bg-secondary text-uppercase">
                    Made to Order
                  </span>
                )}
              </div>
            </div>

            {data?.unit && isEmpty(variations) ? (
              <div className="text-muted mb-2">{data?.unit}</div>
            ) : (
              <div className="mb-3">
                <VariationPrice
                  selectedVariation={selectedVariation}
                  minPrice={data?.min_price}
                  maxPrice={data?.max_price}
                  lang={lang}
                />
              </div>
            )}

            {isEmpty(variations) && (
              <div className="mb-3">
                <div className="d-flex align-items-center basel-productPriceLine">
                  <div className="me-2">{price}</div>
                  {discount && (
                    <>
                      <del className="text-muted me-2">{basePrice}</del>
                      <span className="badge bg-success text-uppercase">
                        {discount} {t('text-off')}
                      </span>
                    </>
                  )}
                </div>
                {productionTime && (
                  <div className="text-muted small mt-1">
                    Ships in {productionTime.min}-{productionTime.max} business
                    days
                  </div>
                )}
              </div>
            )}

            {Object.keys(variations).map((variation) => (
              <ProductAttributes
                key={`basel-attribute-key${variation}`}
                variations={variations}
                attributes={attributes}
                setAttributes={setAttributes}
              />
            ))}

            <div className="mb-3">
              {isEmpty(variations) && (
                <>
                  {isMadeToOrder ? (
                    <span className="text-purple-600 small">Made to Order</span>
                  ) : hasStock ? (
                    <span
                      className={`small fw-medium ${
                        isLowStock ? 'text-warning' : 'text-success'
                      }`}
                    >
                      {isLowStock ? (
                        <>
                          {t('text-only')} {availableStock}{' '}
                          {t('text-left-item')} - Low Stock
                        </>
                      ) : (
                        <>
                          {availableStock > 0
                            ? `${t('text-only')} ${availableStock} ${t(
                                'text-left-item',
                              )}`
                            : t('text-in-stock')}
                        </>
                      )}
                    </span>
                  ) : (
                    <div className="text-danger small">
                      {t('text-out-stock')}
                    </div>
                  )}
                </>
              )}

              {!isEmpty(selectedVariation) && (
                <span className="small text-warning fw-medium">
                  {selectedVariation?.is_disable ||
                  selectedVariation.quantity === 0
                    ? t('text-out-stock')
                    : `${
                        t('text-only') +
                        ' ' +
                        selectedVariation.quantity +
                        ' ' +
                        t('text-left-item')
                      }`}
                </span>
              )}
            </div>

            {personalizationOptions.length > 0 && (
              <div className="mb-3">
                <PersonalizationForm
                  options={personalizationOptions}
                  values={personalizations}
                  onChange={setPersonalizations}
                  lang={lang}
                />
              </div>
            )}

            <div className="mb-3">
              {quantityError && (
                <p className="text-danger small mb-2">{quantityError}</p>
              )}
              <div className="d-flex align-items-center gap-2 basel-qtyRow">
                <Counter
                  variant="mercury"
                  value={selectedQuantity}
                  onIncrement={() =>
                    setSelectedQuantity((prev) =>
                      maxQuantity ? Math.min(prev + 1, maxQuantity) : prev + 1,
                    )
                  }
                  onDecrement={() =>
                    setSelectedQuantity((prev) =>
                      Math.max(prev - 1, minQuantity),
                    )
                  }
                  disabled={
                    isMadeToOrder
                      ? false
                      : isInCart(item.id)
                      ? cartQuantity + selectedQuantity >=
                        Number(availableStock)
                      : selectedQuantity >= Number(availableStock)
                  }
                  className="basel-qty"
                  lang={lang}
                />
                <Button
                  onClick={addToCart}
                  className="flex-grow-1 basel-addToCartBtn"
                  disabled={!canAddToCart}
                  loading={addToCartLoader}
                >
                  <CartIcon
                    color="#ffffff"
                    className="ltr:mr-2 rtl:ml-2"
                  />
                  {t('text-add-to-cart')}
                </Button>
              </div>
            </div>

            <div className="mb-3 basel-actionIcons">
              <button
                type="button"
                onClick={addToWishlist}
                disabled={addToWishlistLoader}
                className={`basel-iconCircle ${
                  favorite ? 'basel-iconCircle--active' : ''
                }`}
                aria-label={t('text-wishlist')}
              >
                {favorite ? <IoIosHeart /> : <IoIosHeartEmpty />}
              </button>
              <button
                type="button"
                className="basel-iconCircle"
                aria-label="Compare"
              >
                <FaExchangeAlt />
              </button>
            </div>

            <div className="mb-3 basel-productMetaList">
              {data?.sku && (
                <div className="small">
                  <strong>Sku</strong>: {data.sku}
                </div>
              )}
              {data?.categories && data.categories.length > 0 && (
                <div className="small">
                  <strong>Category</strong>:{' '}
                  <span>{data.categories[0]?.name}</span>
                </div>
              )}
              <div className="small d-flex align-items-center gap-2 mt-1">
                <strong>Share</strong>:
                <div className="basel-productShareIcons">
                  <a href="#" aria-label="Share on Facebook">
                    <FaFacebookF />
                  </a>
                  <a href="#" aria-label="Share on Twitter">
                    <FaTwitter />
                  </a>
                  <a href="#" aria-label="Share on Instagram">
                    <FaInstagram />
                  </a>
                  <a href="#" aria-label="Share via Email">
                    <FaEnvelope />
                  </a>
                  <a href="#" aria-label="Share on Pinterest">
                    <FaPinterestP />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 basel-productTabs">
          <ProductDetailsTab
            lang={lang}
            description={data?.description}
            productSlug={slug as string}
          />
        </div>
      </div>
    );
  }

  // Default theme layout
  return (
    <div className="pt-6 pb-2 md:pt-7">
      <div className="grid-cols-10 lg:grid gap-7 2xl:gap-8">
        <div className="col-span-5 mb-6 overflow-hidden xl:col-span-6 md:mb-8 lg:mb-0">
          {!!data?.gallery?.length ? (
            <ThumbnailCarousel
              gallery={data?.gallery}
              thumbnailClassName="xl:w-[700px] 2xl:w-[900px]"
              galleryClassName="xl:w-[150px] 2xl:w-[170px]"
              lang={lang}
            />
          ) : (
            <div className="flex items-center justify-center w-auto">
              <Image
                src={data?.image?.original ?? '/product-placeholder.svg'}
                alt={data?.name!}
                width={900}
                height={680}
                style={{ width: 'auto' }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col col-span-5 shrink-0 xl:col-span-4 xl:ltr:pl-2 xl:rtl:pr-2">
          <div className="pb-3 lg:pb-5">
            <div className="md:mb-2.5 block -mt-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-medium transition-colors duration-300 text-brand-dark md:text-xl xl:text-2xl">
                  {displayName}
                </h2>
                {isMadeToOrder && (
                  <span className="inline-block rounded font-bold text-xs md:text-sm bg-purple-100 text-purple-700 uppercase px-2 py-1">
                    Made to Order
                  </span>
                )}
              </div>
            </div>
            {data?.unit && isEmpty(variations) ? (
              <div className="text-sm font-medium md:text-15px">
                {data?.unit}
              </div>
            ) : (
              <VariationPrice
                selectedVariation={selectedVariation}
                minPrice={data?.min_price}
                maxPrice={data?.max_price}
                lang={lang}
              />
            )}

            {isEmpty(variations) && (
              <div className="flex flex-col gap-2 mt-5">
                <div className="flex items-center">
                  <div className="text-brand-dark font-bold text-base md:text-xl xl:text-[22px]">
                    {price}
                  </div>
                  {discount && (
                    <>
                      <del className="text-sm text-opacity-50 md:text-15px ltr:pl-3 rtl:pr-3 text-brand-dark ">
                        {basePrice}
                      </del>
                      <span className="inline-block rounded font-bold text-xs md:text-sm bg-brand-tree bg-opacity-20 text-brand-tree uppercase px-2 py-1 ltr:ml-2.5 rtl:mr-2.5">
                        {discount} {t('text-off')}
                      </span>
                    </>
                  )}
                </div>
                {productionTime && (
                  <div className="text-sm text-brand-muted">
                    Ships in {productionTime.min}-{productionTime.max} business days
                  </div>
                )}
              </div>
            )}
          </div>

          {Object.keys(variations).map((variation) => {
            return (
              <ProductAttributes
                key={`popup-attribute-key${variation}`}
                variations={variations}
                attributes={attributes}
                setAttributes={setAttributes}
              />
            );
          })}

          <div className="pb-2">
            {/* check that item isInCart and place the available quantity or the item quantity */}
            {isEmpty(variations) && (
              <>
                {isMadeToOrder ? (
                  <span className="text-sm font-medium text-purple-600">
                    Made to Order
                  </span>
                ) : hasStock ? (
                  <span className={`text-sm font-medium ${isLowStock ? 'text-orange-500' : 'text-yellow'}`}>
                    {isLowStock ? (
                      <>
                        {t('text-only')} {availableStock} {t('text-left-item')} - Low Stock
                      </>
                    ) : (
                      <>
                        {availableStock > 0
                          ? `${t('text-only')} ${availableStock} ${t('text-left-item')}`
                          : t('text-in-stock')}
                      </>
                    )}
                  </span>
                ) : (
                  <div className="text-base text-red-500 whitespace-nowrap">
                    {t('text-out-stock')}
                  </div>
                )}
              </>
            )}

            {!isEmpty(selectedVariation) && (
              <span className="text-sm font-medium text-yellow">
                {selectedVariation?.is_disable ||
                selectedVariation.quantity === 0
                  ? t('text-out-stock')
                  : `${
                      t('text-only') +
                      ' ' +
                      selectedVariation.quantity +
                      ' ' +
                      t('text-left-item')
                    }`}
              </span>
            )}
          </div>

          {personalizationOptions.length > 0 && (
            <PersonalizationForm
              options={personalizationOptions}
              values={personalizations}
              onChange={setPersonalizations}
              lang={lang}
            />
          )}

          <div className="pt-1.5 lg:pt-3 xl:pt-4 space-y-2.5 md:space-y-3.5">
            {quantityError && (
              <p className="text-sm text-red-500">{quantityError}</p>
            )}
            <Counter
              variant="single"
              value={selectedQuantity}
              onIncrement={() =>
                setSelectedQuantity((prev) =>
                  maxQuantity ? Math.min(prev + 1, maxQuantity) : prev + 1
                )
              }
              onDecrement={() =>
                setSelectedQuantity((prev) => Math.max(prev - 1, minQuantity))
              }
              disabled={
                isMadeToOrder
                  ? false
                  : isInCart(item.id)
                  ? cartQuantity + selectedQuantity >= Number(availableStock)
                  : selectedQuantity >= Number(availableStock)
              }
              lang={lang}
            />
            <Button
              onClick={addToCart}
              className="w-full px-1.5"
              disabled={!canAddToCart}
              loading={addToCartLoader}
            >
              <CartIcon color="#ffffff" className="ltr:mr-3 rtl:ml-3" />
              {t('text-add-to-cart')}
            </Button>
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                variant="border"
                onClick={addToWishlist}
                loading={addToWishlistLoader}
                className={`group hover:text-brand ${
                  favorite === true && 'text-brand'
                }`}
              >
                {favorite === true ? (
                  <IoIosHeart className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all" />
                ) : (
                  <IoIosHeartEmpty className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all group-hover:text-brand" />
                )}

                {t('text-wishlist')}
              </Button>
              <div className="relative group">
                <Button
                  variant="border"
                  className={`w-full hover:text-brand ${
                    shareButtonStatus === true && 'text-brand'
                  }`}
                  onClick={handleChange}
                >
                  <IoArrowRedoOutline className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all group-hover:text-brand" />
                  {t('text-share')}
                </Button>
                <SocialShareBox
                  className={`absolute z-10 ltr:right-0 rtl:left-0 w-[300px] md:min-w-[400px] transition-all duration-300 ${
                    shareButtonStatus === true
                      ? 'visible opacity-100 top-full'
                      : 'opacity-0 invisible top-[130%]'
                  }`}
                  shareUrl={productUrl}
                  lang={lang}
                />
              </div>
            </div>
          </div>
          {data?.tag && (
            <ul className="pt-5 xl:pt-6">
              <li className="relative inline-flex items-center justify-center text-sm md:text-15px text-brand-dark text-opacity-80 ltr:mr-2 rtl:ml-2 top-1">
                <LabelIcon className="ltr:mr-2 rtl:ml-2" /> {t('text-tags')}:
              </li>
              {data?.tag?.map((item: any) => (
                <li className="inline-block p-[3px]" key={`tag-${item.id}`}>
                  <TagLabel data={item} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <ProductDetailsTab
        lang={lang}
        description={data?.description}
        productSlug={slug as string}
      />
    </div>
  );
};

export default ProductSingleDetails;
