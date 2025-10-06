// src/pages/DetailView.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import s from "../styles/layout.module.css";
import type { Pokemon } from "../types";
import { api, getPokemonById } from "../api/pokeApi";

/** ====== 可按需要调整展示的 ID 范围 ====== */
const MIN_ID = 1;
const MAX_ID = 151;

/** ====== 小工具 ====== */
function padId(n: number) {
  return `#${String(n).padStart(3, "0")}`;
}
function artworkUrl(id: number) {
  // 官方 artwork
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
function pickImage(p?: Pokemon | null): string {
  if (!p) return "";
  // 优先 official-artwork，再退到 front_default
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

  // 取详情 & 物种简介（英文）
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    setData(null);
    setIntro("");

    // 滚回顶部（避免从下一个详情返回时在页面中部）
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

    (async () => {
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
          /* 忽略简介失败，不影响主体 */
        }
      } catch (e) {
        if (alive) setError("Failed to load data.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [pid]);

  /** 上/下一只的 id 与可用性 */
  const prevId = pid > MIN_ID ? pid - 1 : null;
  const nextId = pid < MAX_ID ? pid + 1 : null;

  /** 点击与键盘导航 */
  const goPrev = useCallback(() => {
    if (prevId) navigate(`/pokemon/${prevId}`);
  }, [navigate, prevId]);

  const goNext = useCallback(() => {
    if (nextId) navigate(`/pokemon/${nextId}`);
  }, [navigate, nextId]);

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

  /** ====== 渲染 ====== */

  // Skeleton
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

  // 错误兜底
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

  const img = pickImage(data);
  const types = (data as any)?.types?.map((t: any) => t.type?.name) ?? [];
  const abilities =
    (data as any)?.abilities?.map((a: any) => a.ability?.name) ?? [];
  const stats = (data as any)?.stats ?? [];

  return (
    <main className={s.container}>
      {/* 顶部导航条 */}
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

      {/* 标题 */}
      <h1 className={s.title} style={{ textTransform: "capitalize" }}>
        {padId(data.id)} {data.name}
      </h1>

      {/* 主内容 */}
      <section className={s.grid} style={{ alignItems: "start" }}>
        {/* 左：图片 + 简介 */}
        <article className={s.card} style={{ alignItems: "center" }}>
          <img
            src={img || artworkUrl(data.id)}
            alt={data.name}
            loading="lazy"
            width={300}
            height={300}
            style={{ objectFit: "contain" }}
          />
          {intro && (
            <p style={{ marginTop: 8, lineHeight: 1.5 }}>{intro}</p>
          )}
        </article>

        {/* 右：细节 */}
        <article className={s.card}>
          <h2 className={s.title}>Basics</h2>
          <ul>
            <li>Height: {data.height ?? "—"}</li>
            <li>Weight: {data.weight ?? "—"}</li>
            <li>Base Experience: {data.base_experience ?? "—"}</li>
          </ul>

          <h2 className={s.title}>Types</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {types.length
              ? types.map((t: string) => (
                  <span
                    key={t}
                    style={{
                      padding: "4px 10px",
                      border: "1px solid #ddd",
                      borderRadius: 999,
                      textTransform: "capitalize",
                    }}
                  >
                    {t}
                  </span>
                ))
              : "—"}
          </div>

          <h2 className={s.title}>Abilities</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {abilities.length
              ? abilities.map((a: string) => (
                  <span
                    key={a}
                    style={{
                      padding: "4px 10px",
                      border: "1px solid #ddd",
                      borderRadius: 999,
                      textTransform: "capitalize",
                    }}
                  >
                    {a}
                  </span>
                ))
              : "—"}
          </div>

          <h2 className={s.title}>Stats</h2>
          <ul>
            {stats.map((st: any) => (
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

