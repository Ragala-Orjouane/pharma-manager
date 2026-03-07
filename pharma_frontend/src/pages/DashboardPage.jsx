import React from "react";
import { useMedicaments } from "../hooks/useMedicaments";
import { useVentes } from "../hooks/useVentes";

const DashboardPage = () => {
  const {
    data: medicaments = [],
    isLoading: medicamentsLoading,
    isError: medicamentsError,
  } = useMedicaments();

  const {
    data: ventes = [],
    isLoading: ventesLoading,
    isError: ventesError,
  } = useVentes();

  const isLoading = medicamentsLoading || ventesLoading;
  const isError = medicamentsError || ventesError;

  if (isLoading) {
    return <p>Chargement du dashboard...</p>;
  }

  if (isError) {
    return <p>Erreur lors du chargement des données</p>;
  }

  // Total médicaments
  const totalMedicaments = medicaments.length;

  // Médicaments en alerte (stock bas)
  const alertesStock = medicaments.filter((med) => med.est_en_alerte).length;

  // Ventes du jour
  const today = new Date().toISOString().split("T")[0];

  const ventesDuJour = ventes.filter(
    (vente) => vente.date_vente?.split("T")[0] === today
  ).length;

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <p>
          <strong>Nombre de médicaments :</strong> {totalMedicaments}
        </p>

        <p>
          <strong>Alertes de stock :</strong> {alertesStock}
        </p>

        <p>
          <strong>Ventes du jour :</strong> {ventesDuJour}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;