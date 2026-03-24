'use client';

import SearchIcon from '@components/icons/search-icon';
import React, { useState, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'src/app/i18n/client';

interface HeroSearchBoxProps {
  lang: string;
  style?: 'default' | 'slider' | 'medium' | 'antique';
  button?: {
    text?: string;
  };
}

const HeroSearchBox: FC<HeroSearchBoxProps> = ({ lang, style, button }) => {
  const { t } = useTranslation(lang, 'forms');
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  function onSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    router.push(`/${lang}/search?q=${searchTerm}`);
  }
  return (
    <form
      className={`relative flex w-full ${
        style !== 'antique' ? 'mt-6 rounded-md' : 'rounded-lg mt-11'
      }`}
      noValidate
      role="search"
      onSubmit={onSubmit}
    >
      <label htmlFor="hero-search" className="flex flex-1 items-center py-0.5">
        <input
          id="hero-search"
          className={`w-full text-sm transition-all duration-200 outline-none text-brand-dark/80 h-14 ${
            style !== 'antique'
              ? 'ltr:pl-5 rtl:pr-5 md:ltr:pl-6 md:rtl:pr-6 ltr:pr-14 rtl:pl-14 md:ltr:pr-16 md:rtl:pl-16 md:h-16 shadow-heroSearch placeholder:text-brand-dark/50 rounded-md'
              : 'ltr:pl-16 rtl:pr-16 h-[70px] shadow-searchBox placeholder:text-brand-dark/30 rounded-lg'
          } lg:text-base focus:ring-2 focus:ring-brand`}
          placeholder={t('placeholder-search') as string}
          aria-label="Search"
          autoComplete="off"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>

      <button
        type="submit"
        title="Search"
        className={`absolute top-0 flex items-center justify-center h-full transition duration-200 ease-in-out outline-none ${
          style !== 'antique'
            ? 'ltr:right-0 rtl:left-0'
            : 'ltr:left-0 rtl:right-0 text-brand'
        } w-14 md:w-16 hover:text-heading focus:outline-none`}
      >
        <SearchIcon
          className={`${
            style !== 'antique'
              ? 'w-5 h-5 text-brand-dark text-opacity-40'
              : 'w-6 h-6'
          }`}
        />
      </button>
      {style === 'antique' && button?.text ? (
        <div className="absolute top-0 h-full py-3 ltr:right-3 rtl:left-3">
          <button
            type="submit"
            title="Search"
            className={`flex items-center justify-center h-full transition duration-200 ease-in-out outline-none hover:text-heading focus:outline-none whitespace-nowrap bg-brand hover:opacity-80 text-white rounded-lg px-5`}
          >
            {button?.text}
          </button>
        </div>
      ) : (
        ''
      )}
    </form>
  );
};

export default HeroSearchBox;
