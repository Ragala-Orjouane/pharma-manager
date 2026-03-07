import { useQuery } from "@tanstack/react-query";
import { fetchVentes } from "../api/ventesApi";

export const useVentes = () => {
  return useQuery({
    queryKey: ["ventes"],
    queryFn: fetchVentes,
  });
};