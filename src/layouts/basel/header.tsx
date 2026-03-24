'use client';

import React from 'react';
import Image from 'next/image';
import Link from '@components/ui/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@utils/routes';
import { useCart } from '@contexts/cart/cart.context';
import { useModalAction } from '@components/common/modal/modal.context';
import { useUI } from '@contexts/ui.context';
import { useTranslation } from 'src/app/i18n/client';
import BaselSearch from '@components/common/basel-search';
import cn from 'classnames';
import LanguageSwitcher from '@components/ui/language-switcher';
import { siteSettings } from '@settings/site-settings';

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

export default function BaselHeader({ lang }: { lang: string }) {
  const router = useRouter();
  const { t } = useTranslation(lang, 'common');
  const { openModal } = useModalAction();
  const { isAuthorized } = useUI();
  const cart = useCart();
  const { addItemToCart, removeItemFromCart, clearItemFromCart } = cart;

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [miniCartOpen, setMiniCartOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const cartReady = mounted;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!miniCartOpen && !mobileMenuOpen && !searchOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMiniCartOpen(false);
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [miniCartOpen, mobileMenuOpen, searchOpen]);

  React.useEffect(() => {
    if (!searchOpen) return;
    const timer = window.setTimeout(() => {
      const input = searchRef.current?.querySelector('input');
      if (input) {
        input.focus();
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  return (
    <>
      <div className="basel-topbar py-2">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="small">
            {t('text-phone') ?? 'Phone'}:{' '}
            <a href="tel:+77756334876">+77 (756) 334 876</a>
          </div>
          <div className="d-none d-lg-flex gap-3 small align-items-center">
            <Link href={`/${lang}${ROUTES.ACCOUNT}`} className="text-white">
              {t('text-my-account') ?? 'My Account'}
            </Link>
            <Link href={`/${lang}/basel/checkout`} className="text-white">
              {t('text-checkout') ?? 'Checkout'}
            </Link>
            <Link href={`/${lang}${ROUTES.CONTACT}`} className="text-white">
              {t('text-contact-us') ?? 'Contact Us'}
            </Link>
            <LanguageSwitcher lang={lang} />
          </div>
        </div>
      </div>

      <header className="basel-headerMain sticky-top">
        <div className="container py-3">
          <div className="row align-items-center g-3">
            <div className="col-4 col-lg-4 order-1 order-lg-1">
              <nav className="d-none d-lg-flex gap-3 align-items-center">
                <Link
                  href={`/${lang}${ROUTES.HOME}`}
                  className="text-decoration-none text-dark"
                >
                  Home
                </Link>
                <Link
                  href={`/${lang}${ROUTES.PRODUCTS}`}
                  className="text-decoration-none text-dark"
                >
                  Shop
                </Link>
              </nav>
              <button
                type="button"
                className="basel-iconButton d-lg-none"
                aria-label="Open menu"
                onClick={() => setMobileMenuOpen(true)}
              >
                <i className="icons icon-menu" aria-hidden="true" />
              </button>
            </div>

            <div className="col-4 col-lg-4 order-2 order-lg-2 text-center">
              <Link
                href={`/${lang}${ROUTES.HOME}`}
                className="basel-logo d-inline-flex align-items-center justify-content-center"
              >
                <Image
                  src={siteSettings.logo.url}
                  alt={siteSettings.logo.alt}
                  width={160}
                  height={40}
                  priority
                />
              </Link>
            </div>

            <div className="col-4 col-lg-4 order-3 order-lg-3">
              <div className="d-flex justify-content-end align-items-center gap-3">
                <div className="d-none d-lg-flex align-items-center gap-2">
                  {isAuthorized ? (
                    <Link
                      href={`/${lang}${ROUTES.ACCOUNT}`}
                      className="text-decoration-none text-dark small"
                    >
                      {t('text-my-account') ?? 'My Account'}
                    </Link>
                  ) : (
                    <>
                      <Link
                        href={`/${lang}/basel/signin`}
                        className="text-decoration-none text-dark small"
                      >
                        {t('text-sign-in') ?? 'Sign in'}
                      </Link>
                      <span className="text-muted">/</span>
                      <Link
                        href={`/${lang}/basel/signup`}
                        className="text-decoration-none text-dark small"
                      >
                        {t('text-sign-up') ?? 'Sign up'}
                      </Link>
                    </>
                  )}
                </div>

                <div className="d-none d-lg-block border-start opacity-25" style={{ height: 24 }} />

                <button
                  type="button"
                  className="basel-iconButton"
                  aria-label="Open search"
                  onClick={() => setSearchOpen(true)}
                >
                  <i className="icon-magnifier icons" />
                </button>

                <div className="d-none d-lg-block border-start opacity-25" style={{ height: 24 }} />

                <Link
                  href={`/${lang}${ROUTES.WISHLIST}`}
                  className="basel-iconButton text-decoration-none text-dark"
                  aria-label="Wishlist"
                >
                  <i className="icon-heart icons" />
                </Link>

                <button
                  type="button"
                  className="basel-iconButton position-relative"
                  onClick={() => setMiniCartOpen(true)}
                  aria-haspopup="dialog"
                  aria-expanded={miniCartOpen}
                  aria-label="Cart"
                >
                  <i className="icon-basket icons" />
                  {mounted && cart.totalItems > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                      {cart.totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        className={cn('basel-searchOverlay', {
          open: searchOpen,
        })}
        role="presentation"
        onClick={() => setSearchOpen(false)}
      >
        <div
          className={cn('basel-searchModal', {
            open: searchOpen,
          })}
          role="dialog"
          aria-label={t('text-search') ?? 'Search products'}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="basel-searchModalHeader">
            <span className="small text-muted">
              {t('text-search') ?? 'Search products'}
            </span>
            <button
              type="button"
              className="basel-miniCartCloseBtn"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <i className="icons icon-close" aria-hidden="true" />
            </button>
          </div>
          <div className="basel-searchModalBody">
            <BaselSearch lang={lang} />
          </div>
        </div>
      </div>

      <div
        className={cn('basel-miniCartBackdrop', {
          open: mobileMenuOpen,
        })}
        role="presentation"
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className={cn('basel-miniCartPanel', {
          open: mobileMenuOpen,
        })}
        role="dialog"
        aria-label="Mobile menu"
      >
        <div className="basel-miniCartHeader">
          MENU
          <button
            type="button"
            className="basel-miniCartCloseBtn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <i className="icons icon-close" aria-hidden="true" />
          </button>
        </div>
        <div className="basel-miniCartBody d-grid gap-3">
          <Link href={`/${lang}${ROUTES.HOME}`} className="btn btn-light">
            HOME
          </Link>
          <Link
            href={`/${lang}${ROUTES.PRODUCTS}`}
            className="btn btn-light"
          >
            SHOP
          </Link>
          <Link
            href={`/${lang}${ROUTES.ACCOUNT}`}
            className="btn btn-light"
          >
            MY ACCOUNT
          </Link>
          <Link href={`/${lang}/basel/checkout`} className="btn btn-dark">
            CHECKOUT
          </Link>
        </div>
      </div>

      <div
        className={cn('basel-miniCartBackdrop', {
          open: miniCartOpen,
        })}
        role="presentation"
        onClick={() => setMiniCartOpen(false)}
      />
      <div
        className={cn('basel-miniCartPanel', {
          open: miniCartOpen,
        })}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="basel-miniCartHeader">
          Shopping cart
          <button
            type="button"
            className="basel-miniCartCloseBtn"
            onClick={() => setMiniCartOpen(false)}
            aria-label="Close cart"
          >
            <i className="icons icon-close" aria-hidden="true" />
          </button>
        </div>
        <div className="basel-miniCartBody">
          {!cartReady || cart.isEmpty ? (
            <p className="text-muted mb-0">Your cart is empty.</p>
          ) : (
            <ul className="list-unstyled mb-0">
              {cart.items.map((item) => (
                <li
                  key={item.id}
                  className="basel-miniCartItem d-flex align-items-center gap-3"
                >
                  <div className="flex-shrink-0" style={{ width: 56, height: 56, overflow: 'hidden', borderRadius: 4 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item?.image || '/assets/placeholder/cart-item.svg'}
                      alt={item?.name ?? 'Product image'}
                      width={56}
                      height={56}
                      style={{ width: 56, height: 56, objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="fw-semibold small text-truncate">
                      {item.name}
                    </div>
                    <div className="small text-muted mt-1">
                      {item.quantity} × {formatMoney(item.price)}
                    </div>
                  </div>
                  <div className="d-inline-flex align-items-center gap-2 basel-miniCartQtyGroup">
                    <button
                      type="button"
                      className="basel-miniCartQtyBtn"
                      onClick={() => removeItemFromCart(item.id)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="small fw-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      className="basel-miniCartQtyBtn"
                      onClick={() => addItemToCart(item, 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <span className="text-border-three select-none">|</span>
                    <button
                      type="button"
                      className="basel-miniCartRemoveBtn"
                      onClick={() => clearItemFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <i className="icons icon-trash" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="basel-miniCartFooter">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-uppercase small text-muted">Total</span>
            <span className="fw-semibold basel-miniCartTotal">
              {formatMoney(cartReady ? cart.total : 0)}
            </span>
          </div>
          <div className="d-grid gap-2">
            <button
              type="button"
              className="btn btn-light w-100 text-uppercase fw-semibold"
              onClick={() => {
                setMiniCartOpen(false);
                router.push(`/${lang}/basel/cart`);
              }}
            >
              GO TO CART
            </button>
            <Link
              href={`/${lang}/basel/checkout`}
              className="btn basel-miniCartCheckoutBtn w-100 text-uppercase fw-semibold"
            >
              CHECKOUT
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

