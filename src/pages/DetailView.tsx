import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPokemonById } from "../api/pokeApi";
import type { Pokemon } from "../types";
import s from "../styles/layout.module.css";

const MIN_ID = 1;
const MAX_ID = 120;

function art(p?: Pokemon) {
  return (
    p?.sprites.other?.["official-artwork"]?.front_default ??
    p?.sprites.front_default ??
    ""
  );
}

export default function DetailView() {
  const { id } = useParams();
  const current = Number(id);
  const [data, setData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const d = await getPokemonById(current);
        setData(d);
      } catch {
        setErr("Failed to load details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [current]);

  const prevId = current <= MIN_ID ? MAX_ID : current - 1;
  const nextId = current >= MAX_ID ? MIN_ID : current + 1;

  return (
    <main className="page">
      <div className={s.navRow}>
        <Link className={s.btn} to="/">← Back to List</Link>
        <div style={{ flex: 1 }} />
        <button className={s.btn} onClick={() => navigate(`/pokemon/${prevId}`)}>← Prev</button>
        <button className={s.btn} onClick={() => navigate(`/pokemon/${nextId}`)}>Next →</button>
      </div>

      {err && <p role="alert">{err}</p>}
      {loading || !data ? (
        <p>Loading…</p>
      ) : (
        <section className={s.detail}>
          <img className={s.hero} src={art(data)} alt={data.name} />
          <div className={s.meta}>
            <h1 className={s.capitalize}>
              #{data.id} {data.name}
            </h1>

            <div className={s.kv}>
              <div>Base EXP</div><div>{data.base_experience}</div>
              <div>Height</div><div>{data.height}</div>
              <div>Weight</div><div>{data.weight}</div>
            </div>

            <div>
              <div style={{ marginBottom: 6 }}>Types</div>
              <div className={s.pills}>
                {data.types?.map((t) => (
                  <span key={t.type.name} className={s.pill}>{t.type.name}</span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ margin: "10px 0 6px" }}>Stats</div>
              <div className={s.kv}>
                {data.stats?.map((st) => (
                  <Fragment key={st.stat.name}>
                    <div className={s.capitalize}>{st.stat.name}</div>
                    <div>{st.base_stat}</div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

import { Fragment } from "react";
