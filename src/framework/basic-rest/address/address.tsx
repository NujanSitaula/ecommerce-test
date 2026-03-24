import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const fetchAddress = async () => {
  const { data } = await http.get(API_ENDPOINTS.ADDRESSES);
  // Laravel resource collection shape: { data: [...] }
  return data?.data ?? [];
};

const useAddressQuery = () => {
  return useQuery({
    queryKey: [API_ENDPOINTS.ADDRESSES],
    queryFn: () => fetchAddress(),
  });
};

const useCreateOrUpdateAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      if (payload?.id) {
        const { data } = await http.put(
          `${API_ENDPOINTS.ADDRESSES}/${payload.id}`,
          payload,
        );
        return data?.data ?? data;
      }
      const { data } = await http.post(API_ENDPOINTS.ADDRESSES, payload);
      return data?.data ?? data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ADDRESSES] });
    },
  });
};

const useDeleteAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      const { data } = await http.delete(`${API_ENDPOINTS.ADDRESSES}/${id}`);
      return data?.data ?? data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ADDRESSES] });
    },
  });
};

export {
  useAddressQuery,
  fetchAddress,
  useCreateOrUpdateAddressMutation,
  useDeleteAddressMutation,
};
