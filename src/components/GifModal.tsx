import { useState, useEffect } from 'react';
import { type Gif } from '../types';
import { useStore } from '../store';
import { FaHeart, FaRegHeart, FaTimes, FaShareAlt, FaDownload } from 'react-icons/fa';
import { motion, type Variants } from 'framer-motion';

interface GifModalProps {
  gif: Gif | null;
  onClose: () => void;
}


const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};


const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.8
    }
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: {
      duration: 0.2,
    }
  },
};


function GifModal({ gif, onClose }: GifModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useStore();

  useEffect(() => {
    if (gif) {
      document.body.classList.add('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [gif]);

  if (!gif) return null;

  const isFav = isFavorite(gif.id);

  const handleFavoriteClick = () => {
    if (isFav) {
      removeFavorite(gif.id);
    } else {
      addFavorite(gif);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(gif.images.original.url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Не вдалося скопіювати посилання:', err);
    }
  };

  const downloadGif = async () => {
    try {
      const response = await fetch(gif.images.original.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${gif.slug || 'gif'}.gif`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Не вдалося завантажити GIF:', err);
    }
  };


  const creationDate = new Date(gif.import_datetime).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const author = gif.user?.display_name || gif.user?.username || 'Невідомий автор';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="relative w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800 transform-gpu"
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <button
          onClick={onClose}
          className="absolute z-10 flex items-center justify-center w-9 h-9 text-2xl text-gray-500 transition-colors rounded-full top-3 right-3 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
          aria-label="Закрити"
        >
          <FaTimes />
        </button>

        <img
          src={gif.images.original.url}
          alt={gif.title || 'GIF'}
          className="w-full max-h-[70vh] object-contain mb-4 rounded-md"
        />

        <div className="flex flex-col gap-3">
          <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white break-words">
            {gif.title || 'Без назви'}
          </h3>

          <div className="text-gray-600 dark:text-gray-400 text-sm flex flex-wrap gap-x-4 gap-y-1">
            <span>Автор: <span className="font-semibold">{author}</span></span>
            <span>Дата: <span className="font-semibold">{creationDate}</span></span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <motion.button
              onClick={handleFavoriteClick}
              className={`flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 text-white rounded-full transition-colors ${isFav ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              whileTap={{ scale: 0.95 }}
            >
              {isFav ? <FaHeart /> : <FaRegHeart />}
              {isFav ? 'В обраному' : 'Додати в обране'}
            </motion.button>

            <motion.button
              onClick={copyLink}
              className="flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <FaShareAlt />
              {isCopied ? 'Скопійовано!' : 'Поділитися'}
            </motion.button>

            <motion.button
              onClick={downloadGif}
              className="flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <FaDownload />
              Завантажити
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GifModal;