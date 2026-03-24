import { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import Heading from '@components/ui/heading';
import ProductReviewRating from './product-review-rating';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductDetailsTab({
  lang,
  description,
  productSlug,
}: {
  lang: string;
  description?: string;
  productSlug: string;
}) {
  let [tabHeading] = useState({
    Product_Details: '',
    Review_Rating: '',
  });

  const isHtmlDescription =
    typeof description === 'string' &&
    /<\/?[a-z][\s\S]*>/i.test(description);

  const paragraphs =
    typeof description === 'string' && !isHtmlDescription
      ? description
          .split(/\n{2,}|\n/)
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

  return (
    <div className="w-full xl:px-2 py-11 lg:py-14 xl:py-16 sm:px-0">
      <TabGroup>
        <TabList className="block border-b border-border-base">
          {Object.keys(tabHeading).map((item) => (
            <Tab
              key={item}
              className={({ selected }) =>
                classNames(
                  'relative inline-block transition-all text-15px lg:text-17px leading-5 text-brand-dark focus:outline-none pb-3 lg:pb-5 hover:text-brand ltr:mr-8 rtl:ml-8',
                  selected
                    ? 'font-semibold after:absolute after:w-full after:h-0.5 after:bottom-0 after:translate-y-[1px] after:ltr:left-0 after:rtl:right-0 after:bg-brand'
                    : '',
                )
              }
            >
              {item.split('_').join(' ')}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-6 lg:mt-9">
          <TabPanel className="lg:flex">
            <div className="w-full text-sm sm:text-15px text-brand-muted leading-[2em] space-y-4 lg:space-y-5 xl:space-y-7">
              {isHtmlDescription ? (
                // When product.description contains HTML markup, render it as HTML
                // instead of printing tags as text.
                <div
                  className="product-description [&_p]:m-0 [&_p]:leading-[2em] [&_ul]:m-0 [&_ol]:m-0 [&_li]:m-0"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: description as string }}
                />
              ) : paragraphs.length ? (
                paragraphs.map((p, idx) => (
                  <p key={`product-description-${idx}`}>{p}</p>
                ))
              ) : (
                <p className="text-brand-muted">
                  No product description available.
                </p>
              )}
            </div>
          </TabPanel>
          <TabPanel>
            <ProductReviewRating lang={lang} productSlug={productSlug} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
