'use client';

import React from 'react';
import Link from '@components/ui/link';
import { ROUTES } from '@utils/routes';
import { useCart } from '@contexts/cart/cart.context';
import { usePathname } from 'next/navigation';

export default function BaselMobileBottomNav({ lang }: { lang: string }) {
  const cart = useCart();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const items = [
    {
      label: 'Shop',
      href: `/${lang}${ROUTES.PRODUCTS}`,
      icon: 'icon-grid',
      matchPrefix: `/${lang}${ROUTES.PRODUCTS}`,
    },
    {
      label: 'Wishlist',
      href: `/${lang}${ROUTES.WISHLIST}`,
      icon: 'icon-heart',
      matchPrefix: `/${lang}${ROUTES.WISHLIST}`,
      badge: 0,
    },
    {
      label: 'Cart',
      href: `/${lang}/basel/cart`,
      icon: 'icon-basket',
      matchPrefix: `/${lang}/basel/cart`,
      badge: mounted ? cart.totalItems : 0,
    },
    {
      label: 'My account',
      href: `/${lang}${ROUTES.ACCOUNT}`,
      icon: 'icon-user',
      matchPrefix: `/${lang}${ROUTES.ACCOUNT}`,
    },
  ];

  return (
    <nav className="basel-bottomNav d-lg-none">
      {items.map((item) => {
        const active = pathname.startsWith(item.matchPrefix);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`basel-bottomNav-item${active ? ' active' : ''}`}
          >
            <span className="basel-bottomNav-iconWrap">
              <i className={`icons ${item.icon}`} aria-hidden="true" />
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="basel-bottomNav-badge">{item.badge}</span>
              )}
            </span>
            <span className="basel-bottomNav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
