import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import DashboardPage from "./pages/DashboardPage";
import MedicamentsPage from "./pages/MedicamentsPage";
import VentesPage from "./pages/VentesPage";
import CategoriesPage from "./pages/CategoriesPage";
import Navbar from "./components/Navbar";
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/medicaments" element={<MedicamentsPage />} />
          <Route path="/ventes" element={<VentesPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;