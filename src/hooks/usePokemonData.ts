import { useEffect, useMemo, useState } from "react";
import { getPokemonList } from "../api/pokeApi";
import type { PokemonListItem } from "../types";

export function idFromUrl(url: string) {
  const m = url.match(/\/pokemon\/(\d+)\/*$/);
  return m ? Number(m[1]) : NaN;
}

export type SortKey = "name" | "id";
export type SortDir = "asc" | "desc";

export default function usePokemonData() {
  const [raw, setRaw] = useState<PokemonListItem[]>([]);
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const list = await getPokemonList(151, 0);
      setRaw(list);
      setLoading(false);
    })();
  }, []);

  const filteredSorted = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const arr = raw
      .filter((it) => {
        if (!kw) return true;
        const id = idFromUrl(it.url);
        return it.name.toLowerCase().includes(kw) || String(id).includes(kw);
      })
      .map((it) => ({
        ...it,
        id: idFromUrl(it.url),
      }));

    arr.sort((a, b) => {
      let v = 0;
      if (sortKey === "name") v = a.name.localeCompare(b.name);
      else v = a.id - b.id;
      return sortDir === "asc" ? v : -v;
    });

    return arr;
  }, [raw, q, sortKey, sortDir]);

  return {
    loading,
    items: filteredSorted,
    q,
    setQ,
    sortKey,
    setSortKey,
    sortDir,
    setSortDir,
  };
}
