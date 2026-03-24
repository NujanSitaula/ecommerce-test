'use client';

import ActiveLink from '@components/ui/active-link';
import useBreadcrumb, {
  convertBreadcrumbTitle,
} from '@utils/use-breadcrumb';
import { ROUTES } from '@utils/routes';
import { useTranslation } from 'src/app/i18n/client';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export default function BaselBreadcrumb({ lang }: { lang: string }) {
  const breadcrumbs = useBreadcrumb();
  const { t } = useTranslation(lang, 'common');

  return (
    <div className="basel-productBreadcrumbs py-3">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-8 col-sm-12">
            <nav aria-label="breadcrumb">
              <ol className="basel-breadcrumb mb-0">
                <li>
                  <ActiveLink
                    href={`${ROUTES.HOME}${lang}`}
                    activeClassName="active"
                    lang={lang}
                  >
                    <span>{t('breadcrumb-home')}</span>
                  </ActiveLink>
                </li>
                {breadcrumbs?.map((breadcrumb: any, index: number) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <li key={breadcrumb.href}>
                      {!isLast ? (
                        <ActiveLink
                          href={breadcrumb.href}
                          activeClassName="active"
                          lang={lang}
                        >
                          <span>
                            {convertBreadcrumbTitle(breadcrumb.breadcrumb)}
                          </span>
                        </ActiveLink>
                      ) : (
                        <span className="current">
                          {convertBreadcrumbTitle(breadcrumb.breadcrumb)}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
          <div className="col-md-4 d-none d-md-block">
            <div className="basel-breadcrumbArrows float-end">
              <button type="button" aria-label="Previous product">
                <IoIosArrowBack />
              </button>
              <button type="button" aria-label="Next product">
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

