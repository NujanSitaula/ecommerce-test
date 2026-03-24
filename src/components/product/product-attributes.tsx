import cn from 'classnames';

interface Props {
  className?: string;
  variations: any;
  attributes: any;
  setAttributes: (key: any) => void;
}

const ProductAttributes: React.FC<Props> = ({
  className = 'mb-2 pt-0.5',
  variations,
  attributes,
  setAttributes,
}) => {
  if (!variations) return null;

  const normalize = (value: unknown) =>
    String(value ?? '').trim().toLowerCase();

  return (
    <>
      {Object.keys(variations).map((variationName, index) => (
        <div className={cn(className)} key={index}>
          <h4 className="mb-3 font-normal capitalize text-15px text-brand-dark text-opacity-70">
            {variationName.split('-').join(' ')}:
          </h4>

          <ul className="flex flex-wrap ltr:-mr-2 rtl:-ml-2 p-0 m-0 list-none">
            {variations[variationName].map((attribute: any) => (
              <li
                key={attribute.id}
                className={cn(
                  'cursor-pointer rounded border h-9 md:h-10 p-1 mb-2 md:mb-3 ltr:mr-2 rtl:ml-2 flex justify-center items-center font-medium text-sm md:text-15px text-brand-dark transition duration-200 ease-in-out hover:text-brand hover:border-brand px-3',
                  {
                    'border-brand text-brand text-opacity-100 ring-2 ring-brand/60 bg-brand/5 font-semibold':
                      normalize(attributes?.[variationName]) ===
                      normalize(attribute?.value),
                  },
                )}
                onClick={() =>
                  setAttributes((prev: any) => ({
                    ...prev,
                    [variationName]: attribute.value,
                  }))
                }
              >
                {attribute.value}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default ProductAttributes;
