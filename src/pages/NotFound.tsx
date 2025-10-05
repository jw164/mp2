import { Link } from "react-router-dom";
import s from "../styles/layout.module.css";

export default function NotFound() {
  return (
    <main className="page">
      <h1>404 Not Found</h1>
      <p className={s.metaNote}>The page you requested does not exist.</p>
      <Link to="/" className={s.btn}>Go Home</Link>
    </main>
  );
}
