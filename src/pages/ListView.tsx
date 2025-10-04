import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPokemonList } from "../api/pokeApi";
import type { PokemonListItem } from "../types";
import s from "../styles/layout.module.css";

type SortKey = "name" | "id";
type Dir = "asc" | "desc";

function idFromUrl(url: string) {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

function artUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export default function ListView() {
  const [all, setAll] = useState<PokemonListItem[]>([]);
  const [q, setQ] = useState("");
  const [key, setKey] = useState<SortKey>("name");
  const [dir, setDir] = useState<Dir>("asc");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getPokemonList(120, 0);
        setAll(list);
      } catch {
        setErr("Failed to load from PokeAPI.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const f = all.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    const sorted = [...f].sort((a, b) => {
      const A = key === "name" ? a.name : idFromUrl(a.url);
      const B = key === "name" ? b.name : idFromUrl(b.url);
      return A < B ? -1 : A > B ? 1 : 0;
    });
    return dir === "asc" ? sorted : sorted.reverse();
  }, [all, q, key, dir]);

  return (
    <main className="page">
      <h1>Pokémon List</h1>

      <section className={s.panel} aria-labelledby="search-title">
        <div className={s.field}>
          <input
            type="search"
            placeholder="Search Pokémon by name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              width: "100%",
              padding: ".6rem .75rem",
              borderRadius: 8,
              border: "1px solid #cfd8dc",
            }}
            aria-label="search"
          />
        </div>

        <div className={s.field}>
          <label
            style={{
              display: "block",
              color: "#556",
              fontSize: 14,
              marginBottom: 4,
            }}
          >
            Sort by:
          </label>
          <select
            value={key}
            onChange={(e) => setKey(e.target.value as SortKey)}
            style={{
              width: "100%",
              padding: ".5rem .6rem",
              borderRadius: 8,
              border: "1px solid #cfd8dc",
            }}
            aria-label="sort key"
          >
            <option value="name">Name</option>
            <option value="id">ID</option>
          </select>
        </div>

        <div className={s.radioGroup} role="group" aria-label="order">
          <label>
            <input
              type="radio"
              name="order"
              value="asc"
              checked={dir === "asc"}
              onChange={() => setDir("asc")}
            />{" "}
            ascending
          </label>
          <label>
            <input
              type="radio"
              name="order"
              value="desc"
              checked={dir === "desc"}
              onChange={() => setDir("desc")}
            />{" "}
            descending
          </label>
        </div>
      </section>

      {err && <p role="alert">{err}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul className={s.listBlock}>
          {filtered.map((p) => {
            const id = idFromUrl(p.url);
            return (
              <li key={p.name} className={s.item}>
                <img
                  className={s.thumbSmall}
                  src={artUrl(id)}
                  alt={p.name}
                  loading="lazy"
                />
                <div>
                  <Link
                    to={`/pokemon/${id}`}
                    className={s.nameLink}
                    style={{ textTransform: "capitalize" }}
                  >
                    {p.name}
                  </Link>
                  <div className={s.rank}>#{id}</div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}


