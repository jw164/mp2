import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
import s from "./styles/layout.module.css";

// 简单的 404 页，避免内联样式
function NotFound() {
  return (
    <main className="page">
      <h1>Not found</h1>
      <p>
        The page you visited does not exist.{" "}
        <a href="/mp2/">Go home</a>
      </p>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/mp2">
      <nav className={s.nav}>
        <strong>PokéDex</strong>
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? s.active : undefined)}
        >
          List
        </NavLink>
        <NavLink
          to="/gallery"
          className={({ isActive }) => (isActive ? s.active : undefined)}
        >
          Gallery
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="/pokemon/:id" element={<DetailView />} />
      
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
