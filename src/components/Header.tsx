import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useStore } from '../store';


interface HeaderProps {
  onShowFavorites: () => void;
  onShowTrending: () => void;
}

function Header({ onShowFavorites, onShowTrending }: HeaderProps) {
  const favoritesCount = useStore((state) => state.favorites.length);

  return (
    <header className="py-6 mb-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">

        <h1
          className="text-3xl font-bold text-blue-700 cursor-pointer md:text-4xl dark:text-blue-400"
          onClick={onShowTrending}
        >
          Пошук GIF 🚀
        </h1>

        <nav className="flex items-center gap-4">

          <button
            onClick={onShowTrending}
            className="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            Головна
          </button>


          <button
            onClick={onShowFavorites}
            className="relative font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            Обране
            {favoritesCount > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full -top-2 -right-3">
                {favoritesCount}
              </span>
            )}
          </button>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export default Header;