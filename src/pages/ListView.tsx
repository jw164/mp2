import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPokemonList } from "../api/pokeApi";
import type { PokemonListItem } from "../types";

function idFromUrl(url: string) {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

export default function ListView() {
  const [all, setAll] = useState<PokemonListItem[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getPokemonList(100, 0);
        setAll(list);
      } catch (e) {
        setErr("Failed to load from PokeAPI.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () => all.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())),
    [all, q]
  );

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Pokémon List</h1>
      <input
        placeholder="Search Pokémon by name..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ padding: ".5rem", width: "100%", maxWidth: 420, margin: "0.5rem 0 1rem" }}
      />
      {err && <p role="alert">{err}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filtered.map((p) => {
            const id = idFromUrl(p.url);
            return (
              <li key={p.name} style={{ margin: ".4rem 0" }}>
                <Link to={`/pokemon/${id}`} style={{ textTransform: "capitalize" }}>
                  #{id} {p.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
