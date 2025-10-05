import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getManyPokemonDetails } from "../api/pokeApi";
import type { Pokemon } from "../types";
import s from "../styles/layout.module.css";

const RANGE_START = 1;
const RANGE_END = 120;

function art(p: Pokemon) {
  return (
    p.sprites.other?.["official-artwork"]?.front_default ??
    p.sprites.front_default ??
    ""
  );
}

export default function GalleryView() {
  const [all, setAll] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // --- URL 同步筛选：?types=grass,poison ---
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedFromUrl = useMemo(() => {
    const raw = searchParams.get("types") || "";
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [searchParams]);

  const [selected, setSelected] = useState<string[]>(selectedFromUrl);

  // URL → State（当用户手改 query 时，同步到 state）
  useEffect(() => {
    setSelected(selectedFromUrl);
  }, [selectedFromUrl]);

  // State → URL（点击筛选时，同步到 query）
  useEffect(() => {
    if (selected.length) {
      setSearchParams({ types: selected.join(",") }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [selected, setSearchParams]);

  // 拉取数据
  const fetchData = useCallback(async () => {
    try {
      setErr(null);
      setLoading(true);
      const ids = Array.from(
        { length: RANGE_END - RANGE_START + 1 },
        (_, i) => RANGE_START + i
      );
      const data = await getManyPokemonDetails(ids);
      setAll(data);
    } catch {
      setErr("Failed to load gallery.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 可选类型列表
  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    all.forEach((p) => p.types?.forEach((t) => set.add(t.type.name)));
    return Array.from(set).sort();
  }, [all]);

  // 过滤
  const filtered = useMemo(() => {
    if (!selected.length) return all;
    return all.filter((p) =>
      selected.every((t) => p.types?.some((x) => x.type.name === t))
    );
  }, [all, selected]);

  // 切换 chip
  function toggleType(t: string) {
    setSelected((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  return (
    <main className="page">
      <h1>Gallery</h1>

      {/* 筛选 Chips */}
      <div className={s.chips} role="group" aria-label="type filters">
        {typeOptions.map((t) => {
          const active = selected.includes(t);
          return (
            <button
              key={t}
              className={`${s.chip} ${active ? s.active : ""}`}
              aria-pressed={active}
              onClick={() => toggleType(t)}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* 已选提示 */}
      {selected.length > 0 && (
        <p className={s.metaNote}>
          {filtered.length} results ·{" "}
          <button
            className={s.chip}
            onClick={() => setSelected([])}
            aria-label="Clear filters"
          >
            Clear filters
          </button>
        </p>
      )}

      {/* 错误 & 重试 */}
      {err && (
        <p role="alert">
          {err}{" "}
          <button className={s.btn} onClick={fetchData}>
            Retry
          </button>
        </p>
      )}

      {/* 骨架屏 */}
      {loading ? (
        <div className={s.grid} aria-busy="true" aria-live="polite">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`${s.card} ${s.skeletonCard}`} aria-hidden="true">
              <div className={`${s.thumb} ${s.skeletonBox}`} />
              <div className={`${s.title} ${s.skeletonLine}`} />
            </div>
          ))}
        </div>
      ) : (
        <div className={s.grid}>
          {filtered.map((p) => (
            <Link
              key={p.id}
              className={s.card}
              to={`/pokemon/${p.id}`}
              aria-label={`Open ${p.name} details`}
            >
              <img className={s.thumb} src={art(p)} alt={p.name} loading="lazy" />
              <div className={s.title}>{p.name}</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

