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

  useEffect(() => {
    let alive = true;
    async function run() {
      setLoading(true);
      try {
        const p = await getPokemonById(pid);
        if (!alive) return;
        setData(p);

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
          /* ignore */
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
  const nextId = pid + 1;

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
          The requested Pokémon does not exist. <Link to="/">Back to list</Link>
        </p>
      </main>
    );
  }

  return (
    <main className={s.container}>
      <h1 className={s.detailHeading}>
        {formatId(data.id)} {data.name.charAt(0).toUpperCase() + data.name.slice(1)}
      </h1>

      <div className={s.detailControls}>
        <Link className={s.chip} to="/">
          ← Back to List
        </Link>
        {prevId && (
          <Link className={s.chip} to={`/pokemon/${prevId}`} aria-label="Previous">
            ← Prev
          </Link>
        )}
        <Link className={s.chip} to={`/pokemon/${nextId}`} aria-label="Next">
          Next →
        </Link>
      </div>

      <section className={s.detailGrid}>
        <article className={s.card}>
          {img ? (
            <img className={s.hero} src={img} alt={data.name} loading="lazy" />
          ) : (
            <div className={s.hero} aria-label="no image" />
          )}

          {intro && <p className={`${s.intro} ${s.mt8}`}>{intro}</p>}
          <p className={s.tip}>Tip: Use ← / → keys to navigate.</p>
        </article>

        <article className={s.card}>
          <h2 className={s.title}>Basics</h2>
          <ul>
            <li>Height: {data.height}</li>
            <li>Weight: {data.weight}</li>
            <li>Base Experience: {(data as any)?.base_experience}</li>
          </ul>

          <h2 className={s.title}>Types</h2>
          <div className={`${s.chips} ${s.center}`}>
            {(data as any)?.types?.map((t: any) => (
              <Link
                key={t.slot}
                to={`/?type=${t.type?.name}`}
                className={s.chip}
                aria-label={`Filter by type ${t.type?.name}`}
              >
                {t.type?.name}
              </Link>
            ))}
          </div>

          <h2 className={s.title}>Abilities</h2>
          <div className={`${s.chips} ${s.center}`}>
            {(data as any)?.abilities?.map((a: any) => (
              <span key={a.ability?.name} className={s.chip}>
                {a.ability?.name}
              </span>
            ))}
          </div>

          <h2 className={s.title}>Stats</h2>
          <ul className={s.stats}>
            {(data as any)?.stats?.map((st: any) => (
              <li key={st.stat?.name}>
                <span>{st.stat?.name}</span>
                <progress max={200} value={st.base_stat} />
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}




