
import Skeleton from 'react-loading-skeleton';

function GifListSkeleton() {
  const items = Array(12).fill(0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((_, index) => (
        <div key={index} className="aspect-square">
          <Skeleton height="100%" />
        </div>
      ))}
    </div>
  );
}

export default GifListSkeleton;