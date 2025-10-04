import axios from "axios";
import type { Pokemon, PokemonListItem } from "../types";

const api = axios.create({ baseURL: "https://pokeapi.co/api/v2" });

export async function getPokemonList(limit = 50, offset = 0): Promise<PokemonListItem[]> {
  const { data } = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return data.results as PokemonListItem[];
}

export async function getPokemonById(id: number): Promise<Pokemon> {
  const { data } = await api.get(`/pokemon/${id}`);
  return data as Pokemon;
}
