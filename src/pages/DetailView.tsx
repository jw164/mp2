import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Pokemon } from "../types";
import { getPokemonById } from "../api/pokeApi";
import s from "../styles/layout.module.css";

const MIN_ID = 1;
const MAX_ID = 1010; // PokeAPI 常见上限，够用即可

function artOf(p: Pokemon) {
  return (
    p.sprites.other?.["official-artwork"]?.front_default ||
    p.sprites.other?.dream_world?.front_default ||
    p.sprites.front_default ||
    ""
  );
}

export default function DetailView() {
  const { id: idParam } = useParams();
  const id = useMemo(() => Number(idParam ?? 0), [idParam]);
  const nav = useNavigate();

  const [data, setData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // 读取详情
  useEffect(() => {
    let on = true;
    setLoading(true);
    setErr(null);
    setData(null);

    if (!id || Number.isNaN(id)) {
      setErr("Invalid id");
      setLoading(false);
      return;
    }
    getPokemonById(id)
      .then((p) => {
        if (on) setData(p);
      })
      .catch((e) => {
        if (on) setErr(String(e));
      })
      .finally(() => {
        if (on) setLoading(false);
      });

    return () => {
      on = false;
    };
  }, [id]);

  // Prev / Next id（边界保护）
  const prevId = Math.max(MIN_ID, id - 1);
  const nextId = Math.min(MAX_ID, id + 1);

  // 键盘左右箭头也可切换
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && id > MIN_ID) nav(`/pokemon/${prevId}`);
      if (e.key === "ArrowRight" && id < MAX_ID) nav(`/pokemon/${nextId}`);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [id, prevId, nextId, nav]);

  if (loading) {
    return (
      <main className={s.container}>
        <p>Loading…</p>
      </main>
    );
  }

  if (err || !data) {
    return (
      <main className={s.container}>
        <p>Failed to load. {err}</p>
        <Link to="/">⟵ Back to list</Link>
      </main>
    );
  }

  const img = artOf(data);
  const name = data.name;

  return (
    <main className={`${s.container} ${s.detail}`}>
      {/* 顶部导航与翻页 */}
      <div className={s.pager}>
        <Link className={s.btn} to="/">
          ⟵ Back
        </Link>

        <div className={s.pagerControls}>
          <button
            type="button"
            className={s.btn}
            onClick={() => nav(`/pokemon/${prevId}`)}
            disabled={id <= MIN_ID}
            aria-label="Previous Pokémon"
            title="Previous (←)"
          >
            ← Prev
          </button>
          <span className={s.pagerId}>#{id}</span>
          <button
            type="button"
            className={s.btn}
            onClick={() => nav(`/pokemon/${nextId}`)}
            disabled={id >= MAX_ID}
            aria-label="Next Pokémon"
            title="Next (→)"
          >
            Next →
          </button>
        </div>

        <Link className={s.btn} to="/gallery">
          Gallery
        </Link>
      </div>

      {/* 视觉主区域 */}
      <section className={s.hero}>
        {img && <img className={s.heroImg} src={img} alt={name} />}
        <div className={s.meta}>
          <h1 className={s.title}>
            #{data.id} {name}
          </h1>

          {/* 类型 */}
          <div className={s.chips} aria-label="Types">
            {data.types.map((t) => (
              <span key={t.slot} className={s.chip}>
                {t.type.name}
              </span>
            ))}
          </div>

          {/* 身高体重等 */}
          <ul className={s.kv}>
            <li>
              <strong>Height:</strong> {data.height}
            </li>
            <li>
              <strong>Weight:</strong> {data.weight}
            </li>
            <li>
              <strong>Base Exp:</strong> {data.base_experience}
            </li>
          </ul>
        </div>
      </section>

      {/* 能力值 */}
      <section className={s.stats}>
        <h2 className={s.h2}>Base Stats</h2>
        <div className={s.statsGrid}>
          {data.stats.map((st) => (
            <div key={st.stat.name} className={s.statRow}>
              <span className={s.statName}>{st.stat.name}</span>
              <div className={s.barWrap} aria-label={st.stat.name}>
                <div
                  className={s.bar}
                  style={{ width: `${Math.min(100, st.base_stat)}%` }}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={st.base_stat}
                />
              </div>
              <span className={s.statVal}>{st.base_stat}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
