import React, { useState } from "react";
import { useVentes } from "../hooks/useVentes";
import { fetchMedicaments } from "../api/medicamentsApi";
import { createVente, annulerVente  } from "../api/ventesApi";
import { useQuery,useQueryClient  } from "@tanstack/react-query";

const VentesPage = () => {
const queryClient = useQueryClient();
  const { data: ventesData, isLoading, isError } = useVentes();

  const { data: medicamentsData } = useQuery({
    queryKey: ["medicamentsList"],
    queryFn: fetchMedicaments,
    initialData: { results: [] },
  });

  const [lignes, setLignes] = useState([]);
  const [message, setMessage] = useState("");

  const addLigne = () => {
    setLignes([...lignes, { medicament: "", quantite: 1 }]);
  };

  const removeLigne = (index) => {
    const newLignes = lignes.filter((_, i) => i !== index);
    setLignes(newLignes);
  };

  const handleChange = (index, field, value) => {
    const newLignes = [...lignes];

    if (field === "quantite") {
      value = parseInt(value);
    }

    newLignes[index][field] = value;
    setLignes(newLignes);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (lignes.length === 0) {
    setMessage("⚠️ Ajoutez au moins un médicament pour créer une vente.");
    return;
  }

  // Vérification des lignes
  for (let i = 0; i < lignes.length; i++) {
    const ligne = lignes[i];

    if (!ligne.medicament) {
      setMessage(`⚠️ Sélectionnez un médicament pour la ligne ${i + 1}.`);
      return;
    }

    const med = medicamentsData.find((m) => m.id === ligne.medicament);

    if (!med) {
      setMessage(`⚠️ Médicament sélectionné pour la ligne ${i + 1} invalide.`);
      return;
    }

    if (ligne.quantite > med.stock_actuel) {
      setMessage(
        `⚠️ Stock insuffisant pour "${med.nom}" (Stock actuel : ${med.stock_actuel}).`
      );
      return;
    }
  }

  // Si tout est correct, envoie vers l’API
  try {
    await createVente({ lignes });
    setMessage("✅ Vente créée avec succès !");
    setLignes([]);
  } catch (err) {
    // Si l’API renvoie une erreur (ex : ValidationError backend)
    const apiMsg =
      err.response?.data?.detail ||
      Object.values(err.response?.data || {}).flat().join(" ") ||
      "❌ Erreur lors de la création de la vente";
    setMessage(apiMsg);
  }
};
const handleAnnulerVente = async (venteId) => {
  if (!window.confirm("Voulez-vous vraiment annuler cette vente ?")) return;

  try {
    await annulerVente(venteId);

    setMessage("✅ Vente annulée avec succès !");
    queryClient.invalidateQueries(["ventes"]);

  } catch (err) {
    const apiMsg =
      err.response?.data?.detail ||
      "❌ Erreur lors de l'annulation";

    setMessage(apiMsg);
  }
};
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
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
        {ventesData?.map((vente) => (
            <tr key={vente.id}>
            <td>{vente.reference}</td>
            <td>{vente.date_vente}</td>
            <td>{vente.total_ttc}</td>
            <td>{vente.statut}</td>
            <td>
                {vente.statut !== "ANNULEE" && (
                <button
                    type="button"
                    onClick={() => handleAnnulerVente(vente.id)}
                    style={{ color: "red" }}
                >
                    Annuler
                </button>
                )}
            </td>
            </tr>
        ))}
        </tbody>
      </table>

      <h2>Créer une Vente</h2>

      {message && <p style={{ color: "red" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        {lignes.map((ligne, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <select
              value={ligne.medicament}
              onChange={(e) =>
                handleChange(index, "medicament", parseInt(e.target.value))
              }
            >
              <option value="">Sélectionner médicament</option>

              {medicamentsData?.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.nom} (Stock: {med.stock_actuel})
                </option>
              ))}
            </select>

            <input
              type="number"
              value={ligne.quantite}
              min="1"
              max={medicamentsData.find((m) => m.id === ligne.medicament)?.stock_actuel || 1}
              onChange={(e) =>
                handleChange(index, "quantite", e.target.value)
              }
            />

            <button
              type="button"
              onClick={() => removeLigne(index)}
            >
              Supprimer
            </button>
          </div>
        ))}

        <button type="button" onClick={addLigne}>
          Ajouter ligne
        </button>

        <br /><br />

        <button type="submit">
          Créer Vente
        </button>
      </form>
    </div>
  );
};

export default VentesPage;