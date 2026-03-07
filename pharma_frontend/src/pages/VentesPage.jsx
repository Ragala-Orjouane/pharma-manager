// pages/VentesPage.jsx
import React, { useState, useCallback, useMemo } from "react";
import { useVentes } from "../hooks/useVentes";
import { useMedicaments } from "../hooks/useMedicaments";

const VentesPage = () => {
  // Hooks personnalisés
  const { 
    data: ventesData, 
    isLoading, 
    isError,
    createVente,
    annulerVente,
    isCreating,
    isCanceling
  } = useVentes();

  const { 
    data: medicamentsData = [], 
    isLoading: isLoadingMeds 
  } = useMedicaments();

  // State local
  const [lignes, setLignes] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Créer un map des médicaments pour un accès plus rapide
  const medicamentsMap = useMemo(() => {
    const map = new Map();
    medicamentsData.forEach(med => {
      map.set(med.id, med);
    });
    return map;
  }, [medicamentsData]);

  // Gestionnaires d'événements
  const addLigne = useCallback(() => {
    setLignes(prev => [...prev, { medicament: "", quantite: 1 }]);
    setMessage({ type: "", text: "" });
  }, []);

  const removeLigne = useCallback((index) => {
    setLignes(prev => prev.filter((_, i) => i !== index));
    setMessage({ type: "", text: "" });
  }, []);

  const handleChange = useCallback((index, field, value) => {
    setLignes(prev => {
      const newLignes = [...prev];
      
      if (field === "quantite") {
        value = parseInt(value) || 1;
      }
      
      newLignes[index] = {
        ...newLignes[index],
        [field]: value
      };
      
      return newLignes;
    });
    setMessage({ type: "", text: "" });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validation
    if (lignes.length === 0) {
      setMessage({ 
        type: "error", 
        text: "⚠️ Ajoutez au moins un médicament pour créer une vente." 
      });
      return;
    }

    // Vérification des lignes
    for (let i = 0; i < lignes.length; i++) {
      const ligne = lignes[i];

      if (!ligne.medicament) {
        setMessage({ 
          type: "error", 
          text: `⚠️ Sélectionnez un médicament pour la ligne ${i + 1}.` 
        });
        return;
      }

      const med = medicamentsMap.get(ligne.medicament);

      if (!med) {
        setMessage({ 
          type: "error", 
          text: `⚠️ Médicament sélectionné pour la ligne ${i + 1} invalide.` 
        });
        return;
      }

      if (ligne.quantite > med.stock_actuel) {
        setMessage({ 
          type: "error", 
          text: `⚠️ Stock insuffisant pour "${med.nom}" (Stock actuel : ${med.stock_actuel}).` 
        });
        return;
      }
    }

    // Création de la vente
    try {
      await createVente({ lignes });
      setMessage({ 
        type: "success", 
        text: "✅ Vente créée avec succès !" 
      });
      setLignes([]); // Réinitialiser le formulaire
    } catch (err) {
      const apiMsg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {}).flat().join(" ") ||
        "❌ Erreur lors de la création de la vente";
      setMessage({ type: "error", text: apiMsg });
    }
  }, [lignes, medicamentsMap, createVente]);

  const handleAnnulerVente = useCallback(async (venteId) => {
    if (!window.confirm("Voulez-vous vraiment annuler cette vente ?")) return;

    try {
      await annulerVente(venteId);
      setMessage({ 
        type: "success", 
        text: "✅ Vente annulée avec succès !" 
      });
    } catch (err) {
      const apiMsg =
        err.response?.data?.detail ||
        "❌ Erreur lors de l'annulation";
      setMessage({ type: "error", text: apiMsg });
    }
  }, [annulerVente]);

  // États de chargement
  if (isLoading || isLoadingMeds) return <p>Chargement ventes...</p>;
  if (isError) return <p>Erreur lors du chargement des ventes</p>;

  return (
    <div>
      <h1>Historique des Ventes</h1>

      {/* Message de notification */}
      {message.text && (
        <p style={{ 
          color: message.type === "success" ? "green" : "red",
          fontWeight: "bold",
          padding: "0.5rem",
          backgroundColor: message.type === "success" ? "#e8f5e8" : "#fee",
          borderRadius: "4px"
        }}>
          {message.text}
        </p>
      )}

      {/* Tableau des ventes */}
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
          {ventesData?.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Aucune vente enregistrée
              </td>
            </tr>
          ) : (
            ventesData?.map((vente) => (
              <tr key={vente.id}>
                <td>{vente.reference}</td>
                <td>{new Date(vente.date_vente).toLocaleDateString('fr-FR')}</td>
                <td>{vente.total_ttc} €</td>
                <td>
                  <span style={{
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    backgroundColor: vente.statut === "ANNULEE" ? "#fee" : "#e8f5e8",
                    color: vente.statut === "ANNULEE" ? "red" : "green"
                  }}>
                    {vente.statut}
                  </span>
                </td>
                <td>
                  {vente.statut !== "ANNULEE" && (
                    <button
                      type="button"
                      onClick={() => handleAnnulerVente(vente.id)}
                      disabled={isCanceling}
                      style={{ 
                        color: "red",
                        opacity: isCanceling ? 0.5 : 1,
                        cursor: isCanceling ? "not-allowed" : "pointer"
                      }}
                    >
                      {isCanceling ? "Annulation..." : "Annuler"}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2>Créer une Vente</h2>

      <form onSubmit={handleSubmit}>
        {lignes.map((ligne, index) => {
          const selectedMed = medicamentsMap.get(ligne.medicament);
          const maxStock = selectedMed?.stock_actuel || 1;

          return (
            <div key={index} style={{ marginBottom: "10px" }}>
              <select
                value={ligne.medicament}
                onChange={(e) =>
                  handleChange(index, "medicament", parseInt(e.target.value))
                }
                disabled={isCreating}
                style={{ marginRight: "5px" }}
              >
                <option value="">Sélectionner médicament</option>
                {medicamentsData.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.nom} (Stock: {med.stock_actuel})
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={ligne.quantite}
                min="1"
                max={maxStock}
                onChange={(e) =>
                  handleChange(index, "quantite", e.target.value)
                }
                disabled={isCreating}
                style={{ marginRight: "5px", width: "80px" }}
              />

              <button
                type="button"
                onClick={() => removeLigne(index)}
                disabled={isCreating}
              >
                Supprimer
              </button>

              {selectedMed && ligne.quantite > selectedMed.stock_actuel && (
                <span style={{ color: "red", marginLeft: "10px" }}>
                  ⚠️ Stock max: {selectedMed.stock_actuel}
                </span>
              )}
            </div>
          );
        })}

        <button 
          type="button" 
          onClick={addLigne}
          disabled={isCreating}
        >
          Ajouter ligne
        </button>

        <br /><br />

        <button 
          type="submit"
          disabled={isCreating || lignes.length === 0}
          style={{
            opacity: (isCreating || lignes.length === 0) ? 0.5 : 1,
            cursor: (isCreating || lignes.length === 0) ? "not-allowed" : "pointer"
          }}
        >
          {isCreating ? "Création en cours..." : "Créer Vente"}
        </button>

        {lignes.length > 0 && (
          <button
            type="button"
            onClick={() => setLignes([])}
            style={{ marginLeft: "10px" }}
            disabled={isCreating}
          >
            Réinitialiser
          </button>
        )}
      </form>
    </div>
  );
};

export default VentesPage;