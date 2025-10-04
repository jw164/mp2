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
        const list = await getPokemonList(120, 0); // 前120个
        setAll(list);
      } catch {
        setErr("Failed to load from PokeAPI.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const f = all.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    const srt = [...f].sort((a, b) => {
      const va = key === "name" ? a.name : idFromUrl(a.url);
      const vb = key === "name" ? b.name : idFromUrl(b.url);
      return va < vb ? -1 : va > vb ? 1 : 0;
    });
    return dir === "asc" ? srt : srt.reverse();
  }, [all, q, key, dir]);

  return (
    <main className={s.container}>
      <h1>Pokémon List</h1>
      <div className={s.controls}>
        <input className={s.input} placeholder="Search Pokémon by name…" value={q} onChange={e => setQ(e.target.value)} />
        <select className={s.select} value={key} onChange={e => setKey(e.target.value as SortKey)}>
          <option value="name">Sort by: Name</option>
          <option value="id">Sort by: ID</option>
        </select>
        <select className={s.select} value={dir} onChange={e => setDir(e.target.value as Dir)}>
          <option value="asc">Ascending ↑</option>
          <option value="desc">Descending ↓</option>
        </select>
      </div>

      {err && <p role="alert">{err}</p>}
      {loading ? <p>Loading…</p> : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {filtered.map(p => {
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

