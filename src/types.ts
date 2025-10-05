export interface PokemonListItem {
  name: string;
  url: string;
  id?: number;
}

export interface PokemonTypeEntry {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStatEntry {
  base_stat: number;
  effort?: number;
  stat: {
    name: string; // hp, attack, defense, etc.
    url?: string;
  };
}

export interface PokemonSprites {
  front_default?: string | null;
  other?: {
    ["official-artwork"]?: {
      front_default?: string | null;
    };
    dream_world?: {
      front_default?: string | null;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;


  height: number;           // decimetres
  weight: number;           // hectograms
  base_experience: number;

  sprites: PokemonSprites;
  types: PokemonTypeEntry[];
  stats: PokemonStatEntry[];
}
