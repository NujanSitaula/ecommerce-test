function removeEmpty(obj: any): any {
  return Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? removeEmpty(v) : v }),
      {},
    );
}

export function formatAddress(address: any) {
  if (!address) return '';
  const parts = [
    address.address_line1,
    address.address_line2,
    address.city,
    address.state?.name ?? address.state_name,
    address.country?.name ?? address.country_name,
    address.postal_code,
  ];
  return parts.filter(Boolean).join(', ');
}
