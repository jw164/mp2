// src/pages/GalleryView.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/layout.module.css";
import type { Pokemon } from "../types";
import { getManyPokemonDetails } from "../api/pokeApi";

const FIRST_COUNT = 60; // 画廊展示数量

const GalleryView: React.FC = () => {
  const [items, setItems] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr(null);

        // 获取前 60 个宝可梦详情（1..60）
        const ids = Array.from({ length: FIRST_COUNT }, (_, i) => i + 1);
        const list = await getManyPokemonDetails(ids);
        setItems(list);
      } catch (e) {
        console.error(e);
        setErr("Failed to load Pokémon gallery.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <div className={styles.container}>Loading…</div>;
  if (err) return <div className={styles.container}>{err}</div>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Pokémon Gallery</h1>

      <div className={styles.grid}>
        {items.map((p) => {
          // 尽量优先使用高清图，其次退回到 front_default
          const anySprites = p.sprites as any;
          const imgSrc =
            anySprites?.other?.["official-artwork"]?.front_default ||
            p.sprites?.front_default ||
            anySprites?.other?.dream_world?.front_default ||
            "";

        return (
          <Link
            to={`/pokemon/${p.id}`}
            key={p.id}
            className={styles.card}
            aria-label={`View ${p.name}`}
          >
            {imgSrc ? (
              <img className={styles.thumb} src={imgSrc} alt={p.name} />
            ) : (
              <div className={styles.thumb} />
            )}
            <div className={styles.title}>
              #{p.id} {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </div>
          </Link>
        );
        })}
      </div>
    </main>
  );
};

export default GalleryView;
