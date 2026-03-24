import Link from '@components/ui/link';
import Image from '@components/ui/image';
import { LinkProps } from 'next/link';
import { useTranslation } from 'src/app/i18n/client';
import { getDirection } from '@utils/get-direction';
import cn from 'classnames';
import { categoryPlaceholder } from '@assets/placeholders';

interface Props {
  lang: string;
  item: any;
  href: LinkProps['href'];
  className?: string;
}

const CategoryCard: React.FC<Props> = ({ lang, item, href, className }) => {
  const { t } = useTranslation(lang, 'common');
  const { name, image } = item ?? {};
  const dir = getDirection(lang);
  return (
    <Link
      href={`/${lang}${href}`}
      className={cn('group block w-full text-center', className)}
    >
      <div className="flex max-w-[178px] max-h-[178px] mb-3.5 xl:mb-4 mx-auto rounded-full overflow-hidden bg-fill-thumbnail">
        <div
          className={`flex shrink-0 transition-all duration-700 w-full h-full transform scale-50 group-hover:scale-100 ${
            dir === 'rtl'
              ? 'translate-x-full group-hover:translate-x-0'
              : '-translate-x-full group-hover:translate-x-0'
          }`}
        >
          <Image
            src={image?.original ?? categoryPlaceholder}
            alt={name || t('text-card-thumbnail')}
            width={178}
            height={178}
            quality={100}
            className="object-cover rounded-full aspect-square"
            priority={false}
          />
        </div>
        <div
          className={`flex shrink-0 transition-all duration-700 w-full h-full transform scale-100 group-hover:scale-50 ${
            dir === 'rtl'
              ? 'translate-x-full group-hover:translate-x-0'
              : '-translate-x-full group-hover:translate-x-0'
          }`}
        >
          <Image
            src={image?.original ?? categoryPlaceholder}
            alt={name || t('text-card-thumbnail')}
            width={178}
            height={178}
            quality={100}
            className="object-cover rounded-full aspect-square"
            priority={false}
          />
        </div>
      </div>
      <h3 className="text-sm capitalize truncate text-brand-dark sm:text-15px lg:text-base">
        {name}
      </h3>
    </Link>
  );
};

export default CategoryCard;
