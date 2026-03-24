'use client';

import AddressGrid from '@components/address/address-grid';
import { useAddressQuery } from '@framework/address/address';

export default function AddressPageContent({ lang }: { lang: string }) {
  let { data, isLoading } = useAddressQuery();
  return (
    <>
      {!isLoading ? (
        <AddressGrid address={data?.data} lang={lang} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
