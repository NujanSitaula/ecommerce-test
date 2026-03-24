import ArrowIcon from '@components/icons/arrow-icon';
import Link from '@components/ui/link';
import { LinkProps } from 'next/link';
import { useTranslation } from 'src/app/i18n/client';

interface Props {
  lang: string;
  className?: string;
  href?: LinkProps['href'];
}

const SeeAll: React.FC<Props> = ({ lang, className, href = '/' }) => {
  const { t } = useTranslation(lang, 'common');
  return (
    <Link
      href={`/${lang}/${href}`}
      className={`${className} p-4 flex items-center justify-center flex-col hover:opacity-80`}
    >
      <ArrowIcon color="#02B290" className="w-10" />
      <span className="font-semibold text-sm sm:text-base text-brand block pt-1.5 sm:pt-3.5">
        {t('text-see-all')}
      </span>
    </Link>
  );
};

export default SeeAll;
