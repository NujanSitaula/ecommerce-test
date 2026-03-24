import { useTranslation } from 'src/app/i18n/client';

interface Props {
  soldProduct?: number;
  totalProduct?: number;
  className?: string;
  lang: string;
}

const ProgressCard: React.FC<Props> = ({
  soldProduct = 0,
  totalProduct = 0,
  className = '',
  lang,
}) => {
  const progressBar = (100 / totalProduct) * soldProduct;
  const { t } = useTranslation(lang, 'common');
  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full h-2.5 lg:h-3 bg-fill-three rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-yellow-200 rounded-full bg-opacity-90 bg-progress-striped"
          style={{ width: `${Math.round(progressBar)}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-2.5 md:mt-3 xl:mt-2.5 2xl:mt-3.5">
        <div className="leading-6 text-brand-dark text-opacity-60 text-13px sm:text-sm lg:text-15px md:leading-7">
          {t('text-sold')} :&nbsp;
          <span className="font-medium text-brand-dark">
            {soldProduct} {t('text-items')}
          </span>
        </div>
        <div className="leading-6 text-brand-dark text-opacity-60 text-13px sm:text-sm lg:text-15px md:leading-7">
          {t('text-available')} :&nbsp;
          <span className="font-medium text-brand-dark">
            {totalProduct - soldProduct} {t('text-items')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
