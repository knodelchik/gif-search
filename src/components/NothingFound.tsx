
interface NothingFoundProps {
  message: string;
}

function NothingFound({ message }: NothingFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 dark:text-gray-400">
      <span className="mb-4 text-6xl">😢</span>
      <h3 className="text-2xl font-semibold">Ой!</h3>
      <p className="max-w-md mt-2">{message}</p>
    </div>
  );
}

export default NothingFound;