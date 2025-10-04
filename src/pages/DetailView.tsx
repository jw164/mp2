import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPokemonById } from "../api/pokeApi";
import type { Pokemon } from "../types";
import s from "../styles/layout.module.css";

function art(p: Pokemon | null) {
  return p?.sprites.other?.["official-artwork"]?.front_default || p?.sprites.front_default || "";
}

const MIN_ID = 1;
const MAX_ID = 120; // 和 ListView 拉取数量一致以便演示

export default function DetailView() {
  const { id } = useParams();
  const pid = Number(id);
  const nav = useNavigate();
  const [poke, setPoke] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setPoke(await getPokemonById(pid));
      } catch { setErr("Failed to load details."); }
      finally { setLoading(false); }
    })();
  }, [pid]);

  const prev = useMemo(() => (pid > MIN_ID ? pid - 1 : null), [pid]);
  const next = useMemo(() => (pid < MAX_ID ? pid + 1 : null), [pid]);

  return (
    <main className={s.container}>
      <div className={s.nav}>
        <button onClick={() => prev && nav(`/pokemon/${prev}`)} disabled={!prev}>◀ Prev</button>
        <Link to="/">Back to List</Link>
        <Link to="/gallery">Gallery</Link>
        <button onClick={() => next && nav(`/pokemon/${next}`)} disabled={!next}>Next ▶</button>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p role="alert">{err}</p>}

      {poke && (
        <>
          <h1 style={{ textTransform: "capitalize" }}>{poke.name}</h1>
          {art(poke) && <img src={art(poke)!} alt={poke.name} style={{ width: 260, height: 260, objectFit: "contain" }} />}
          <ul>
            <li>ID: {poke.id}</li>
            <li>Base XP: {poke.base_experience}</li>
            <li>Height: {poke.height}</li>
            <li>Weight: {poke.weight}</li>
          </ul>
        </>
      )}
    </main>
  );
}
