// hooks/useCategories.js
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categoriesApi";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes avant de considérer les données comme obsolètes
    gcTime: 10 * 60 * 1000, // 10 minutes de cache (remplace cacheTime)
  });
};