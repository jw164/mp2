export type PokemonListItem = {
  name: string;
  url: string; // e.g. https://pokeapi.co/api/v2/pokemon/1/
};

export type Pokemon = {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: {
      ["official-artwork"]?: { front_default?: string | null };
    };
  };
};
