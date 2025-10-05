// src/types.ts

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: {
    slot: number;
    type: { name: string; url: string };
  }[];
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
  sprites: {
    front_default?: string | null;
    other?: {
      ["official-artwork"]?: {
        front_default?: string | null;
      };
    };
  };
}
