import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{
      display: "flex",
      gap: "20px",
      padding: "15px",
      background: "#1f2937",
      color: "white"
    }}>
      <Link style={{color:"white"}} to="/">Dashboard</Link>
      <Link style={{color:"white"}} to="/medicaments">Médicaments</Link>
      <Link style={{color:"white"}} to="/ventes">Ventes</Link>
    </nav>
  );
};

export default Navbar;