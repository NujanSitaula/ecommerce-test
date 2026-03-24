'use client';

import { Fragment, useState, useEffect } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import { useLogoutMutation } from '@framework/auth/use-logout';
import LogoutIcon from '@components/icons/account-logout';
import { useTranslation } from 'src/app/i18n/client';
type Option = {
  name: string;
  slug: string;
  icon?: React.ReactNode;
};

export default function AccountNavMobile({
  options,
  lang,
}: {
  options: Option[];
  lang: string;
}) {
  const { t } = useTranslation(lang, 'common');
  const router = useRouter();
  const pathname = usePathname();
  const pathnameSplit = pathname.split('/');
  const newPathname: string = `/${pathnameSplit
    .slice(2, pathnameSplit.length)
    .join('/')}`;

  const currentSelectedItem = newPathname
    ? options.find((o) => o.slug === newPathname)!
    : options[0];

  const [selectedItem, setSelectedItem] = useState<Option>(currentSelectedItem);
  useEffect(() => {
    setSelectedItem(currentSelectedItem);
  }, [currentSelectedItem]);

  function handleItemClick(slugs: any) {
    setSelectedItem(slugs);
    router.push(`/${lang}${slugs.slug}`);
  }
  const { mutate: logout } = useLogoutMutation(lang);

  return (
    <Listbox value={selectedItem} onChange={handleItemClick}>
      {({ open }) => (
        <div className="relative w-full font-body">
          <ListboxButton className="relative flex items-center w-full p-4 border rounded cursor-pointer text-brand-dark md:p-5 ltr:text-left rtl:text-right focus:outline-none border-border-base">
            {selectedItem?.icon}
            <span className="flex truncate items-center text-sm md:text-15px font-medium ltr:pl-2.5 rtl:pr-2.5 relative">
              {t(selectedItem?.name)}
            </span>
            <span className="absolute inset-y-0 flex items-center pointer-events-none ltr:right-4 rtl:left-4 md:ltr:right-5 md:rtl:left-5">
              <FaChevronDown
                className="w-3 md:w-3.5 h-3 md:h-3.5 text-brand-dark text-opacity-70"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              static
              className="absolute z-20 w-full py-2.5 mt-1.5 overflow-auto bg-brand-light rounded-md shadow-dropDown max-h-72 focus:outline-none text-sm md:text-15px"
            >
              {options?.map((option, index) => (
                <ListboxOption
                  key={index}
                  className={({ active }) =>
                    `cursor-pointer relative py-3 px-4 md:px-5 ${
                      active
                        ? 'text-brand-dark bg-fill-dropdown-hover'
                        : 'bg-brand-light'
                    }`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <span className="flex items-center">
                      {option?.icon}
                      <span
                        className={`block truncate ltr:pl-2.5 rtl:pr-2.5 md:ltr:pl-3 md:rtl:pr-3 ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {t(option?.name)}
                      </span>
                      {selected ? (
                        <span
                          className={`${active && 'text-amber-600'}
                                 absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center ltr:pl-3 rtl:pr-3`}
                        />
                      ) : null}
                    </span>
                  )}
                </ListboxOption>
              ))}
              <button
                className="flex items-center w-full px-4 py-3 text-sm cursor-pointer lg:text-15px text-brand-dark md:px-5 focus:outline-none"
                onClick={() => logout()}
              >
                <span className="flex justify-center shrink-0">
                  <LogoutIcon className="w-5 md:w-[22px] h-5 md:h-[22px]" />
                </span>
                <span className="block truncate ltr:pl-2.5 rtl:pr-2.5 md:ltr:pl-3 md:rtl:pr-3">
                  {t('text-logout')}
                </span>
              </button>
            </ListboxOptions>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
