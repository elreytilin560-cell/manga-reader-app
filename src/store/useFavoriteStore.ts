import { create } from 'zustand';
import { Manga } from '../types/manga';

interface FavoriteState {
  favorites: Manga[];
  history: Record<string, { chapterId: string; chapterNumber: string }>;
  addFavorite: (manga: Manga) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  saveReadingProgress: (mangaId: string, chapterId: string, chapterNumber: string) => void;
  clearAllData: () => void;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],
  history: {},
  addFavorite: (manga) =>
    set((state) => {
      if (!state.favorites.find((m) => m.id === manga.id)) {
        return { favorites: [...state.favorites, manga] };
      }
      return state;
    }),
  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((m) => m.id !== id),
    })),
  isFavorite: (id) => !!get().favorites.find((m) => m.id === id),
  saveReadingProgress: (mangaId, chapterId, chapterNumber) =>
    set((state) => ({
      history: {
        ...state.history,
        [mangaId]: { chapterId, chapterNumber },
      },
    })),
  clearAllData: () => set({ favorites: [], history: {} }),
}));
