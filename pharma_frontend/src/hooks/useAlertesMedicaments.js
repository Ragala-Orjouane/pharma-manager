import { useQuery } from "@tanstack/react-query";
import { fetchAlertesMedicaments } from "../api/medicamentsApi";

export const useAlertesMedicaments = () => {
  return useQuery({
    queryKey: ["alertes"],
    queryFn: fetchAlertesMedicaments,
  });
};