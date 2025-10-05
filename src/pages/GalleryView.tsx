// src/pages/GalleryView.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import s from "../styles/layout.module.css";
import { api } from "../pokeApi"; // ⬅⬅ 关键：确认这个路径能指向 src/pokeApi.ts

type PokemonListItem = {
  name: string;
  url: string; // e.g. https://pokeapi.co/api/v2/pokemon/1/
};
type PokeListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
};

function extractIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}
function spriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export default function GalleryView() {
  const [loading, setLoading] = useState(true);
  const [raw, setRaw] = useState<PokemonListItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<"id" | "name">("id");
  const [asc, setAsc] = useState(true);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get<PokeListResponse>("/pokemon?limit=200");
        if (!ok) return;
        setRaw(data.results);
        setErr(null);
      } catch (e: any) {
        if (!ok) return;
        setErr(e?.message ?? "Fetch failed");
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    let items = raw.map((p) => ({
      ...p,
      id: extractIdFromUrl(p.url),
    }));
    if (keyword) {
      items = items.filter((p) => p.name.toLowerCase().includes(keyword));
    }
    items.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "id") cmp = a.id - b.id;
      else cmp = a.name.localeCompare(b.name);
      return asc ? cmp : -cmp;
    });
    return items;
  }, [raw, q, sortKey, asc]);

  if (loading) return <main className={s.container}>Loading…</main>;
  if (err) return <main className={s.container}>Error: {err}</main>;

  return (
    <main className={s.container}>
      <h1>Pokémon Gallery</h1>

      <div className={s.controls}>
        <input
          className={s.input}
          placeholder="Search Pokémon by name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className={s.select}
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as "id" | "name")}
        >
          <option value="id">Sort by: ID</option>
          <option value="name">Sort by: Name</option>
        </select>
        <select
          className={s.select}
          value={asc ? "asc" : "desc"}
          onChange={(e) => setAsc(e.target.value === "asc")}
        >
          <option value="asc">Ascending ↑</option>
          <option value="desc">Descending ↓</option>
        </select>
      </div>

      <section className={s.grid} aria-label="Pokémon Gallery">
        {filtered.map((p) => (
          <Link
            key={p.id}
            to={`/pokemon/${p.id}`}
            className={s.card}
            aria-label={`${p.name} (#${p.id})`}
          >
            <img
              className={s.thumb}
              src={spriteUrl(p.id)}
              alt={p.name}
              loading="lazy"
              width={256}
              height={256}
            />
            <div className={s.title}>
              #{p.id} {p.name}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

