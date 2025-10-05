import axios from "axios";
import type { Pokemon, PokemonListItem } from "../types";

export const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

// Simple localStorage cache to soften rate limits
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

export async function getManyPokemonDetails(
  ids: number[]
): Promise<Pokemon[]> {
  const results: Pokemon[] = [];
  // try cache first
  for (const id of ids) {
    const c = getCache<Pokemon>(`poke:${id}`);
    if (c) results.push(c);
  }
  const missing = ids.filter(
    (id) => !results.find((p) => p.id === id)
  );
  if (missing.length) {
    const fetched = await Promise.all(
      missing.map((id) => getPokemonById(id))
    );
    results.push(...fetched);
  }
  // keep order by id
  return results.sort((a, b) => a.id - b.id);
}
