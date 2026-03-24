import cn from 'classnames';
import MinusIcon from '@components/icons/minus-icon';
import PlusIcon from '@components/icons/plus-icon';
import { useTranslation } from 'src/app/i18n/client';

type ButtonEvent = (
  e: React.MouseEvent<HTMLButtonElement | MouseEvent>,
) => void;

type CounterProps = {
  lang: string;
  value: number;
  variant?: 'mercury' | 'cart' | 'single' | 'venus';
  onDecrement: ButtonEvent;
  onIncrement: ButtonEvent;
  className?: string;
  disabled?: boolean;
};

const Counter: React.FC<CounterProps> = ({
  lang,
  value,
  variant = 'mercury',
  onDecrement,
  onIncrement,
  className,
  disabled,
}) => {
  const size = variant === 'single' ? '22' : '14';
  const { t } = useTranslation(lang, 'common');
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded overflow-hidden shrink-0 p-1',
        {
          'h-9 md:h-10 bg-brand-light shadow-counter rounded-3xl':
            variant === 'mercury',
          'h-11 md:h-14 bg-[#f3f5f9]': variant === 'single',
          'inline-flex': variant === 'cart',
          'bg-brand rounded-[4px] z-1 mt-[10px]': variant === 'venus',
        },
        className,
      )}
    >
      <button
        onClick={onDecrement}
        className={cn(
          'flex items-center justify-center shrink-0 h-full transition-all ease-in-out duration-300 focus:outline-none focus-visible:outline-none',
          {
            'w-10 h-8 rounded-2xl text-heading hover:bg-fill-four':
              variant === 'mercury',
            '!w-10 !h-10 rounded-full transform scale-80 lg:scale-100 text-brand-dark hover:bg-fill-four ltr:ml-auto rtl:mr-auto':
              variant === 'single',
            '!w-6 !h-6 pr-0 border border-border-three hover:bg-brand text-brand-muted hover:border-brand rounded-full hover:text-brand-light':
              variant === 'cart',
            'w-10 h-10 cursor-pointer rounded-tl-[4px] rounded-bl-[4px] transition-all bg-black/10 text-white':
              variant === 'venus',
          },
        )}
      >
        <span className="sr-only">{t('button-minus')}</span>
        <MinusIcon width={size} height={size} opacity="1" />
      </button>
      <span
        className={cn(
          'font-semibold text-brand-dark flex items-center justify-center h-full transition-colors duration-250 ease-in-out cursor-default shrink-0',
          {
            'text-sm md:text-base w-6': variant === 'mercury',
            'text-base md:text-[17px] w-12 md:w-20 xl:w-28 ':
              variant === 'single',
            'text-15px w-9': variant === 'cart',
            'self-center text-sm sm:text-base text-white font-semibold':
              variant === 'venus',
          },
        )}
      >
        {value}
      </span>
      <button
        onClick={onIncrement}
        disabled={disabled}
        className={cn(
          'group flex items-center justify-center h-full shrink-0 transition-all ease-in-out duration-300 focus:outline-none focus-visible:outline-none pr-2',
          {
            'w-10 h-8 rounded-2xl text-heading hover:bg-fill-four !pr-0':
              variant === 'mercury',
            '!w-10 !h-10 rounded-full scale-80 lg:scale-100 text-heading hover:bg-fill-four ltr:mr-auto rtl:ml-auto !pr-0 justify-center':
              variant === 'single',
            '!w-6 !h-6 border text-brand-muted border-border-three hover:bg-brand hover:border-brand rounded-full hover:text-brand-light !pr-0':
              variant === 'cart',
            'w-10 h-10 cursor-pointer rounded-tl-[4px] rounded-bl-[4px] transition-all bg-black/10 text-white !pr-0':
              variant === 'venus',
          },
        )}
        title={disabled ? 'Out Of Stock' : ''}
      >
        <span className="sr-only">{t('button-plus')}</span>
        <PlusIcon width={size} height={size} opacity="1" />
      </button>
    </div>
  );
};

export default Counter;
