import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import isEmpty from 'lodash/isEmpty';
import { ROUTES } from '@utils/routes';
import Button from '@components/ui/button';
import Counter from '@components/ui/counter';
import { useCart } from '@contexts/cart/cart.context';
import ProductAttributes from '@components/product/product-attributes';
import { generateCartItem } from '@utils/generate-cart-item';
import usePrice from '@framework/product/use-price';
import { getVariations } from '@framework/utils/get-variations';
import { useTranslation } from 'src/app/i18n/client';
import ThumbnailCarousel from '@components/ui/carousel/thumbnail-carousel';
import Image from '@components/ui/image';
import CartIcon from '@components/icons/cart-icon';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import TagLabel from '@components/ui/tag-label';
import LabelIcon from '@components/icons/label-icon';
import { IoArrowRedoOutline } from 'react-icons/io5';
import RelatedProductFeed from '@components/product/feeds/related-product-feed';
import SocialShareBox from '@components/ui/social-share-box';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import {
  useModalAction,
  useModalState,
} from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import VariationPrice from './variation-price';
import isEqual from 'lodash/isEqual';
import { productGalleryPlaceholder } from '@assets/placeholders';
import { useUI } from '@contexts/ui.context';
import {
  useAddWishlistMutation,
  useRemoveWishlistMutation,
  useWishlistIdsQuery,
} from '@framework/product/get-wishlist-product';

const breakpoints = {
  '1536': {
    slidesPerView: 6,
  },
  '1280': {
    slidesPerView: 5,
  },
  '1024': {
    slidesPerView: 4,
  },
  '640': {
    slidesPerView: 3,
  },
  '360': {
    slidesPerView: 2,
  },
  '0': {
    slidesPerView: 1,
  },
};

export default function ProductPopup({ lang }: { lang: string }) {
  const { t } = useTranslation(lang, 'common');
  const { data } = useModalState();
  const { width } = useWindowSize();
  const { closeModal } = useModalAction();
  const router = useRouter();
  const { isAuthorized } = useUI();
  const { addItemToCart, isInCart, getItemFromCart, isInStock } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [addToWishlistLoader, setAddToWishlistLoader] =
    useState<boolean>(false);
  const { data: wishlistIds = [] } = useWishlistIdsQuery(isAuthorized);
  const addWishlistMutation = useAddWishlistMutation();
  const removeWishlistMutation = useRemoveWishlistMutation();
  const [shareButtonStatus, setShareButtonStatus] = useState<boolean>(false);
  const displayName =
    data?.name ||
    data?.title ||
    data?.product_name ||
    data?.productName ||
    data?.slug ||
    '';
  const { price, basePrice, discount } = usePrice({
    amount: data.sale_price ? data.sale_price : data.price,
    baseAmount: data.price,
    currencyCode: 'USD',
  });
  const variations = getVariations(data.variations);
  const { slug, image, unit, description, gallery, tag, quantity } = data;
  const productId = data?.id ? String(data.id) : null;
  const favorite = productId ? wishlistIds.includes(productId) : false;
  const productUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${lang}${ROUTES.PRODUCT}/${slug}`;
  const isBaselVariant = data?.uiVariant === 'basel';
  const handleChange = () => {
    setShareButtonStatus(!shareButtonStatus);
  };
  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation),
      )
    : true;
  let selectedVariation: any = {};
  if (isSelected) {
    selectedVariation = data?.variation_options?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort(),
      ),
    );
  }
  const item = generateCartItem(data, selectedVariation);
  const outOfStock = isInCart(item.id) && !isInStock(item.id);

  const baselGallery =
    (gallery && gallery.length > 0
      ? gallery
      : image
      ? [{ id: 'main', original: image.original }]
      : []) ?? [];
  const [baselActiveIndex, setBaselActiveIndex] = useState(0);

  function addToCart() {
    if (!isSelected) return;
    // to show btn feedback while product carting
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 1500);
    addItemToCart(item, selectedQuantity);
    // @ts-ignore
    toast(t('text-added-bag'), {
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
      closeModal();
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

  function navigateToProductPage() {
    closeModal();
    router.push(`/${lang}/${ROUTES.PRODUCT}/${slug}`);
  }

  useEffect(() => setSelectedQuantity(1), [data.id]);

  useEffect(() => {
    setBaselActiveIndex(0);
  }, [data.id]);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'quickview',
        hypothesisId: 'H2',
        location: 'product-popup.tsx:mount',
        message: 'ProductPopup opened',
        data: {
          id: data?.id,
          slug: data?.slug,
          name: data?.name,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [data?.id]);

  if (isBaselVariant) {
    return (
      <div className="basel-quickView">
        <button
          type="button"
          className="basel-quickViewClose"
          onClick={closeModal}
          aria-label={t('text-close') ?? 'Close'}
        >
          ×
        </button>
        <div className="row basel-quickViewRow">
          <div className="col-md-6 basel-quickViewImageCol">
            <div className="basel-quickViewImageWrap">
              <Image
                src={
                  baselGallery[baselActiveIndex]?.original ??
                  image?.original ??
                  productGalleryPlaceholder
                }
                alt={name!}
                width={650}
                height={590}
                className="basel-quickViewImage"
              />
              {baselGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    className="basel-quickViewNav basel-quickViewNavPrev"
                    onClick={() =>
                      setBaselActiveIndex((prev) =>
                        prev === 0 ? baselGallery.length - 1 : prev - 1,
                      )
                    }
                    aria-label={t('text-previous') ?? 'Previous image'}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="basel-quickViewNav basel-quickViewNavNext"
                    onClick={() =>
                      setBaselActiveIndex((prev) =>
                        prev === baselGallery.length - 1 ? 0 : prev + 1,
                      )
                    }
                    aria-label={t('text-next') ?? 'Next image'}
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="col-md-6 basel-quickViewBodyCol">
            <div className="basel-quickViewBody">
              <h2
                className="basel-quickViewTitle"
                onClick={navigateToProductPage}
                role="button"
              >
                {displayName}
              </h2>
              {isEmpty(variations) && (
                <div className="basel-quickViewPrice">
                  {price}
                  {discount && (
                    <del className="basel-quickViewBasePrice ms-2">
                      {basePrice}
                    </del>
                  )}
                </div>
              )}
              {description && (
                <p className="basel-quickViewExcerpt">
                  {description.split(' ').slice(0, 40).join(' ')}...
                </p>
              )}

              {Object.keys(variations).length > 0 && (
                <div className="basel-quickViewAttrs">
                  {Object.keys(variations).map((variation) => (
                    <ProductAttributes
                      key={`popup-attribute-key${variation}`}
                      variations={variations}
                      attributes={attributes}
                      setAttributes={setAttributes}
                    />
                  ))}
                </div>
              )}

              <div className="basel-quickViewActions">
                <div className="basel-quickViewQty">
                  <button
                    type="button"
                    className="basel-quickViewQtyBtn"
                    onClick={() =>
                      setSelectedQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                    disabled={selectedQuantity <= 1}
                    aria-label={t('text-decrease') ?? 'Decrease quantity'}
                  >
                    −
                  </button>
                  <span className="basel-quickViewQtyValue">
                    {selectedQuantity}
                  </span>
                  <button
                    type="button"
                    className="basel-quickViewQtyBtn"
                    onClick={() =>
                      setSelectedQuantity((prev) => prev + 1)
                    }
                    disabled={
                      isInCart(item.id)
                        ? getItemFromCart(item.id).quantity +
                            selectedQuantity >=
                          Number(item.stock)
                        : selectedQuantity >= Number(item.stock)
                    }
                    aria-label={t('text-increase') ?? 'Increase quantity'}
                  >
                    +
                  </button>
                </div>
                <Button
                  onClick={addToCart}
                  className="basel-quickViewAddBtn"
                  disabled={!isSelected}
                  loading={addToCartLoader}
                >
                  {t('text-add-to-cart') ?? 'Add to cart'}
                </Button>
              </div>

              <div className="basel-quickViewMeta">
                {data?.sku && (
                  <div>
                    <strong>SKU :</strong> {data.sku}
                  </div>
                )}
                {data?.categories?.length ? (
                  <div>
                    <strong>Category :</strong>{' '}
                    {data.categories[0]?.name ?? data.categories[0]}
                  </div>
                ) : null}
                <div className="basel-quickViewShareRow">
                  <strong>Share :</strong>
                  <div className="basel-quickViewShareIcons">
                    <a href={productUrl} aria-label="Share on Facebook">
                      <i className="icons icon-social-facebook" />
                    </a>
                    <a href={productUrl} aria-label="Share on Twitter">
                      <i className="icons icon-social-twitter" />
                    </a>
                    <a href={productUrl} aria-label="Share on Instagram">
                      <i className="icons icon-social-instagram" />
                    </a>
                    <a href={productUrl} aria-label="Share by email">
                      <i className="icons icon-envelope-open" />
                    </a>
                    <a href={productUrl} aria-label="Share on Google Plus">
                      <i className="icons icon-social-google" />
                    </a>
                    <a href={productUrl} aria-label="Share on Pinterest">
                      <i className="icons icon-social-pinterest" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-[600px] lg:w-[940px] xl:w-[1180px] 2xl:w-[1360px] mx-auto p-1 lg:p-0 xl:p-3 bg-brand-light rounded-md">
      <CloseButton onClick={closeModal} />
      <div className="overflow-hidden">
        <div className="px-4 pt-4 md:px-6 lg:p-8 2xl:p-10 mb-9 lg:mb-2 md:pt-7 2xl:pt-10">
          <div className="items-start justify-between lg:flex">
            <div className="items-center justify-center mb-6 overflow-hidden xl:flex md:mb-8 lg:mb-0">
              {!!gallery?.length ? (
                <ThumbnailCarousel gallery={gallery} lang={lang} />
              ) : (
                <div className="flex items-center justify-center w-auto">
                  <Image
                    src={image?.original ?? productGalleryPlaceholder}
                    alt={name!}
                    width={650}
                    height={590}
                    style={{ width: 'auto' }}
                  />
                </div>
              )}
            </div>

            <div className="shrink-0 flex flex-col lg:ltr:pl-5 lg:rtl:pr-5 xl:ltr:pl-8 xl:rtl:pr-8 2xl:ltr:pl-10 2xl:rtl:pr-10 lg:w-[430px] xl:w-[470px] 2xl:w-[480px]">
              <div className="pb-5">
                <div
                  className="mb-2 md:mb-2.5 block -mt-1.5"
                  onClick={navigateToProductPage}
                  role="button"
                >
              <h2 className="text-lg font-medium transition-colors duration-300 text-brand-dark md:text-xl xl:text-2xl hover:text-brand">
                {displayName}
              </h2>
                </div>
                {unit && isEmpty(variations) ? (
                  <div className="text-sm font-medium md:text-15px">{unit}</div>
                ) : (
                  <VariationPrice
                    selectedVariation={selectedVariation}
                    minPrice={data.min_price}
                    maxPrice={data.max_price}
                    lang={lang}
                  />
                )}

                {isEmpty(variations) && (
                  <div className="flex items-center mt-5">
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
                    {Number(quantity) > 0 || !outOfStock ? (
                      <span className="text-sm font-medium text-yellow">
                        {t('text-only') +
                          ' ' +
                          quantity +
                          ' ' +
                          t('text-left-item')}
                      </span>
                    ) : (
                      <div className="text-base text-brand-danger whitespace-nowrap">
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

              <div className="pt-1.5 lg:pt-3 xl:pt-4 space-y-2.5 md:space-y-3.5">
                <Counter
                  variant="single"
                  value={selectedQuantity}
                  onIncrement={() => setSelectedQuantity((prev) => prev + 1)}
                  onDecrement={() =>
                    setSelectedQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                  }
                  disabled={
                    isInCart(item.id)
                      ? getItemFromCart(item.id).quantity + selectedQuantity >=
                        Number(item.stock)
                      : selectedQuantity >= Number(item.stock)
                  }
                  lang={lang}
                />
                <Button
                  onClick={addToCart}
                  className="w-full px-1.5"
                  disabled={!isSelected}
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
              {tag && (
                <ul className="pt-5 xl:pt-6">
                  <li className="relative inline-flex items-center justify-center text-sm md:text-15px text-brand-dark text-opacity-80 ltr:mr-2 rtl:ml-2 top-1">
                    <LabelIcon className="ltr:mr-2 rtl:ml-2" /> {t('text-tags')}
                    :
                  </li>
                  {tag?.map((item: any) => (
                    <li className="inline-block p-[3px]" key={`tag-${item.id}`}>
                      <TagLabel data={item} />
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-6 xl:pt-8">
                <Heading className="mb-3 lg:mb-3.5">
                  {t('text-product-details')}:
                </Heading>
                <Text variant="small">
                  {description.split(' ').slice(0, 40).join(' ')}
                  {'...'}
                  <span
                    onClick={navigateToProductPage}
                    role="button"
                    className="text-brand ltr:ml-0.5 rtl:mr-0.5"
                  >
                    {t('text-read-more')}
                  </span>
                </Text>
              </div>
            </div>
          </div>
        </div>
        <RelatedProductFeed
          carouselBreakpoint={breakpoints}
          className="mb-0.5 md:mb-2 lg:mb-3.5 xl:mb-4 2xl:mb-6"
          lang={lang}
          productSlug={slug as string}
        />
      </div>
    </div>
  );
}
