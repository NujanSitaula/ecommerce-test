import Heading from '@components/ui/heading';
import cn from 'classnames';
import { useTranslation } from 'src/app/i18n/client';
import Text from '@components/ui/text';

interface ItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Props {
  lang: string;
  className?: string;
  item: ItemProps;
}

const FeaturedCard: React.FC<Props> = ({ lang, item, className }) => {
  const { t } = useTranslation(lang, 'common');
  const { icon, title, description } = item;
  return (
    <div
      className={cn(
        'group p-5 md:px-6 xl:px-7 3xl:px-9 flex items-center justify-between bg-[#F4F2EB]',
        className,
      )}
    >
      <div className="ltr:pr-4 rtl:pl-4 md:ltr:pr-5 md:rtl:pl-5 lg:ltr:pr-4 lg:rtl:pl-4 3xl:ltr:pr-10 3xl:rtl:pl-10">
        <Heading variant="title" className="mb-1.5 -mt-0.5">
          {t(title)}
        </Heading>
        <Text>{t(description)}</Text>
      </div>
      <div className="flex shrink-0 items-center justify-center bg-brand-light rounded-full w-[80px] xl:w-24 3xl:w-[110px] h-[80px] xl:h-24 3xl:h-[110px]">
        {icon}
      </div>
    </div>
  );
};

export default FeaturedCard;
