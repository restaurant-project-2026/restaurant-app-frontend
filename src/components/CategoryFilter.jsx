export default function CategoryFilter({ categories, selectedId, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedId === null
            ? 'bg-amber-700 text-white shadow'
            : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedId === cat.id
              ? 'bg-amber-700 text-white shadow'
              : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
