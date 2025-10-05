import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import s from "../styles/layout.module.css";
import type { Pokemon } from "../types";
import { getPokemonById } from "../api/pokeApi";

function usePokemon(id: number) {
  const [data, setData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    getPokemonById(id)
      .then((p) => {
        if (alive) setData(p);
      })
      .catch((e) => {
        if (alive) setError(e?.message ?? "Failed to fetch");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  return { data, loading, error };
}

function spriteUrl(p?: Pokemon | null): string {
  if (!p) return "";
  return (
    p.sprites.other?.["official-artwork"]?.front_default ||
    p.sprites.front_default ||
    ""
  );
}

export default function DetailView() {
  const { id } = useParams<{ id: string }>();
  const currentId = Number(id || 1);
  const navigate = useNavigate();

  const { data, loading, error } = usePokemon(currentId);

  const title = useMemo(() => {
    if (!data) return "";
    const name = data.name[0].toUpperCase() + data.name.slice(1);
    return `#${data.id} ${name}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id, data?.name]);

  if (loading) {
    return (
      <main className={s.container}>
        <h1 className={s.title}>Loading…</h1>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className={s.container}>
        <h1 className={s.title}>Not available</h1>
        <p>{error ?? "No data"}</p>
        <Link to="/" className={s.card}>
          Go back
        </Link>
      </main>
    );
  }

  const art = spriteUrl(data);

  return (
    <main className={s.container}>
      <h1 className={s.title}>{title}</h1>

      <div className={s.grid}>
        {/* left: image */}
        <article className={s.card}>
          {art ? (
            <img className={s.thumb} src={art} alt={data.name} />
          ) : (
            <div className={s.thumb} aria-label="no image" />
          )}
        </article>

        {/* right: facts */}
        <article className={s.card}>
          <h2 className={s.title} style={{ margin: 0 }}>Overview</h2>
          <ul>
            <li>height: {data.height}</li>
            <li>weight: {data.weight}</li>
            {"base_experience" in data && (data as any).base_experience != null && (
              <li>base_experience: {(data as any).base_experience}</li>
            )}
          </ul>

          <div className={s.chips}>
            {data.types.map((t) => (
              <span key={t.type.name} className={s.chip}>
                {t.type.name}
              </span>
            ))}
          </div>

          <h3 className={s.title} style={{ marginTop: "1rem" }}>Stats</h3>
          <ul>
            {data.stats.map((st) => (
              <li key={st.stat.name}>
                {st.stat.name}: {st.base_stat}
              </li>
            ))}
          </ul>

          <div className={s.nav}>
            <button
              className={s.chip}
              disabled={currentId <= 1}
              onClick={() => navigate(`/pokemon/${currentId - 1}`)}
            >
              Prev
            </button>
            <button
              className={s.chip}
              onClick={() => navigate(`/pokemon/${currentId + 1}`)}
            >
              Next
            </button>
            <Link to="/" className={s.chip}>
              Back to List
            </Link>
            <Link to="/gallery" className={s.chip}>
              Gallery
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
