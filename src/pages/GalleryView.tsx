// src/pages/GalleryView.tsx
import React, { useEffect, useState } from "react";
import { getPokemonList, getManyPokemonDetails } from "../api/pokeApi";
import type { Pokemon, PokemonListItem } from "../types";
import "../styles/layout.module.css";

const GalleryView: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const list: PokemonListItem[] = await getPokemonList(60, 0);
        const ids = list.map((_, idx) => idx + 1);
        const details = await getManyPokemonDetails(ids);
        setPokemons(details);
      } catch (err) {
        console.error("Error fetching Pokémon:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getImage = (p: Pokemon) => {
    return (
      p.sprites.other?.["official-artwork"]?.front_default ||
      p.sprites.front_default ||
      ""
    );
  };

  if (loading) return <div style={{ textAlign: "center" }}>Loading...</div>;

  return (
    <div style={styles.container}>
      {pokemons.map((p) => (
        <div key={p.id} style={styles.card}>
          <img
            src={getImage(p)}
            alt={p.name}
            style={styles.image}
            loading="lazy"
          />
          <h3 style={styles.title}>
            #{p.id} {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
          </h3>
          <div style={styles.types}>
            {p.types.map((t) => (
              <span key={t.slot} style={styles.typeBadge}>
                {t.type.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1.5rem",
    padding: "2rem",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    padding: "1rem",
    textAlign: "center",
    transition: "transform 0.2s ease-in-out",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
  },
  title: {
    fontSize: "1rem",
    fontWeight: 600,
    textTransform: "capitalize",
    marginTop: "0.5rem",
  },
  types: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "0.5rem",
  },
  typeBadge: {
    background: "#f0f0f0",
    borderRadius: "8px",
    padding: "0.2rem 0.6rem",
    fontSize: "0.8rem",
    textTransform: "capitalize",
  },
};

export default GalleryView;
