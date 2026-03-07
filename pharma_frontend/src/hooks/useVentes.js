// hooks/useVentes.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVentes, createVente, annulerVente } from "../api/ventesApi";

export const useVentes = () => {
  const queryClient = useQueryClient();

  // Query pour récupérer les ventes
  const query = useQuery({
    queryKey: ["ventes"],
    queryFn: fetchVentes,
  });

  // Mutation pour créer une vente
  const createMutation = useMutation({
    mutationFn: createVente,
    onSuccess: () => {
      // Invalider le cache pour re-fetch automatiquement
      queryClient.invalidateQueries({ queryKey: ["ventes"] });
      // Invalider aussi les médicaments car le stock change
      queryClient.invalidateQueries({ queryKey: ["medicaments"] });
      queryClient.invalidateQueries({ queryKey: ["medicamentsList"] });
    },
  });

  // Mutation pour annuler une vente
  const cancelMutation = useMutation({
    mutationFn: annulerVente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventes"] });
    },
  });

  return {
    // Données et état de la query
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    // Mutations
    createVente: createMutation.mutateAsync,
    annulerVente: cancelMutation.mutateAsync,
    
    // États des mutations
    isCreating: createMutation.isPending,
    isCanceling: cancelMutation.isPending,
    createError: createMutation.error,
    cancelError: cancelMutation.error,
  };
};