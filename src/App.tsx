import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
import NotFound from "./pages/NotFound"; // 独立404页组件
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
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
