// hooks/useMedicaments.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMedicaments, createMedicament, updateMedicament, deleteMedicament } from "../api/medicamentsApi";

export const useMedicaments = () => {
  const queryClient = useQueryClient();

  // Query pour récupérer les médicaments
  const query = useQuery({
    queryKey: ["medicaments"],
    queryFn: fetchMedicaments,
  });

  // Mutation pour créer un médicament
  const createMutation = useMutation({
    mutationFn: createMedicament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicaments"] });
    },
  });

  // Mutation pour mettre à jour un médicament
  const updateMutation = useMutation({
    mutationFn: (params) => updateMedicament(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicaments"] });
    },
  });

  // Mutation pour supprimer un médicament
  const deleteMutation = useMutation({
    mutationFn: deleteMedicament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicaments"] });
    },
  });

  return {
    // Données et état de la query
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    // Mutations
    createMedicament: createMutation.mutateAsync,
    updateMedicament: (id, data) => updateMutation.mutateAsync({ id, data }),
    deleteMedicament: deleteMutation.mutateAsync,
    
    // États des mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};