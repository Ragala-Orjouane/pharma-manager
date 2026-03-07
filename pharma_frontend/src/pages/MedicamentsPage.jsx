import React, { useState } from "react";
import { useMedicaments } from "../hooks/useMedicaments";
import { useCategories } from "../hooks/useCategories";

const MedicamentsPage = () => {
  const { data, isLoading, isError, createMedicament, updateMedicament, deleteMedicament } = useMedicaments();  const { data: categories } = useCategories();
  const [editingMedId, setEditingMedId] = useState(null);
  const getCategorieNom = (id) => {
    const cat = categories?.find((c) => c.id === id);
    return cat ? cat.nom : "—";
  };
  const [filters, setFilters] = useState({
    nom: "",
    categorie: "",
    stockBas: false,
  });
  const filteredMeds = data
  ?.filter((med) =>
    med.nom.toLowerCase().includes(filters.nom.toLowerCase())
  )
    .filter((med) =>
    filters.categorie ? med.categorie === parseInt(filters.categorie) : true
    )
  .filter((med) =>
    filters.stockBas ? med.est_en_alerte === true : true
  );

  const [formData, setFormData] = useState({
    nom: "",
    dci: "",
    categorie: "",
    forme: "",
    dosage: "",
    prix_achat: "",
    prix_vente: "",
    stock_actuel: "",
    stock_minimum: "",
    ordonnance_requise: "",
    date_expiration: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "ordonnance_requise") {
        value = value === "true";
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = {
        ...formData,
        categorie: parseInt(formData.categorie),
        prix_achat: parseFloat(formData.prix_achat),
        prix_vente: parseFloat(formData.prix_vente),
        stock_actuel: parseInt(formData.stock_actuel),
        stock_minimum: parseInt(formData.stock_minimum),
        ordonnance_requise: formData.ordonnance_requise === true || formData.ordonnance_requise === "true",
        };

        if (editingMedId) {
        // update
        await updateMedicament(editingMedId, payload);
        setMessage("Médicament modifié avec succès !");
        } else {
        // create
        await createMedicament(payload);
        setMessage("Médicament créé avec succès !");
        }

        // reset
        setFormData({
        nom: "",
        dci: "",
        categorie: "",
        forme: "",
        dosage: "",
        prix_achat: "",
        prix_vente: "",
        stock_actuel: "",
        stock_minimum: "",
        ordonnance_requise: "",
        date_expiration: "",
        });
        setEditingMedId(null);
    } catch (err) {
        if (err.response?.data) {
            const errors = Object.values(err.response.data).flat().join(" ");
            setMessage(errors);
        }else{
            setMessage(err.response?.data?.nom?.[0] || "Erreur lors de l'opération");
        }
        
    }
    };

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors du chargement des médicaments</p>;

  return (
    <div>
      <h1>Liste des Médicaments</h1>
        <p style={{ color: "red" }}>
        Médicaments en alerte ( stock bas ) :{" "}
        {data?.filter((med) => med.est_en_alerte).length || 0}
        </p>
            <div>
            <h2>Filtres</h2>
            <input
                type="text"
                placeholder="Nom"
                value={filters.nom}
                onChange={(e) => setFilters({ ...filters, nom: e.target.value })}
            />

            <select
                value={filters.categorie}
                onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
            >
                <option value="">Toutes les catégories</option>
                {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                    {cat.nom}
                </option>
                ))}
            </select>

            <label>
                <input
                type="checkbox"
                checked={filters.stockBas}
                onChange={(e) =>
                    setFilters({ ...filters, stockBas: e.target.checked })
                }
                />
                Stock bas
            </label>
            </div>
            
        <table>
        <thead>
            <tr>
            <th>Nom</th>
            <th>DCI</th>
            <th>Catégorie</th>
            <th>Forme</th>
            <th>Dosage</th>
            <th>Prix achat</th>
            <th>Prix vente</th>
            <th>Stock actuel</th>
            <th>Stock minimum</th>
            <th>Ordonnance requise</th>
            <th>Date expiration</th>
            <th>actif (oui|non)</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {filteredMeds.map((med) => (
            <tr key={med.id}>
                <td>{med.nom}</td>
                <td>{med.dci}</td>
                <td>{getCategorieNom(med.categorie)}</td>
                <td>{med.forme}</td>
                <td>{med.dosage}</td>
                <td>{med.prix_achat}</td>
                <td>{med.prix_vente}</td>
                <td style={{ color: med.est_en_alerte ? "red" : "black" }}>
                {med.stock_actuel}
                </td>
                <td>{med.stock_minimum}</td>
                <td>{med.ordonnance_requise ? "Oui" : "Non"}</td>
                <td>{med.date_expiration}</td>
                <td>{med.est_actif ? "Oui" : "Non"}</td>
                <td>
                    <button
                        type="button"
                        onClick={() => {
                        setEditingMedId(med.id);
                        setFormData({
                            nom: med.nom,
                            dci: med.dci,
                            categorie: med.categorie || "",
                            forme: med.forme,
                            dosage: med.dosage,
                            prix_achat: med.prix_achat,
                            prix_vente: med.prix_vente,
                            stock_actuel: med.stock_actuel,
                            stock_minimum: med.stock_minimum,
                            ordonnance_requise: med.ordonnance_requise,
                            date_expiration: med.date_expiration,
                        });
                        }}
                    >
                        Modifier
                    </button>
                    <button
                            type="button"
                            onClick={async () => {
                            if (window.confirm("Voulez-vous vraiment supprimer ce médicament ?")) {
                                try {
                                await deleteMedicament(med.id);
                                setMessage("Médicament supprimé !");
                                } catch (err) {
                                setMessage("Erreur lors de la suppression");
                                }
                            }
                            }}
                        >
                            Supprimer
                    </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>

      <h2>Ajouter un médicament</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Nom"
          required
        />
        <input
          name="dci"
          value={formData.dci}
          onChange={handleChange}
          placeholder="DCI"
        />
        <select
        name="categorie"
        value={formData.categorie}
        onChange={handleChange}
        required
        >
        <option value="">Sélectionner une catégorie</option>
        {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
            {cat.nom}
            </option>
        ))}
        </select>
        <input
          name="forme"
          value={formData.forme}
          onChange={handleChange}
          placeholder="Forme"
          required
        />
        <input
          name="dosage"
          value={formData.dosage}
          onChange={handleChange}
          placeholder="Dosage"
          required
        />
        <input
          name="prix_achat"
          value={formData.prix_achat}
          onChange={handleChange}
          placeholder="Prix achat"
          type="number"
          step="0.01"
          required
        />
        <input
          name="prix_vente"
          value={formData.prix_vente}
          onChange={handleChange}
          placeholder="Prix vente"
          type="number"
          step="0.01"
          required
        />
        <input
          name="stock_actuel"
          value={formData.stock_actuel}
          onChange={handleChange}
          placeholder="Stock actuel"
          type="number"
          required
        />
        <input
          name="stock_minimum"
          value={formData.stock_minimum}
          onChange={handleChange}
          placeholder="Stock minimum"
          type="number"
          required
        />
        <select
            name="ordonnance_requise"
            value={formData.ordonnance_requise === "" ? "" : formData.ordonnance_requise}
            onChange={handleChange}
            required
            >
            <option value="">Choisir</option>
            <option value={true}>Oui</option>
            <option value={false}>Non</option>
        </select>
        <input
            type="date"
            name="date_expiration"
            value={formData.date_expiration}
            onChange={handleChange}
            required
        />
        <button type="submit">
            {editingMedId ? "Modifier" : "Ajouter"}
        </button>
      </form>
    </div>
  );
};

export default MedicamentsPage;