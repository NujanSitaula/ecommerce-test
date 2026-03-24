'use client';

import cn from 'classnames';
import Link from '@components/ui/link';
import Image from '@components/ui/image';
import ArrowRight from '@components/icons/arrow-right';
import { useTranslation } from 'src/app/i18n/client';

const data = {
  title: 'app-heading',
  description: 'app-description',
  appBG: '/assets/images/app-bg.png',
  appImage: '/assets/images/delivery-man.png',
};

interface Props {
  lang: string;
  className?: string;
}

const CallToActionMoscow: React.FC<Props> = ({
  lang,
  className = 'pt-1.5 md:pt-0',
}) => {
  const { title, description, appImage } = data;
  const { t } = useTranslation(lang, 'common');
  return (
    <section className={cn('bg-[#FFFAF0] rounded-3xl mt-[100px]', className)}>
      <div className="flex justify-between flex-col-reverse md:flex-row items-end relative max-w-[1920px] mx-auto px-4 sm:px-5 md:px-6 lg:px-16 xl:px-28 2xl:px-32 3xl:px-40">
        <div className="shrink-0 mx-auto md:ltr:ml-0 md:rtl:mr-0 lg:flex lg:items-center pb-5 pt-1.5 md:pt-4 max-w-[350px] md:max-w-[340px] lg:max-w-[415px] xl:max-w-[540px] 2xl:max-w-[630px] 3xl:ltr:pl-10 3xl:rtl:pr-10">
          <div className="py-8 mb-1 text-center xl:py-10 2xl:py-16 md:ltr:text-left md:rtl:text-right">
            <h2 className="text-[22px] md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[42px] leading-9 lg:leading-[1.4em] xl:leading-[1.45em] text-brand-dark font-bold font-manrope -tracking-[0.2px] mb-3 lg:mb-4">
              {t(title)}
            </h2>
            <p className="text-15px xl:text-base 2xl:text-[17px] leading-7 xl:leading-9 text-brand-dark text-opacity-70 pb-5 lg:pb-7 ltr:pr-0 rtl:pl-0 xl:ltr:pr-8 xl:rtl:pl-8 2xl:ltr:pr-12 2xl:rtl:pl-12">
              {t(description)}
            </p>
            <Link
              href={`/${lang}`}
              className="inline-flex items-center gap-[10px] transition duration-200 ease-in hover:box-shadow hover:opacity-80 bg-brand px-8 lg:py-5 py-3.5 text-white font-semibold rounded-full"
            >
              Order More <ArrowRight />
            </Link>
          </div>
        </div>
        <figure className="flex -mt-14 md:mt-0 lg:absolute ltr:lg:right-0 rtl:lg:left-0 rtl:2xl:left-20 ltr:2xl:right-20 lg:bottom-0 lg:max-w-lg 3xl:max-w-none">
          <Image
            src={appImage}
            alt={t('text-app-thumbnail')}
            width={620}
            height={565}
            quality={100}
          />
        </figure>
      </div>
    </section>
  );
};

export default CallToActionMoscow;
