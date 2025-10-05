import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
import s from "./styles/layout.module.css";

export default function App() {
  return (
    <BrowserRouter basename="/mp2">
      <nav className={s.nav}>
        <strong>PokéDex</strong>
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : undefined)}>
          List
        </NavLink>
        <NavLink to="/gallery" className={({ isActive }) => (isActive ? "active" : undefined)}>
          Gallery
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="/pokemon/:id" element={<DetailView />} />
      </Routes>
    </BrowserRouter>
  );
}
