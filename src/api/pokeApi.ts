import axios from "axios";
import type { Pokemon, PokemonListItem } from "../types";

export const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

const TTL = 1000 * 60 * 30; 

function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    if (Date.now() - t > TTL) return null;
    return v as T;
  } catch {
    return null;
  }
}
function setCache<T>(key: string, v: T) {
  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), v }));
  } catch {}
}

export async function getPokemonList(
  limit = 120,
  offset = 0
): Promise<PokemonListItem[]> {
  const key = `list:${limit}:${offset}`;
  const cached = getCache<PokemonListItem[]>(key);
  if (cached) return cached;

  const { data } = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
  setCache(key, data.results);
  return data.results;
}

export async function getPokemonById(id: number): Promise<Pokemon> {
  const key = `poke:${id}`;
  const cached = getCache<Pokemon>(key);
  if (cached) return cached;

  const { data } = await api.get(`/pokemon/${id}`);
  setCache(key, data);
  return data;
}

export async function getPokemonIdsByType(type: string): Promise<number[]> {
  const key = `type:${type.toLowerCase()}`;
  const cached = getCache<number[]>(key);
  if (cached) return cached;

  const { data } = await api.get(`/type/${type.toLowerCase()}`);
  const ids: number[] = (data?.pokemon as any[])
    .map((p) => {
      const m = String(p?.pokemon?.url || "").match(/\/pokemon\/(\d+)\/?$/);
      return m ? Number(m[1]) : NaN;
    })
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);

  setCache(key, ids);
  return ids;
}

