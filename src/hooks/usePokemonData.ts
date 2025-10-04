import { useEffect, useState } from "react";
import { getPokemonList, getPokemonById } from "../api/pokeApi";
import type { Pokemon } from "../types";

export function usePokemonData(count = 60) {
  const [list, setList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const basic = await getPokemonList(count, 0);
        const ids = basic.map(b => Number(b.url.split("/").filter(Boolean).pop()));
        const details = await Promise.all(ids.map(async id => {
          try { return await getPokemonById(id); } catch { return null; }
        }));
        setList(details.filter(Boolean) as Pokemon[]);
      } catch {
        setErr("Failed to load gallery data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [count]);

  return { list, loading, err };
}
