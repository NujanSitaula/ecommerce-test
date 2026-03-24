'use client';

import MobileNavigation from '@layouts/mobile-navigation/mobile-navigation';
import Header from '@layouts/antique-refined/header';
import Footer from '@layouts/footer/footer';
import HighlightedBar from '@components/common/highlighted-bar';
import Link from '@components/ui/link';
import { useTranslation } from 'src/app/i18n/client';
import { IoChevronForwardCircleOutline } from 'react-icons/io5';
import { useSessionStorage } from 'react-use';
import { useIsMounted } from '@utils/use-is-mounted';

function ClientRenderedHightLightedBar({ lang }: { lang: string }) {
  const { t } = useTranslation(lang, 'common');
  const [highlightedBar, setHighlightedBar] = useSessionStorage(
    'borobazar-highlightedBar',
    'false',
  );
  return (
    <>
      {highlightedBar !== 'true' && (
        <HighlightedBar
          onClose={() => setHighlightedBar('true')}
          className="text-brand-light]"
        >
          <div className="text-sm font-medium py-0.5 ltr:pr-6 rtl:pl-6">
            <span>
              {t(
                '35% Exclusive discount plus free next day delivery, excludes sale',
              )}
              <Link
                href={`/${lang}`}
                className="opacity-80 inline-flex text-xs uppercase font-bold ltr:pl-1.5 rtl:pr-1.5 items-center relative transition-all hover:opacity-100"
              >
                <span className="border-b border-brand-light inline-block pb-0.5">
                  Learn More
                </span>
                <IoChevronForwardCircleOutline className="text-xl ltr:ml-1 rtl:mr-1 relative -top-0.5" />
              </Link>
            </span>
          </div>
        </HighlightedBar>
      )}
    </>
  );
}

export default function AntiqueRefinedLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const isMounted = useIsMounted();
  return (
    <div className="flex flex-col min-h-screen">
      {isMounted && <ClientRenderedHightLightedBar lang={lang} />}
      {/* End of highlighted bar  */}

      <Header lang={lang} />
      <main
        className="relative flex-grow"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </main>
      <Footer lang={lang} />
      <MobileNavigation lang={lang} />
    </div>
  );
}
