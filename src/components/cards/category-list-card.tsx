import Link, { LinkProps } from 'next/link';
import Image from '@components/ui/image';
import { IoIosArrowForward } from 'react-icons/io';
import { Category } from '@framework/types';
import cn from 'classnames';
import { useTranslation } from 'src/app/i18n/client';

interface Props {
  lang: string;
  category: Category;
  href: LinkProps['href'];
  className?: string;
  variant?: 'default' | 'small' | 'antique';
}

const CategoryListCard: React.FC<Props> = ({
  category,
  className,
  href,
  variant = 'default',
  lang,
}) => {
  const { name, icon } = category;
  const { t } = useTranslation(lang, 'common');
  return (
    <Link
      href={`/${lang}${href}`}
      className={cn(
        'group flex transition',
        {
          'py-3 xl:py-3.5 2xl:py-2.5 3xl:py-3': variant === 'default',
          'py-2 3xl:py-3': variant === 'small',
        },
        {
          'justify-between items-center px-3.5 2xl:px-4': variant !== 'antique',
        },
        className,
      )}
    >
      <div
        className={`${
          variant === 'antique' ? 'w-full text-center' : 'flex items-center'
        }`}
      >
        <div
          className={cn(
            {
              '2xl:w-12 3xl:w-auto 2xl:h-12 3xl:h-auto': variant === 'default',
            },
            {
              'py-9 border-b border-brand-dark/5 flex justify-center':
                variant === 'antique',
            },
            {
              'w-9 h-9 inline-flex shrink-0': variant !== 'antique',
            },
          )}
        >
          <Image
            src={icon ?? '/assets/placeholder/category-small.svg'}
            alt={name || t('text-category-thumbnail')}
            width={variant === 'antique' ? 80 : 40}
            height={variant === 'antique' ? 80 : 40}
            className="aspect-square"
          />
        </div>
        <h3
          className={`text-15px text-brand-dark capitalize ${
            variant === 'antique'
              ? 'font-medium py-5'
              : 'ltr:pl-2.5 rtl:pr-2.5  md:ltr:pl-4 md:rtl:pr-4 2xl:ltr:pl-3 2xl:rtl:pr-3 3xl:ltr:pl-4 3xl:rtl:pr-5'
          }`}
        >
          {name}
        </h3>
      </div>
      {variant !== 'antique' ? (
        <div className="flex items-center transition-all transform group-hover:translate-x-1">
          <IoIosArrowForward className="text-base text-brand-dark text-opacity-40" />
        </div>
      ) : (
        ''
      )}
    </Link>
  );
};

export default CategoryListCard;
