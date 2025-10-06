// src/pages/ListView.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import s from "../styles/layout.module.css";
import { getPokemonList } from "../api/pokeApi";
import type { PokemonListItem } from "../types";

// ===== 工具函数 =====
type SortKey = "name" | "id";
type Order = "asc" | "desc";

function getIdFromUrl(url: string) {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

function artworkUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

// ===== 过滤器：Name 与 ID 两组可点击 chips =====
type NameBand = "all" | "A-F" | "G-L" | "M-R" | "S-Z";
type IdBand = "all" | "1-50" | "51-100" | "101-151";

const NAME_BANDS: NameBand[] = ["all", "A-F", "G-L", "M-R", "S-Z"];
const ID_BANDS: IdBand[] = ["all", "1-50", "51-100", "101-151"];

function inNameBand(name: string, band: NameBand) {
  if (band === "all") return true;
  const ch = name.charAt(0).toUpperCase();
  const inRange = (a: string, b: string) => ch >= a && ch <= b;
  if (band === "A-F") return inRange("A", "F");
  if (band === "G-L") return inRange("G", "L");
  if (band === "M-R") return inRange("M", "R");
  return inRange("S", "Z"); // "S-Z"
}

function inIdBand(id: number, band: IdBand) {
  if (band === "all") return true;
  if (band === "1-50") return id >= 1 && id <= 50;
  if (band === "51-100") return id >= 51 && id <= 100;
  return id >= 101 && id <= 151; // "101-151"
}

// 一个极简 chip 样式（不依赖你现有 css）
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        margin: 4,
        padding: "6px 12px",
        borderRadius: 999,
        border: active ? "2px solid #111" : "1px solid #ccc",
        background: active ? "#f2f2f2" : "#fff",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export default function ListView() {
  // 原有状态
  const [rawList, setRawList] = useState<PokemonListItem[]>([]);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [order, setOrder] = useState<Order>("asc");

  // 新增：点击式过滤器状态
  const [nameBand, setNameBand] = useState<NameBand>("all");
  const [idBand, setIdBand] = useState<IdBand>("all");

  useEffect(() => {
    getPokemonList(151, 0).then(setRawList).catch(console.error);
  }, []);

  const list = useMemo(() => {
    // 先补充 id 字段
    const withId = rawList.map((it) => ({
      ...it,
      id: getIdFromUrl(it.url),
    }));

    // 1) 文本搜索
    const kw = q.trim().toLowerCase();
    const afterSearch = kw
      ? withId.filter(
          (it) =>
            it.name.toLowerCase().includes(kw) ||
            String(it.id).includes(kw)
        )
      : withId;

    // 2) 点击式过滤：Name 分段 + ID 分段
    const afterClickFilters = afterSearch.filter(
      (it) => inNameBand(it.name, nameBand) && inIdBand(it.id, idBand)
    );

    // 3) 排序（name / id + 升降序）
    const sorted = [...afterClickFilters].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else cmp = a.id - b.id;
      return order === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [rawList, q, sortBy, order, nameBand, idBand]);

  return (
    <main className={s.container}>
      <h1>Pokémon List</h1>

      {/* ===== 控件区：搜索 + 排序 ===== */}
      <div className={s.controls}>
        <input
          className={s.input}
          placeholder="Search by name or ID…"
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

      {/* ===== 新增：可点击过滤器 ===== */}
      <div style={{ margin: "8px 0" }}>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>Filter by Name</div>
        {NAME_BANDS.map((b) => (
          <Chip key={b} active={nameBand === b} onClick={() => setNameBand(b)}>
            {b}
          </Chip>
        ))}
      </div>

      <div style={{ margin: "8px 0" }}>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>Filter by ID</div>
        {ID_BANDS.map((b) => (
          <Chip key={b} active={idBand === b} onClick={() => setIdBand(b)}>
            {b}
          </Chip>
        ))}
      </div>

      {/* ===== 列表渲染 ===== */}
      <section className={s.grid}>
        {list.map((it) => (
          <Link to={`/pokemon/${it.id}`} key={it.name} className={s.card}>
            <img className={s.thumb} src={artworkUrl(it.id)} alt={it.name} />
            <div className={s.title}>{it.name}</div>
            <div className={s.id}>#{it.id}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}

