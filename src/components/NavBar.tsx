import { NavLink } from "react-router-dom";
import s from "../styles/layout.module.css";

export default function NavBar() {
  return (
    <nav className={s.nav}>
      <strong>PokéDex</strong>
      <NavLink to="/">List</NavLink>
      <NavLink to="/gallery">Gallery</NavLink>
    </nav>
  );
}
