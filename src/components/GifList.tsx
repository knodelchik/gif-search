
import GifItem from './GifItem';
import { type Gif } from '../types';

interface GifListProps {
  gifs: Gif[];
  onGifClick: (gif: Gif) => void;
}

function GifList({ gifs, onGifClick }: GifListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {gifs.map((gif) => (
        <GifItem key={gif.id} gif={gif} onClick={onGifClick} />
      ))}
    </div>
  );
}

export default GifList;