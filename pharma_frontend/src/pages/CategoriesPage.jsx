import React, { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { createCategory } from "../api/categoriesApi";
import { useQueryClient } from "@tanstack/react-query";

const CategoriesPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useCategories();

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createCategory({ nom, description });

      setMessage("Catégorie créée avec succès !");
      setNom("");
      setDescription("");

      // Re-fetch categories après création
      queryClient.invalidateQueries(["categories"]);
    } catch (err) {
      setMessage(
        err.response?.data?.nom?.[0] || "Erreur lors de la création"
      );
    }
  };

  if (isLoading) return <p>Chargement des catégories...</p>;
  if (isError) return <p>Erreur lors du chargement des catégories</p>;

  return (
    <div>
      <h1>Catégories</h1>

      <ul>
        {data?.results?.map((cat) => (
          <li key={cat.id}>
            {cat.nom} {cat.description && `- ${cat.description}`}
          </li>
        ))}
      </ul>

      <h2>Ajouter une catégorie</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (optionnel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default CategoriesPage;