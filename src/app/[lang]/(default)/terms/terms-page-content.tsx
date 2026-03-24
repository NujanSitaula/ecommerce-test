'use client';

import { useTranslation } from 'src/app/i18n/client';
import Container from '@components/ui/container';
import { termsAndServices } from '@settings/terms-settings';
import Heading from '@components/ui/heading';

export default function TermsPageContent({ lang }: { lang: string }) {
  const { t } = useTranslation(lang, 'terms');
  return (
    <div className="py-12 lg:py-16 2xl:py-20">
      <Container>
        <div className="w-full xl:max-w-[1200px] mx-auto">
          {termsAndServices?.map((item) => (
            // @ts-ignore
            <div
              key={item.title}
              className="mb-8 lg:mb-12 last:mb-0 order-list-enable"
            >
              <Heading className="mb-4 lg:mb-6 font-body" variant="title">
                {t(item.title)}
              </Heading>
              <div
                className="space-y-5 text-sm leading-7 text-brand-muted lg:text-15px"
                dangerouslySetInnerHTML={{
                  // @ts-ignore
                  __html: t(item.description),
                }}
              />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
