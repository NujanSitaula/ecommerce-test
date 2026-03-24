import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const fetchProfile = async () => {
  const { data } = await http.get(API_ENDPOINTS.PROFILE);
  return data?.data ?? data;
};

const useProfileQuery = () => {
  return useQuery({
    queryKey: [API_ENDPOINTS.PROFILE],
    queryFn: fetchProfile,
  });
};

const useUpdatePhoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { phone: string }) => {
      const { data } = await http.put(API_ENDPOINTS.PROFILE_PHONE, payload);
      return data?.data ?? data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PROFILE] });
    },
  });
};

const fetchContactNumbers = async () => {
  const { data } = await http.get(API_ENDPOINTS.CONTACT_NUMBERS);
  return data?.data ?? data;
};

const useContactNumbersQuery = () => {
  return useQuery({
    queryKey: [API_ENDPOINTS.CONTACT_NUMBERS],
    queryFn: fetchContactNumbers,
  });
};

const createContactNumber = async (payload: any) => {
  const { data } = await http.post(API_ENDPOINTS.CONTACT_NUMBERS, payload);
  return data?.data ?? data;
};

const updateContactNumber = async (payload: any) => {
  const { id, ...rest } = payload;
  const { data } = await http.put(
    `${API_ENDPOINTS.CONTACT_NUMBERS}/${id}`,
    rest,
  );
  return data?.data ?? data;
};

const deleteContactNumber = async (id: number) => {
  const { data } = await http.delete(
    `${API_ENDPOINTS.CONTACT_NUMBERS}/${id}`,
  );
  return data?.data ?? data;
};

const useCreateOrUpdateContactNumberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      payload.id ? updateContactNumber(payload) : createContactNumber(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CONTACT_NUMBERS],
      });
    },
  });
};

const useDeleteContactNumberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteContactNumber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CONTACT_NUMBERS],
      });
    },
  });
};

export {
  useProfileQuery,
  useUpdatePhoneMutation,
  fetchProfile,
  useContactNumbersQuery,
  useCreateOrUpdateContactNumberMutation,
  useDeleteContactNumberMutation,
};
