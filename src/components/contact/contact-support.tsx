'use client';

import { FC } from 'react';
import Text from '@components/ui/text';
import Image from '@components/ui/image';
import Heading from '@components/ui/heading';
import Link from '@components/ui/link';
import { useIsMounted } from '@utils/use-is-mounted';
import { useTranslation } from 'src/app/i18n/client';

const supportData = [
  {
    id: 1,
    slug: '/',
    name: 'Jessica Twain',
    thumbnail: '/assets/images/support/1.png',
  },
  {
    id: 1,
    slug: '/',
    name: 'Jason',
    thumbnail: '/assets/images/support/2.png',
  },
  {
    id: 1,
    slug: '/',
    name: 'Jessica',
    thumbnail: '/assets/images/support/3.png',
  },
  {
    id: 1,
    slug: '/',
    name: 'Hayden',
    thumbnail: '/assets/images/support/4.png',
  },
];

interface Props {
  lang: string;
  image?: HTMLImageElement;
}

const ContactSupport: FC<Props> = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');
  const mounted = useIsMounted();
  return (
    <div className="mb-0 3xl:ltr:pr-5 3xl:rtl:pl-5">
      <Heading variant="heading" className="mb-3 lg:mb-4 xl:mb-5">
        {mounted && <>{t('contact-form-info-title')}</>}
      </Heading>
      <Text className="xl:leading-8">
        {mounted && <>{t('contact-form-info-content')}</>}
      </Text>
      <div className="flex mt-5 -mx-1">
        {supportData.map((item, idx) => (
          <Link
            href={item.slug}
            key={idx}
            className="mx-1 transition-all shrink-0 hover:opacity-90"
          >
            <Image
              src={item.thumbnail}
              alt={item.name}
              width={45}
              height={45}
              style={{ width: 'auto' }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContactSupport;
