import React, { useState, useEffect } from 'react';
import { FaTimes, FaRandom } from 'react-icons/fa';


interface SearchBarProps {
  onSearchSubmit: (term: string) => void;
  onSearchChange: (term: string) => void;
  onRandom: () => void;
  onClear: () => void;
  isSearchLoading: boolean;
  isRandomLoading: boolean;
  placeholder: string;
}

function SearchBar({
  onSearchSubmit,
  onSearchChange,
  onRandom,
  onClear,
  isSearchLoading,
  isRandomLoading,
  placeholder,
}: SearchBarProps) {
  const [term, setTerm] = useState('');


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (term.trim()) {
      onSearchSubmit(term);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setTerm(newTerm);
    onSearchChange(newTerm);
  };

  const handleClear = () => {
    setTerm('');
    onClear();
    onSearchChange('');
  };


  return (

    <div className="flex justify-center gap-2">
      <form onSubmit={handleSubmit} className="relative flex-grow max-w-xl">
        <input
          type="text"
          value={term}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full py-3 pl-5 pr-12 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          disabled={isSearchLoading}
        />
        {term && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute text-xl text-gray-500 transform -translate-y-1/2 top-1/2 right-14 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <FaTimes />
          </button>
        )}
        <button
          type="submit"
          className="absolute px-6 h-full font-semibold text-white bg-blue-600 rounded-r-full -right-0.5 top-0 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          disabled={isSearchLoading}
        >
          {isSearchLoading ? '...' : 'Знайти'}
        </button>
      </form>
      <button
        onClick={onRandom}
        title="Випадковий GIF"
        className="p-3 text-2xl text-white bg-green-500 rounded-full hover:bg-green-600 disabled:bg-gray-400"
        disabled={isRandomLoading}
      >
        <FaRandom />
      </button>
    </div>
  );
}

export default SearchBar;