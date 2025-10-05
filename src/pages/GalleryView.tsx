import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import s from "../styles/layout.module.css";
import { usePokemonList, art } from "../pokeApi";

export default function GalleryView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<string[]>(
    searchParams.get("types") ? searchParams.get("types")!.split(",") : []
  );

  const { data, isLoading, error } = usePokemonList();

  // ✅ 当 selected 变化时更新 URL（避免出现空参数 ?types=）
  useEffect(() => {
    if (selected.length > 0) {
      setSearchParams({ types: selected.join(",") }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [selected, setSearchParams]);

  // ✅ 根据筛选类型过滤数据
  const filtered = selected.length
    ? data?.filter((p) => p.types.some((t) => selected.includes(t))) ?? []
    : data ?? [];

  // ✅ 处理选中/取消选中逻辑
  const toggleType = (type: string) => {
    setSelected((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const allTypes = Array.from(
    new Set(data?.flatMap((p) => p.types) ?? [])
  ).sort();

  if (error) return <div className={s.error}>Failed to load Pokémon data.</div>;

  return (
    <main className={s.main}>
      <h1 className={s.title}>Pokémon Gallery</h1>

      {/* ✅ 筛选标签 */}
      <div className={s.filterBar}>
        {allTypes.map((t) => (
          <button
            key={t}
            className={`${s.chip} ${selected.includes(t) ? s.active : ""}`}
            onClick={() => toggleType(t)}
          >
            {t}
          </button>
        ))}
        {selected.length > 0 && (
          <button className={s.clearBtn} onClick={() => setSelected([])}>
            Clear
          </button>
        )}
      </div>

      {/* ✅ 骨架加载状态 */}
      {isLoading ? (
        <div className={s.grid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={s.skeletonCard}>
              <div className={s.thumb}></div>
              <div className={s.textPlaceholder}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className={s.grid}>
          {filtered.map((p) => (
            <Link to={`/pokemon/${p.id}`} key={p.id} className={s.card}>
              <img
                className={s.thumb}
                src={art(p)}
                alt={p.name}
                loading="lazy" // ✅ 懒加载
              />
              <h2>{p.name}</h2>
              <p className={s.types}>{p.types.join(", ")}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

