
interface CategoryListProps {
  categories: string[];
  onCategoryClick: (category: string) => void;
}


function CategoryList({ categories, onCategoryClick }: CategoryListProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryClick(category)}
          className="px-4 py-1 text-sm font-medium text-blue-700 capitalize transition-colors bg-blue-100 rounded-full hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryList;