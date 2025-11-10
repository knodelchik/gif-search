import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import { type Gif } from './types';


interface AppState {
    theme: 'light' | 'dark';
    favorites: Gif[];
    toggleTheme: () => void;
    addFavorite: (gif: Gif) => void;
    removeFavorite: (gifId: string) => void;
    isFavorite: (gifId: string) => boolean;
}


export const useStore = create<AppState>()(
    persist(
        (set, get) => ({

            theme: 'light',
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === 'light' ? 'dark' : 'light',
                })),


            favorites: [],
            addFavorite: (gif) =>
                set((state) => ({
                    favorites: [...state.favorites, gif],
                })),
            removeFavorite: (gifId) =>
                set((state) => ({
                    favorites: state.favorites.filter((fav) => fav.id !== gifId),
                })),
            isFavorite: (gifId) => {
                const { favorites } = get();
                return favorites.some((fav) => fav.id === gifId);
            },
        }),
        {
            name: 'giphy-app-storage',
        }
    )
);