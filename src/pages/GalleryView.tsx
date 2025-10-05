import { useEffect, useState } from "react";
import { getManyPokemonDetails } from "../api/pokeApi";
import usePokemonData from "../hooks/usePokemonData";
import s from "../styles/layout.module.css";

export default function GalleryView() {
  const { items, loading } = usePokemonData();
  const [thumbs, setThumbs] = useState<
    { id: number; name: string; img: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      if (!items.length) return;
      const ids = items.slice(0, 60).map((i) => i.id);
      const detail = await getManyPokemonDetails(ids);
      const pics = detail.map((p) => ({
        id: p.id,
        name: p.name,
        img:
          (p.sprites as any)?.other?.["official-artwork"]?.front_default ||
          p.sprites.front_default ||
          "",
      }));
      setThumbs(pics);
    })();
  }, [items]);

  if (loading) return <main className="page"><p>Loading…</p></main>;

  return (
    <main className="page">
      <h1>Gallery</h1>
      <div className={s.grid}>
        {thumbs.map((t) => (
          <a key={t.id} href={`#/pokemon/${t.id}`} className={s.card}>
            <img src={t.img} alt={t.name} className={s.thumb} />
            <div className={s.title}>#{t.id} {t.name}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
