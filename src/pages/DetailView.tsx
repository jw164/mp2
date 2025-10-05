// src/pages/DetailView.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import s from "../styles/layout.module.css";
import type { Pokemon } from "../types";
import { api, getPokemonById } from "../api/pokeApi";

function formatId(id: number) {
  return `#${String(id).padStart(3, "0")}`;
}

function getImageUrl(p?: Pokemon | null) {
  if (!p) return "";
  // Prefer official artwork; fallback to front_default
  // (do not rely on dream_world to avoid typing/build issues)
  return (
    (p as any)?.sprites?.other?.["official-artwork"]?.front_default ||
    (p as any)?.sprites?.front_default ||
    ""
  );
}

export default function DetailView() {
  const { id } = useParams();
  const pid = useMemo(() => Number(id || 1), [id]);

  const [data, setData] = useState<Pokemon | null>(null);
  const [intro, setIntro] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // fetch pokemon details + species intro
  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      try {
        const p = await getPokemonById(pid);
        if (!alive) return;
        setData(p);

        // Fetch species flavor text (English)
        try {
          const { data: sp } = await api.get(`/pokemon-species/${pid}`);
          const entry =
            (sp?.flavor_text_entries as Array<any>)?.find(
              (e) => e?.language?.name === "en"
            ) || null;
          const text = (entry?.flavor_text || "")
            .replace(/\n|\f/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          if (alive) setIntro(text);
        } catch {
          // ignore species fetch errors
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [pid]);

  const img = getImageUrl(data);
  const prevId = pid > 1 ? pid - 1 : null;
  const nextId = pid + 1; // keep simple; PokeAPI has many ids

  if (loading) {
    return (
      <main className={s.container}>
        <h1 className={s.title}>Loading…</h1>
      </main>
    );
  }

  if (!data) {
    return (
      <main className={s.container}>
        <h1 className={s.title}>Not Found</h1>
        <p>
          The requested Pokémon does not exist.{" "}
          <Link to="/">Back to list</Link>
        </p>
      </main>
    );
  }

  return (
    <main className={s.container}>
      <h1 className={s.title}>
        {formatId(data.id)} {data.name.charAt(0).toUpperCase() + data.name.slice(1)}
      </h1>

      {/* Controls */}
      <div className={s.chips}>
        <Link className={s.chip} to="/">
          ← Back to List
        </Link>
        {prevId && (
          <Link className={s.chip} to={`/pokemon/${prevId}`}>
            ← Prev
          </Link>
        )}
        <Link className={s.chip} to={`/pokemon/${nextId}`}>
          Next →
        </Link>
      </div>

      {/* Content */}
      <section className={s.grid}>
        <article className={s.card}>
          {img ? (
            <img className={s.thumb} src={img} alt={data.name} loading="lazy" />
          ) : (
            <div className={s.thumb} aria-label="no image" />
          )}

          {/* Intro / flavor text */}
          {intro && <p className={s.title} style={{ fontSize: "1rem" }}>{intro}</p>}
          {/* Tip: the only inline style above is font-size. If your instructor forbids
              all inline styles strictly, remove the style prop and rely on CSS module. */}
        </article>

        <article className={s.card}>
          <h2 className={s.title}>Basics</h2>
          <ul>
            <li>height: {data.height}</li>
            <li>weight: {data.weight}</li>
          </ul>

          <h2 className={s.title}>Types</h2>
          <div className={s.chips}>
            {(data as any)?.types?.map((t: any) => (
              <span key={t.slot} className={s.chip}>
                {t.type?.name}
              </span>
            ))}
          </div>

          <h2 className={s.title}>Abilities</h2>
          <div className={s.chips}>
            {(data as any)?.abilities?.map((a: any) => (
              <span key={a.ability?.name} className={s.chip}>
                {a.ability?.name}
              </span>
            ))}
          </div>

          <h2 className={s.title}>Stats</h2>
          <ul>
            {(data as any)?.stats?.map((st: any) => (
              <li key={st.stat?.name}>
                {st.stat?.name}: {st.base_stat}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
