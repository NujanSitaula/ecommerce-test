'use client';

import Button from '@components/ui/button';
import { useModalAction } from '@components/common/modal/modal.context';
import { useUI } from '@contexts/ui.context';
import { useTranslation } from 'src/app/i18n/client';

export default function CheckoutProtected({
  lang,
  children,
}: React.PropsWithChildren<{ lang: string }>) {
  // Allow both authenticated and guest users to access checkout
  // Guest checkout is now supported
  return <>{children}</>;
}


