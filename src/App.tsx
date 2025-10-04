import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import ListView from "./pages/ListView";
import DetailView from "./pages/DetailView";

export default function App() {
  return (
    <BrowserRouter basename="/mp2">
      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/pokemon/:id" element={<DetailView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
