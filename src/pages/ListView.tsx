// src/pages/ListView.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import s from "../styles/layout.module.css";
import { getPokemonList } from "../api/pokeApi";
import type { PokemonListItem } from "../types";

type SortKey = "name" | "id";
type Order = "asc" | "desc";

function getIdFromUrl(url: string) {
  // PokeAPI 列表里每个条目都有 .../pokemon/1/ 这样的 url
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

function artworkUrl(id: number) {
  // 用官方 artwork CDN，列表不需要逐个打详情接口
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export default function ListView() {
  const [rawList, setRawList] = useState<PokemonListItem[]>([]);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [order, setOrder] = useState<Order>("asc");

  useEffect(() => {
    getPokemonList(151, 0).then(setRawList).catch(console.error);
  }, []);

  const list = useMemo(() => {
    const withId = rawList.map((it) => ({
      ...it,
      id: getIdFromUrl(it.url),
    }));

    const filtered = q.trim()
      ? withId.filter((it) =>
          it.name.toLowerCase().includes(q.trim().toLowerCase())
        )
      : withId;

    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else cmp = a.id - b.id;
      return order === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [rawList, q, sortBy, order]);

  return (
    <main className={s.container}>
      <h1>Pokémon List</h1>

      <div className={s.controls}>
        <input
          className={`${s.input}`}
          placeholder="Search Pokémon by name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className={s.select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
        >
          <option value="name">Sort by: Name</option>
          <option value="id">Sort by: ID</option>
        </select>

        <select
          className={s.select}
          value={order}
          onChange={(e) => setOrder(e.target.value as Order)}
        >
          <option value="asc">Ascending ↑</option>
          <option value="desc">Descending ↓</option>
        </select>
      </div>

      <section className={s.grid}>
        {list.map((it) => {
          const id = getIdFromUrl(it.url);
          return (
            <Link to={`/pokemon/${id}`} key={it.name} className={s.card}>
              <img className={s.thumb} src={artworkUrl(id)} alt={it.name} />
              <div className={s.title}>{it.name}</div>
              <div className={s.id}>#{id}</div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
