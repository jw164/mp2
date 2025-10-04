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
  types?: { slot: number; type: { name: string; url: string } }[];  // 新增
};
