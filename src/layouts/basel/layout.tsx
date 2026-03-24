'use client';

import React from 'react';
import BaselHeader from '@layouts/basel/header';
import BaselFooter from '@layouts/basel/footer';
import BaselMobileBottomNav from '@layouts/basel/mobile-bottom-nav';

export default function BaselLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  return (
    <div className="basel-root d-flex flex-column min-vh-100">
      <BaselHeader lang={lang} />
      <main className="flex-grow-1">{children}</main>
      <BaselFooter />
      <BaselMobileBottomNav lang={lang} />
    </div>
  );
}

