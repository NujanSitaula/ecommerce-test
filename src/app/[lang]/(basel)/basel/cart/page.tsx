 'use client';

import Link from '@components/ui/link';
import { ROUTES } from '@utils/routes';
import { useCart } from '@contexts/cart/cart.context';
import { useTranslation } from 'src/app/i18n/client';
import BaselBreadcrumb from '../basel-breadcrumb';

function formatMoney(amount: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export default function BaselCartPage({ params }: { params: any }) {
  const lang = params?.lang ?? 'en';
  const { t } = useTranslation(lang, 'common');
  const {
    items,
    total,
    isEmpty,
    addItemToCart,
    removeItemFromCart,
    clearItemFromCart,
  } = useCart();

  return (
    <>
      <BaselBreadcrumb lang={lang} />

      <div className="pt-3 pt-lg-4 pb-4 pb-lg-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <h1 className="h4 mb-3">CART REVIEW</h1>

              {isEmpty ? (
                <div className="border rounded-3 p-4 text-center bg-light">
                  <p className="mb-2">
                    {t('text-empty-cart') ?? 'Your cart is empty.'}
                  </p>
                  <p className="text-muted small mb-3">
                    {t('text-empty-cart-description') ??
                      'Please add product to your cart list'}
                  </p>
                  <Link
                    href={`/${lang}${ROUTES.PRODUCTS}`}
                    className="btn btn-dark text-uppercase"
                  >
                    {(t('text-shop-page') ?? 'Shop Page').toUpperCase()}
                  </Link>
                </div>
              ) : (
                <div className="border rounded-3">
                  <ul className="list-unstyled mb-0">
                    {items.map((item: any) => (
                      <li
                        key={item.id}
                        className="border-bottom last:border-0 p-3 p-md-4"
                      >
                        <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                          <div className="flex-shrink-0" style={{ width: 80, height: 80, overflow: 'hidden', borderRadius: 4 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                item?.image ||
                                '/assets/placeholder/cart-item.svg'
                              }
                              alt={item?.name ?? 'Product image'}
                              width={80}
                              height={80}
                              style={{ width: 80, height: 80, objectFit: 'cover', display: 'block' }}
                            />
                          </div>
                          <div className="flex-grow-1" style={{ minWidth: 0 }}>
                            <div className="d-flex justify-content-between align-items-start gap-3">
                              <div style={{ minWidth: 0 }}>
                                <div className="fw-semibold text-truncate">
                                  {item.name}
                                </div>
                                <div className="text-muted small mt-1">
                                  {item.quantity} ×{' '}
                                  {formatMoney(item.price ?? 0)}
                                </div>
                              </div>
                              <button
                                type="button"
                                className="btn btn-link btn-sm text-decoration-none text-muted p-0"
                                onClick={() => clearItemFromCart(item.id)}
                                aria-label="Remove item"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mt-3">
                              <div className="d-inline-flex align-items-center gap-2 basel-miniCartQtyGroup">
                                <button
                                  type="button"
                                  className="basel-miniCartQtyBtn"
                                  onClick={() => removeItemFromCart(item.id)}
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="small fw-semibold">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  className="basel-miniCartQtyBtn"
                                  onClick={() => addItemToCart(item, 1)}
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                              <div className="fw-semibold">
                                {formatMoney(
                                  (item.price ?? 0) * (item.quantity ?? 1),
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="col-12 col-lg-4">
              <div
                className="border rounded-3 p-4 bg-light position-sticky"
                style={{ top: 96 }}
              >
                <h2 className="h5 mb-3">
                  {(t('text-summary') ?? 'Summary').toUpperCase()}
                </h2>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">
                    {(t('text-sub-total') ?? 'Subtotal').toUpperCase()}
                  </span>
                  <span className="fw-semibold">
                    {formatMoney(total ?? 0)}
                  </span>
                </div>
                <hr className="my-3" />
                <div className="d-grid gap-2">
                  <Link
                    href={`/${lang}/basel/checkout`}
                    className="btn basel-cartCheckoutBtn w-100 text-uppercase"
                  >
                    {(t('text-proceed-to-checkout') ?? 'Proceed to checkout').toUpperCase()}
                  </Link>
                  <Link
                    href={`/${lang}${ROUTES.PRODUCTS}`}
                    className="btn btn-light w-100 text-uppercase"
                  >
                    {(t('text-continue-shopping') ?? 'Continue shopping').toUpperCase()}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

