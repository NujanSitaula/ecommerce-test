'use client';

import { useEffect } from 'react';

export default function ScrollToTopOnSlug({ slug }: { slug: string }) {
  useEffect(() => {
    // Force scroll to top after route transition (slug change),
    // so the product opens at the top even if user previously scrolled.
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0 });
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0 });
      });
    });
  }, [slug]);

  return null;
}

