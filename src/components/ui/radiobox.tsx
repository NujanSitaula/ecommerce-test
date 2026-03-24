import React from 'react';
import { useTranslation } from 'src/app/i18n/client';

interface RadioBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactElement;
  lang: string;
}
export const RadioBox = React.forwardRef<HTMLInputElement, RadioBoxProps>(
  ({ lang, label, ...rest }, ref) => {
    const { t } = useTranslation(lang, 'forms');
    return (
      <label className="flex items-center text-sm cursor-pointer group text-heading">
        <input
          type="radio"
          className="w-5 h-5 transition duration-500 ease-in-out border border-gray-300 rounded-full cursor-pointer form-radio text-heading focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-heading"
          ref={ref}
          {...rest}
        />
        <span className="relative text-sm ltr:ml-2 rtl:mr-2 text-heading">
          {t(`${label}`)}
        </span>
      </label>
    );
  },
);

RadioBox.displayName = 'RadioBox';
