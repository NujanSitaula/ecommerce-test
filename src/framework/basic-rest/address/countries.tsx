import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchCountries = async () => {
  const { data } = await http.get(API_ENDPOINTS.COUNTRIES);
  return data;
};

export const useCountriesQuery = () => {
  return useQuery({
    queryKey: [API_ENDPOINTS.COUNTRIES],
    queryFn: fetchCountries,
  });
};


