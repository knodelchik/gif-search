import React from 'react';
import { type Gif } from '../types';
import { useStore } from '../store';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface GifItemProps {
  gif: Gif;
  onClick: (gif: Gif) => void;
}

function GifItem({ gif, onClick }: GifItemProps) {
  const { addFavorite, removeFavorite, isFavorite } = useStore();
  const isFav = isFavorite(gif.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(gif.id);
    } else {
      addFavorite(gif);
    }
  };

  return (

    <motion.div
      className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer aspect-square group"
      onClick={() => onClick(gif)}

      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}


      whileHover={{ scale: 1.05 }}
    >
      <img
        src={gif.images.fixed_width.url}
        alt={gif.title}
        className="object-cover w-full h-full"
      />

      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 p-2 text-2xl text-white bg-black bg-opacity-50 rounded-full transition-opacity hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        {isFav ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      </button>
    </motion.div>
  );
}

export default GifItem;