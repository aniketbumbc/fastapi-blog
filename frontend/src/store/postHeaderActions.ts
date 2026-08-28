import { create } from 'zustand';

type PostHeaderActions = {
  slug: string | null;
  owner: boolean;
  onDelete: (() => void) | null;
  setPostHeaderActions: (actions: { slug: string; owner: boolean; onDelete: () => void }) => void;
  clearPostHeaderActions: () => void;
};

export const usePostHeaderActions = create<PostHeaderActions>((set) => ({
  slug: null,
  owner: false,
  onDelete: null,
  setPostHeaderActions: ({ slug, owner, onDelete }) => set({ slug, owner, onDelete }),
  clearPostHeaderActions: () => set({ slug: null, owner: false, onDelete: null }),
}));
