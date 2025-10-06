import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import s from "../styles/layout.module.css";
import { getPokemonList } from "../api/pokeApi";
import type { PokemonListItem } from "../types";

/** ------- 小工具 & 类型 ------- */
type SortKey = "name" | "id";
type Order = "asc" | "desc";

type NameBand = "all" | "A-F" | "G-L" | "M-R" | "S-Z";
type IdBand = "all" | "1-50" | "51-100" | "101-151";

const NAME_BANDS: NameBand[] = ["all", "A-F", "G-L", "M-R", "S-Z"];
const ID_BANDS: IdBand[] = ["all", "1-50", "51-100", "101-151"];

function getIdFromUrl(url: string) {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}
function artworkUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
function inNameBand(name: string, band: NameBand) {
  if (band === "all") return true;
  const ch = name.charAt(0).toUpperCase();
  const within = (a: string, b: string) => ch >= a && ch <= b;
  if (band === "A-F") return within("A", "F");
  if (band === "G-L") return within("G", "L");
  if (band === "M-R") return within("M", "R");
  return within("S", "Z");
}
function inIdBand(id: number, band: IdBand) {
  if (band === "all") return true;
  if (band === "1-50") return id >= 1 && id <= 50;
  if (band === "51-100") return id >= 51 && id <= 100;
  return id >= 101 && id <= 151;
}
function sortList<T extends { name: string; id: number }>(
  arr: T[],
  sortBy: SortKey,
  order: Order
) {
  return [...arr].sort((a, b) => {
    const cmp = sortBy === "name" ? a.name.localeCompare(b.name) : a.id - b.id;
    return order === "asc" ? cmp : -cmp;
  });
}

/** ------- 极简防抖 Hook（内联） ------- */
function useDebouncedValue<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

/** ------- Chip 组件 ------- */
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

/** ======================= 页面 ======================= */
export default function ListView() {
  const [sp, setSp] = useSearchParams();

  // 初始化从 URL 读取
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [sortBy, setSortBy] = useState<SortKey>(
    ((sp.get("sortBy") as SortKey) ?? "name")
  );
  const [order, setOrder] = useState<Order>(
    ((sp.get("order") as Order) ?? "asc")
  );
  const [nameBand, setNameBand] = useState<NameBand>(
    ((sp.get("nameBand") as NameBand) ?? "all")
  );
  const [idBand, setIdBand] = useState<IdBand>(
    ((sp.get("idBand") as IdBand) ?? "all")
  );

  // 同步到 URL
  function syncURL(next: Partial<Record<string, string>>) {
    const params = new URLSearchParams(sp);
    Object.entries(next).forEach(([k, v]) => {
      if (!v) params.delete(k);
      else params.set(k, v);
    });
    setSp(params, { replace: true });
  }

  // 数据
  const [loading, setLoading] = useState(true);
  const [rawList, setRawList] = useState<Array<PokemonListItem & { id: number }>>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await getPokemonList(151, 0);
        const withId = list.map((it) => ({ ...it, id: getIdFromUrl(it.url) }));
        if (!cancelled) setRawList(withId);
      } catch (e) {
        if (!cancelled) setRawList([]);
        // 可以在此处上报错误日志
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const qDebounced = useDebouncedValue(q, 300);

  const list = useMemo(() => {
    // 1) 搜索
    const kw = qDebounced.trim().toLowerCase();
    const afterSearch = kw
      ? rawList.filter(
          (it) =>
            it.name.toLowerCase().includes(kw) || String(it.id).includes(kw)
        )
      : rawList;

    // 2) 点击筛选
    const afterClick = afterSearch.filter(
      (it) => inNameBand(it.name, nameBand) && inIdBand(it.id, idBand)
    );

    // 3) 排序
    return sortList(afterClick, sortBy, order);
  }, [rawList, qDebounced, sortBy, order, nameBand, idBand]);

  return (
    <main className={s.container}>
      <h1>Pokémon List</h1>

      {/* 控件：搜索 + 排序 */}
      <div className={s.controls}>
        <input
          className={s.input}
          placeholder="Search by name or ID…"
          value={q}
          onChange={(e) => { const v = e.target.value; setQ(v); syncURL({ q: v }); }}
        />

        <select
          className={s.select}
          value={sortBy}
          onChange={(e) => { const v = e.target.value as SortKey; setSortBy(v); syncURL({ sortBy: v }); }}
        >
          <option value="name">Sort by: Name</option>
          <option value="id">Sort by: ID</option>
        </select>

        <select
          className={s.select}
          value={order}
          onChange={(e) => { const v = e.target.value as Order; setOrder(v); syncURL({ order: v }); }}
        >
          <option value="asc">Ascending ↑</option>
          <option value="desc">Descending ↓</option>
        </select>
      </div>

      {/* 点击式过滤器 */}
      <div style={{ margin: "8px 0" }} role="group" aria-label="Filter by Name">
        <div style={{ marginBottom: 6, fontWeight: 600 }}>Filter by Name</div>
        {NAME_BANDS.map((b) => (
          <Chip key={b} active={nameBand === b} onClick={() => { setNameBand(b); syncURL({ nameBand: b }); }}>
            {b}
          </Chip>
        ))}
      </div>

      <div style={{ margin: "8px 0" }} role="group" aria-label="Filter by ID">
        <div style={{ marginBottom: 6, fontWeight: 600 }}>Filter by ID</div>
        {ID_BANDS.map((b) => (
          <Chip key={b} active={idBand === b} onClick={() => { setIdBand(b); syncURL({ idBand: b }); }}>
            {b}
          </Chip>
        ))}
      </div>

      {/* 加载骨架 */}
      {loading && (
        <section className={s.grid} aria-busy="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={s.card} aria-hidden>
              <div style={{
                width: 200, height: 200, borderRadius: 12,
                background: "linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%)",
                backgroundSize: "400% 100%", animation: "shimmer 1.2s infinite"
              }}/>
              <div style={{ height: 14, width: 120, marginTop: 10, background: "#eee", borderRadius: 6 }}/>
              <div style={{ height: 12, width: 60, marginTop: 6, background: "#f0f0f0", borderRadius: 6 }}/>
            </div>
          ))}
        </section>
      )}

      {/* 空状态 */}
      {!loading && list.length === 0 && (
        <div style={{ margin: "12px 0", opacity: 0.8 }}>
          No matches. Try adjusting search or filters.
        </div>
      )}

      {/* 列表 */}
      {!loading && list.length > 0 && (
        <section className={s.grid}>
          {list.map((it) => (
            <Link to={`/pokemon/${it.id}`} key={it.name} className={s.card}>
              <img
                className={s.thumb}
                src={artworkUrl(it.id)}
                alt={it.name}
                loading="lazy"
                width={200}
                height={200}
              />
              <div className={s.title}>{it.name}</div>
              <div className={s.id}>#{it.id}</div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}

