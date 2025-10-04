import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPokemonById } from "../api/pokeApi";
import type { Pokemon } from "../types";

function sprite(p: Pokemon | null) {
  return (
    p?.sprites.other?.["official-artwork"]?.front_default ||
    p?.sprites.front_default ||
    ""
  );
}

export default function DetailView() {
  const { id } = useParams();
  const pid = Number(id);
  const [poke, setPoke] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getPokemonById(pid);
        setPoke(data);
      } catch (e) {
        setErr("Failed to load details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [pid]);

  return (
    <main style={{ padding: "1rem" }}>
      <Link to="/">← Back to List</Link>
      {loading && <p>Loading…</p>}
      {err && <p role="alert">{err}</p>}
      {poke && (
        <>
          <h1 style={{ textTransform: "capitalize" }}>{poke.name}</h1>
          {sprite(poke) && (
            <img src={sprite(poke)!} alt={poke.name} style={{ width: 240, height: 240, objectFit: "contain" }} />
          )}
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
