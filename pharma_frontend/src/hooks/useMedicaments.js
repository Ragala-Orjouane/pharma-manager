import { useQuery } from "@tanstack/react-query";
import { fetchMedicaments } from "../api/medicamentsApi";

export const useMedicaments = () => {
  return useQuery({
    queryKey: ["medicaments"],
    queryFn: fetchMedicaments,
  });
};