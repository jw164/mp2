// src/pages/DetailView.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import s from "../styles/layout.module.css";
import type { Pokemon } from "../types";
import { api, getPokemonById } from "../api/pokeApi";

const MIN_ID = 1;
const MAX_ID = 151;

function padId(n: number) {
  return `#${String(n).padStart(3, "0")}`;
}
function artworkUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
function pickImage(p?: Pokemon | null): string {
  if (!p) return "";
  const oa = (p as any)?.sprites?.other?.["official-artwork"]?.front_default;
  const fd = (p as any)?.sprites?.front_default;
  return oa || fd || "";
}

export default function DetailView() {
  const { id } = useParams();
  const pid = useMemo(() => {
    const n = Number(id);
    return Number.isFinite(n) ? n : MIN_ID;
  }, [id]);

  const navigate = useNavigate();

  const [data, setData] = useState<Pokemon | null>(null);
  const [intro, setIntro] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    setData(null);
    setIntro("");

    try {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    } catch {}

    (async () => {
      try {
        const p = await getPokemonById(pid);
        if (!alive) return;
        setData(p);

        // 物种介绍（英文优先）
        try {
          const { data: sp } = await api.get(`/pokemon-species/${pid}`);
          const entry = (sp?.flavor_text_entries as Array<any>)?.find(
            (e) => e?.language?.name === "en"
          );
          const text = (entry?.flavor_text || "")
            .replace(/\n|\f/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          if (alive) setIntro(text);
        } catch {}
      } catch {
        if (alive) setError("Failed to load data.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [pid]);

  const prevId = pid > MIN_ID ? pid - 1 : null;
  const nextId = pid < MAX_ID ? pid + 1 : null;

  const goPrev = useCallback(() => {
    if (prevId) navigate(`/pokemon/${prevId}`);
  }, [navigate, prevId]);
  const goNext = useCallback(() => {
    if (nextId) navigate(`/pokemon/${nextId}`);
  }, [navigate, nextId]);

  // 键盘 ← / → 导航
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prevId) {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight" && nextId) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, prevId, nextId]);

  if (loading) {
    return (
      <main className={s.container}>
        <div className={s.card} aria-busy="true" style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: 16,
              background:
                "linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%)",
              backgroundSize: "400% 100%",
              animation: "shimmer 1.2s infinite",
            }}
          />
          <div style={{ height: 18, width: 180, marginTop: 10, background: "#eee", borderRadius: 6 }} />
          <div style={{ height: 12, width: 240, marginTop: 6, background: "#f0f0f0", borderRadius: 6 }} />
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className={s.container}>
        <h1 className={s.title}>Not Found</h1>
        <p>
          {error || "This Pokémon does not exist in the current range."}{" "}
          <Link to="/">Back to list</Link>
        </p>
      </main>
    );
  }

  const img = pickImage(data) || artworkUrl(data.id);
  const types = (data as any)?.types?.map((t: any) => t.type?.name) ?? [];
  const abilities =
    (data as any)?.abilities?.map((a: any) => a.ability?.name) ?? [];
  const stats = (data as any)?.stats ?? [];

  return (
    <main className={s.container}>
      {/* 顶部：返回 + 前后按钮 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link to="/" className={s.card} style={{ padding: ".5rem .75rem" }}>
            ← Back to List
          </Link>
          <Link to="/gallery" className={s.card} style={{ padding: ".5rem .75rem" }}>
            Gallery
          </Link>
        </div>
        <div>
          <button
            onClick={goPrev}
            disabled={!prevId}
            style={{
              marginRight: 8,
              padding: ".5rem .75rem",
              cursor: prevId ? "pointer" : "not-allowed",
            }}
            aria-disabled={!prevId}
            aria-label="Previous Pokémon"
          >
            ◀ PREVIOUS
          </button>
          <button
            onClick={goNext}
            disabled={!nextId}
            style={{
              padding: ".5rem .75rem",
              cursor: nextId ? "pointer" : "not-allowed",
            }}
            aria-disabled={!nextId}
            aria-label="Next Pokémon"
          >
            NEXT ▶
          </button>
        </div>
      </div>

      <h1 className={s.title} style={{ textTransform: "capitalize" }}>
        {padId(data.id)} {data.name}
      </h1>

      <section className={s.grid} style={{ alignItems: "start" }}>
        {/* 左列：大图 + 简介 */}
        <article className={s.card} style={{ alignItems: "center" }}>
          <img
            src={img}
            alt={data.name}
            loading="lazy"
            width={300}
            height={300}
            style={{ objectFit: "contain" }}
          />
          {intro && <p style={{ marginTop: 8, lineHeight: 1.5 }}>{intro}</p>}
          <p style={{ marginTop: 8, color: "#666", fontSize: 12 }}>
            Tip: Use ← / → keys to navigate.
          </p>
        </article>

        {/* 右列：详细信息 */}
        <article className={s.card}>
          <h2 className={s.title}>Basics</h2>
          <ul>
            <li>Height: {data.height ?? "—"}</li>
            <li>Weight: {data.weight ?? "—"}</li>
            <li>Base Experience: {data.base_experience ?? "—"}</li>
          </ul>

          <h2 className={s.title}>Types</h2>
          {/* 居中排列徽章 */}
          <div className={s.pillsRow}>
            {types.length
              ? types.map((t: string) => (
                  <Link
                    key={t}
                    to={`/?type=${encodeURIComponent(t)}`} // 点击回到列表并按类型过滤
                    className={s.pill}
                    style={{ textTransform: "capitalize" }}
                    aria-label={`Filter list by type ${t}`}
                  >
                    {t}
                  </Link>
                ))
              : "—"}
          </div>

          <h2 className={s.title}>Abilities</h2>
          {/* 居中排列徽章 */}
          <div className={s.pillsRow}>
            {abilities.length
              ? abilities.map((a: string) => (
                  <span
                    key={a}
                    className={s.pill}
                    style={{ textTransform: "capitalize" }}
                  >
                    {a}
                  </span>
                ))
              : "—"}
          </div>

          <h2 className={s.title}>Stats</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {stats.map((st: any) => {
              const label = st.stat?.name;
              const val = Number(st.base_stat) || 0;
              const w = Math.min(100, val);
              return (
                <li key={label} style={{ margin: "6px 0" }}>
                  <div
                    style={{
                      fontSize: 12,
                      textTransform: "capitalize",
                      marginBottom: 4,
                    }}
                  >
                    {label}: {val}
                  </div>
                  <div style={{ height: 8, background: "#eee", borderRadius: 999 }}>
                    <div
                      style={{
                        width: `${w}%`,
                        height: "100%",
                        background: "#bbb",
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </article>
      </section>
    </main>
  );
}


