import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ListView from "./pages/ListView";
import DetailView from "./pages/DetailView";

export default function App() {
  return (
    <Router basename="/mp2">
      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/pokemon/:id" element={<DetailView />} />
        {/* Fallback route: redirect any unknown path to the list */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
