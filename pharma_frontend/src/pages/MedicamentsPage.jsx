import React from "react";
import { useMedicaments } from "../hooks/useMedicaments";

const MedicamentsPage = () => {
  const { data, isLoading, isError } = useMedicaments();

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors du chargement</p>;

  return (
    <div>
      <h1>Liste des Médicaments</h1>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>DCI</th>
            <th>Categorie</th>
            <th>Stock actuel</th>
            <th>Stock minimum</th>
          </tr>
        </thead>
        <tbody>
          {data.results.map((med) => (
            <tr key={med.id}>
              <td>{med.nom}</td>
              <td>{med.dci}</td>
              <td>{med.categorie.nom}</td>
              <td>{med.stock_actuel}</td>
              <td>{med.stock_minimum}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicamentsPage;