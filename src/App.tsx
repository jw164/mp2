import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
import NavBar from "./components/NavBar";
import s from "./styles/layout.module.css";

export default function App() {
  return (
    <BrowserRouter basename="/mp2">
      <nav className={s.nav}>
        <strong>PokéDex</strong>
        <a href="/">List</a>
        <a href="/gallery">Gallery</a>
      </nav>
      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="/pokemon/:id" element={<DetailView />} />
      </Routes>
    </BrowserRouter>
  );
}

