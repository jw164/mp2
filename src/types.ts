export type PokemonListItem = {
  name: string;
  url: string;
};

export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience?: number | null;
  sprites: {
    front_default?: string | null;
    other?: {
      ["official-artwork"]?: {
        front_default?: string | null;
      };
    };
  };
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
};
