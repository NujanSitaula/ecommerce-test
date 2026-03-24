'use client';

import Heading from '@components/ui/heading';
import Accordion from '@components/ui/accordion';
import { help } from '@settings/help-setting';
import { useTranslation } from 'src/app/i18n/client';

export default function HelpCenter({ lang }: { lang: string }) {
  const { t } = useTranslation(lang, 'common');
  return (
    <>
      <Heading variant="titleLarge">{t('text-account-details-help')}</Heading>
      <div className="flex flex-col pt-6 2xl:pt-8">
        {help?.map((item, index) => (
          <Accordion
            key={`${item.title}-${index}`}
            item={item}
            translatorNS="help"
            lang={lang}
          />
        ))}
      </div>
    </>
  );
}
