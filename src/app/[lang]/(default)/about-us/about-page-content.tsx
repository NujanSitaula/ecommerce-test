'use client';

import { useTranslation } from 'src/app/i18n/client';
import Image from '@components/ui/image';
import Container from '@components/ui/container';
import { aboutSetting } from '@settings/about-setting';
import aboutUs1 from '@public/assets/images/about-us/1.png';
import aboutUs2 from '@public/assets/images/about-us/2.png';
import aboutUs3 from '@public/assets/images/about-us/3.png';
import aboutUs4 from '@public/assets/images/about-us/4.png';
import aboutUs5 from '@public/assets/images/about-us/5.png';
import aboutUs6 from '@public/assets/images/about-us/6.png';

const backgroundThumbnail = '/assets/images/about-us.png';

export default function AboutPageContent({ lang }: { lang: string }) {
  const { t } = useTranslation(lang, 'about');
  return (
    <>
      <div
        className="flex justify-center h-[250px] lg:h-96 2xl:h-[500px] w-full bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(${backgroundThumbnail})`,
        }}
      />
      <div className="py-8 lg:py-16 2xl:py-20">
        <Container>
          <div className="flex flex-col w-full mx-auto max-w-[1200px]">
            <h2 className="text-lg md:text-xl lg:text-[24px] text-brand-dark font-semibold mb-4 lg:mb-7">
              {
                // @ts-ignore
                t(aboutSetting?.titleOne)
              }
            </h2>
            <div
              className="text-sm leading-7 text-brand-dark opacity-70 lg:text-15px lg:leading-loose"
              dangerouslySetInnerHTML={{
                // @ts-ignore
                __html: t(aboutSetting.descriptionOne),
              }}
            />

            <div className="grid grid-cols-2 gap-4 my-8 lg:my-14">
              <Image
                src={aboutUs1}
                alt={t('text-map')}
                className="ltr:mr-5 rtl:ml-5"
              />
              <Image src={aboutUs2} alt={t('text-map')} className="" />
            </div>
            <div
              className="text-sm leading-7 text-brand-dark opacity-70 lg:text-15px lg:leading-loose"
              dangerouslySetInnerHTML={{
                // @ts-ignore
                __html: t(aboutSetting.descriptionTwo),
              }}
            />
            <div className="flex flex-col grid-cols-3 gap-4 my-8 lg:my-14 sm:grid">
              <Image
                src={aboutUs3}
                alt={t('text-map')}
                className="ltr:mr-4 rtl:ml-4"
              />
              <Image
                src={aboutUs4}
                alt={
                  // @ts-ignore
                  t('text-map')
                }
                className="ltr:mr-4 rtl:ml-4"
              />
              <Image src={aboutUs5} alt={t('text-map')} className="" />
            </div>
            <div
              className="text-sm leading-7 text-brand-dark opacity-70 lg:text-15px lg:leading-loose"
              dangerouslySetInnerHTML={{
                // @ts-ignore
                __html: t(aboutSetting.descriptionThree),
              }}
            />
            <div className="flex mt-8 mb-6 lg:mt-14 lg:mb-10">
              <Image
                src={aboutUs6}
                alt={t('text-map')}
                className="ltr:mr-4 rtl:ml-4"
              />
            </div>
            <h2 className="text-lg md:text-xl lg:text-[24px] text-brand-dark font-semibold mb-4 lg:mb-7">
              {
                // @ts-ignore
                t(aboutSetting.titleTwo)
              }
            </h2>
            <div
              className="text-sm leading-7 text-brand-dark opacity-70 lg:text-15px lg:leading-loose"
              dangerouslySetInnerHTML={{
                // @ts-ignore
                __html: t(aboutSetting.descriptionFour),
              }}
            />
            <p className="text-brand-dark font-medium text-base lg:text-lg leading-7 2xl:text-[20px] lg:leading-loose lg:mt-4 mb-3.5">
              {t(aboutSetting.titleThree)} &nbsp;
              <a href="mailto:press@borobazar.com">press@borobazar.com</a>.
            </p>
            <div
              className="text-sm leading-7 text-brand-dark opacity-70 lg:text-15px lg:leading-loose"
              dangerouslySetInnerHTML={{
                // @ts-ignore
                __html: t(aboutSetting.descriptionFive),
              }}
            />
          </div>
        </Container>
      </div>
    </>
  );
}
