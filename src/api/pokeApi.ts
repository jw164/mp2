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

export async function getManyPokemonDetails(ids: number[]): Promise<Pokemon[]> {
  const results: Pokemon[] = [];
  for (const id of ids) {
    const c = getCache<Pokemon>(`poke:${id}`);
    if (c) results.push(c);
  }
  const missing = ids.filter((id) => !results.find((p) => p.id === id));
  if (missing.length) {
    const fetched = await Promise.all(missing.map((id) => getPokemonById(id)));
    results.push(...fetched);
  }
  return results.sort((a, b) => a.id - b.id);
}
// ---- utils: 从 URL 抽取 id（例如 https://pokeapi.co/api/v2/pokemon/65/ -> 65）
function _idFromUrl(url: string | undefined | null): number | null {
  if (!url) return null;
  const m = url.match(/\/pokemon\/(\d+)\//i);
  return m ? Number(m[1]) : null;
}

/** 根据 type 名称拿到该类型下的所有宝可梦 id（含缓存，单请求，超快） */
export async function getPokemonIdsByType(typeName: string): Promise<number[]> {
  const key = `type:${typeName.toLowerCase()}`;
  const cached = getCache<number[]>(key);
  if (cached) return cached;

  const { data } = await api.get(`/type/${typeName.toLowerCase()}`);
  const ids =
    (data?.pokemon as Array<{ pokemon: { url: string } }> | undefined)?.map((x) =>
      _idFromUrl(x?.pokemon?.url)
    ) || [];

  const ok = ids.filter((n): n is number => Number.isFinite(n));
  setCache(key, ok);
  return ok;
}
