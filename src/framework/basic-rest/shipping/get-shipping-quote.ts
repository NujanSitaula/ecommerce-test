import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export interface ShippingQuoteResponse {
  shipping_fee: number;
  tax_rate?: number;
  tax_type?: string;
  shipping_taxable?: boolean;
}

export const fetchShippingQuote = async (
  addressId: number,
): Promise<ShippingQuoteResponse> => {
  const { data } = await http.get(API_ENDPOINTS.SHIPPING_QUOTE, {
    params: { address_id: addressId },
  });
  return data;
};

export const useShippingQuoteQuery = (addressId: number | null) => {
  return useQuery<ShippingQuoteResponse>({
    queryKey: [API_ENDPOINTS.SHIPPING_QUOTE, addressId],
    queryFn: () => fetchShippingQuote(addressId as number),
    enabled: !!addressId,
  });
};

// Guest shipping quote: by country_id and optional state_id
export const fetchGuestShippingQuote = async (
  countryId: number,
  stateId?: number | null,
): Promise<ShippingQuoteResponse> => {
  const params: Record<string, number> = { country_id: countryId };
  if (stateId) params.state_id = stateId;
  const { data } = await http.get(API_ENDPOINTS.SHIPPING_QUOTE, {
    params,
  });
  return data;
};

export const useGuestShippingQuoteQuery = (
  countryId: number | null,
  stateId?: number | null,
) => {
  return useQuery<ShippingQuoteResponse>({
    queryKey: [API_ENDPOINTS.SHIPPING_QUOTE, 'guest', countryId, stateId],
    queryFn: () =>
      fetchGuestShippingQuote(countryId as number, stateId ?? undefined),
    enabled: !!countryId,
  });
};


