import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const ids = Array.from({ length: RANGE_END - RANGE_START + 1 }, (_, i) => RANGE_START + i);
        const data = await getManyPokemonDetails(ids);
        setAll(data);
      } catch {
        setErr("Failed to load gallery.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    all.forEach((p) => p.types?.forEach((t) => set.add(t.type.name)));
    return Array.from(set).sort();
  }, [all]);

  const filtered = useMemo(() => {
    if (!selected.length) return all;
    return all.filter((p) =>
      selected.every((t) => p.types?.some((x) => x.type.name === t))
    );
  }, [all, selected]);

  function toggleType(t: string) {
    setSelected((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  return (
    <main className="page">
      <h1>Gallery</h1>

      <div className={s.chips} role="group" aria-label="type filters">
        {typeOptions.map((t) => (
          <button
            key={t}
            className={`${s.chip} ${selected.includes(t) ? s.active : ""}`}
            onClick={() => toggleType(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <p style={{ marginTop: ".5rem" }}>
          {filtered.length} results ·{" "}
          <button className={s.chip} onClick={() => setSelected([])}>
            Clear filters
          </button>
        </p>
      )}

      {err && <p role="alert">{err}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className={s.grid}>
          {filtered.map((p) => (
            <Link key={p.id} className={s.card} to={`/pokemon/${p.id}`}>
              <img className={s.thumb} src={art(p)} alt={p.name} loading="lazy" />
              <div className={s.title}>{p.name}</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

