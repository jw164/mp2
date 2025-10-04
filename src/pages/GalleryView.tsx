import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { usePokemonData } from "../hooks/usePokemonData";
import type { Pokemon } from "../types";
import s from "../styles/layout.module.css";

const ALL_TYPES = ["normal","fire","water","electric","grass","ice","fighting","poison","ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy"] as const;
type TypeName = typeof ALL_TYPES[number];

function sprite(p: Pokemon) {
  return (
    p.sprites.other?.["official-artwork"]?.front_default ||
    p.sprites.front_default ||
    ""
  );
}

export default function GalleryView() {
  const { list, loading, err } = usePokemonData(60);
  const [types, setTypes] = useState<TypeName[]>([]);

  function toggle(t: TypeName) {
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  const filtered = useMemo(() => {
    if (!types.length) return list;
    return list.filter(p => types.every(t => p.types?.some(pt => pt.type.name === t)));
  }, [list, types]);

  return (
    <main className={s.container}>
      <h1>Gallery</h1>
      <div className={s.chips}>
        {ALL_TYPES.map(t => (
          <button key={t} className={`${s.chip} ${types.includes(t) ? s.active : ""}`} onClick={() => toggle(t)} aria-pressed={types.includes(t)}>
            {t}
          </button>
        ))}
      </div>
      {err && <p role="alert">{err}</p>}
      {loading ? <p>Loading…</p> : (
        <div className={s.grid}>
          {filtered.map(p => (
            <Link key={p.id} to={`/pokemon/${p.id}`} className={s.card}>
              {sprite(p) && <img className={s.thumb} src={sprite(p)!} alt={p.name} />}
              <div className={s.title}>#{p.id} {p.name}</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
