import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPokemonById } from "../api/pokeApi";
import type { Pokemon } from "../types";
import s from "../styles/layout.module.css";

function artOf(p: Pokemon) {
  const other = (p.sprites as any)?.other ?? {};
  return (
    other["official-artwork"]?.front_default ||
    other["dream_world"]?.front_default ||
    p.sprites.front_default ||
    ""
  );
}

export default function DetailView() {
  const { id } = useParams();
  const pid = Number(id);
  const nav = useNavigate();

  const [data, setData] = useState<Pokemon | null>(null);

  useEffect(() => {
    (async () => {
      if (!pid) return;
      const d = await getPokemonById(pid);
      setData(d);
    })();
  }, [pid]);

  const img = useMemo(() => (data ? artOf(data) : ""), [data]);

  if (!pid) return <main className="page"><p>Invalid id.</p></main>;
  if (!data) return <main className="page"><p>Loading…</p></main>;

  const prev = pid > 1 ? pid - 1 : 1;
  const next = pid + 1;

  return (
    <main className="page">
      <h1>#{data.id} {data.name}</h1>

      <div className={s.hero}>
        {img && <img src={img} alt={data.name} className={s.heroImg} />}
        <ul className={s.chips}>
          {data.types.map((t) => (
            <li key={t.slot} className={s.chip}>{t.type.name}</li>
          ))}
        </ul>
      </div>

      <section className={s.stats}>
        <h3>Stats</h3>
        <ul>
          {data.stats.map((st) => (
            <li key={st.stat.name}>{st.stat.name}: {st.base_stat}</li>
          ))}
          <li>height: {data.height}</li>
          <li>weight: {data.weight}</li>
          {data.base_experience != null && (
            <li>base_experience: {data.base_experience}</li>
          )}
        </ul>
      </section>

      <div className={s.controls}>
        <button onClick={() => nav(`/pokemon/${prev}`)}>◀ Prev</button>
        <Link to="/">Back to List</Link>
        <button onClick={() => nav(`/pokemon/${next}`)}>Next ▶</button>
      </div>
    </main>
  );
}
