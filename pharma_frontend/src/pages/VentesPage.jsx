import React, { useState } from "react";
import { useQuery } from "react-query";
import { fetchVentes } from "../api/ventesApi";

const VentesPage = () => {
  const { data, isLoading, isError } = useQuery("ventes", fetchVentes);

  if (isLoading) return <p>Chargement ventes...</p>;
  if (isError) return <p>Erreur lors du chargement des ventes</p>;

  return (
    <div>
      <h1>Historique des Ventes</h1>
      <table>
        <thead>
          <tr>
            <th>Référence</th>
            <th>Date</th>
            <th>Total TTC</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {data.results.map((vente) => (
            <tr key={vente.id}>
              <td>{vente.reference}</td>
              <td>{vente.date_vente}</td>
              <td>{vente.total_ttc}</td>
              <td>{vente.statut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VentesPage;