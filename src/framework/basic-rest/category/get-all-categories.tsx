import { CategoriesQueryOptionsType, Category } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

async function fetchFromDynamic() {
  try {
    const { data } = await http.get(API_ENDPOINTS.CATEGORIES_DYNAMIC);
    // dynamic payload assumed as { data: Category[] }
    if (data?.data) {
      return data.data as Category[];
    }
    // If backend returns array directly
    if (Array.isArray(data)) return data as Category[];
  } catch {
    return null;
  }
  return null;
}

async function fetchFromStatic() {
  const { data } = await http.get(API_ENDPOINTS.CATEGORIES);
  if (data?.data) return data.data as Category[];
  return Array.isArray(data) ? (data as Category[]) : [];
}

export const fetchCategories = async ({ queryKey }: any) => {
  const dynamic = await fetchFromDynamic();
  const list = dynamic ?? (await fetchFromStatic());
  return {
    categories: {
      data: list,
    },
  };
};

export const useCategoriesQuery = (options: CategoriesQueryOptionsType) => {
  return useQuery<{ categories: { data: Category[] } }, Error>({
    queryKey: [API_ENDPOINTS.CATEGORIES, options],
    queryFn: fetchCategories,
  });
};
