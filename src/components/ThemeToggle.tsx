
import { useStore } from '../store';
import { FaSun, FaMoon } from 'react-icons/fa';

function ThemeToggle() {
  const { theme, toggleTheme } = useStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-xl cursor-pointer text-gray-600 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-yellow-400"
      aria-label="Перемкнути тему"
    >
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </button>
  );
}

export default ThemeToggle;