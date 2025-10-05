import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
import NotFound from "./pages/NotFound";
import "./styles/layout.module.css";

export default function App() {
  return (
    <Router>
      <header
        style={{
          padding: "1rem",
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          borderBottom: "1px solid #ddd",
          background: "#fafafa",
        }}
      >
        <Link to="/">List</Link>
        <Link to="/gallery">Gallery</Link>
      </header>

      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="/pokemon/:id" element={<DetailView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
