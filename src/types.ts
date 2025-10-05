export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default?: string;
    other?: {
      ["official-artwork"]?: {
        front_default?: string | null;
      };
      dream_world?: {
        front_default?: string | null;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}
