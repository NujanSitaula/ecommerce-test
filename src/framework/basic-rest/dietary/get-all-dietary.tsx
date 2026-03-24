import { QueryOptionsType, Dietary } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchDietary = async () => {
  const { data } = await http.get(API_ENDPOINTS.DIETARY);
  return { dietary: { data: data.data as Dietary[] } };
};
export const useDietaryQuery = (options: QueryOptionsType) => {
  return useQuery<{ dietary: { data: Dietary[] } }, Error>({
    queryKey: [API_ENDPOINTS.DIETARY, options],
    queryFn: fetchDietary,
  });
};
