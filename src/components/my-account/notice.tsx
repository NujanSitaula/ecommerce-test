'use client';

import { legalSetting } from '@settings/legal-setting';
import Heading from '@components/ui/heading';
import { Element } from 'react-scroll';
import { useTranslation } from 'src/app/i18n/client';

function makeTitleToDOMId(title: string) {
  return title.toLowerCase().split(' ').join('_');
}

export default function LegalPage({ lang }: { lang: string }) {
  const { t } = useTranslation(lang, 'legal');
  return (
    <>
      <div className="lg:max-h-[575px] lg:overflow-scroll scrollbar">
        <Heading variant="titleLarge">
          {t('common:text-account-details-notice')}
        </Heading>
        <div className="pt-6">
          <div className="w-full">
            {legalSetting?.map((item) => (
              // @ts-ignore
              <Element
                key={item.title}
                id={makeTitleToDOMId(item.title)}
                className="mb-5 lg:mb-10"
              >
                <h2 className="text-base  md:text-[17px] 2xl:text-lg text-brand-dark font-medium mb-4">
                  {t(`${item.title}`)}
                </h2>
                <div
                  className="text-sm leading-7 text-brand-dark opacity-70 lg:text-14px lg:leading-loose"
                  dangerouslySetInnerHTML={{
                    // @ts-ignore
                    __html: t(`${item.description}`),
                  }}
                />
              </Element>
            ))}
          </div>
          {/* End of content */}
        </div>
      </div>
    </>
  );
}
