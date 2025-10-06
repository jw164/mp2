// src/pages/GalleryView.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import s from "../styles/layout.module.css";
import { getPokemonList } from "../api/pokeApi";
import type { PokemonListItem } from "../types";

/** 提取 PokeAPI 列表项中的 id */
function getIdFromUrl(url: string) {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

/** 官方 artwork CDN */
function artworkUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export default function GalleryView() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Array<PokemonListItem & { id: number }>>(
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await getPokemonList(151, 0);
        const withId = list.map((it) => ({ ...it, id: getIdFromUrl(it.url) }));
        if (!cancelled) setItems(withId);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 画廊保持按 ID 升序
  const gallery = useMemo(
    () => [...items].sort((a, b) => a.id - b.id),
    [items]
  );

  return (
    <main className={s.container}>
      <h1>Pokémon Gallery</h1>

      {loading && (
        <section className={s.grid} aria-busy="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className={s.card} aria-hidden>
              <div
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 12,
                  background:
                    "linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%)",
                  backgroundSize: "400% 100%",
                  animation: "shimmer 1.2s infinite",
                }}
              />
              <div
                style={{
                  height: 14,
                  width: 120,
                  marginTop: 10,
                  background: "#eee",
                  borderRadius: 6,
                }}
              />
            </div>
          ))}
        </section>
      )}

      {!loading && gallery.length === 0 && (
        <p style={{ marginTop: 12, opacity: 0.8 }}>
          Nothing to show right now.
        </p>
      )}

      {!loading && gallery.length > 0 && (
        <section className={s.grid}>
          {gallery.map((it) => (
            <Link
              key={it.id}
              to={`/pokemon/${it.id}`}
              className={s.card}
              aria-label={`Open details for ${it.name}`}
            >
              <img
                className={s.thumb}
                src={artworkUrl(it.id)}
                alt={it.name}
                loading="lazy"
                width={200}
                height={200}
                style={{ objectFit: "contain" }}
              />
              <div className={s.title} style={{ textTransform: "capitalize" }}>
                {it.name}
              </div>
              <div className={s.id}>#{it.id}</div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
