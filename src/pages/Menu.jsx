import { useEffect, useMemo, useState } from 'react';
import { getCategories } from '../api/categories';
import { getMenuItems } from '../api/menuItems';
import CategoryFilter from '../components/CategoryFilter';
import DishCard from '../components/DishCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, items] = await Promise.all([getCategories(), getMenuItems()]);
      setCategories(cats);
      setMenuItems(items);
    } catch {
      setError('Unable to load the menu. Please make sure the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  const filteredItems = useMemo(() => {
    let items = menuItems.filter((i) => i.isAvailable);
    if (selectedCategoryId !== null) {
      items = items.filter((i) => i.categoryId === selectedCategoryId);
    }
    return items;
  }, [menuItems, selectedCategoryId]);

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-16 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">Our Menu</h1>
        <p className="text-stone-400">Dishes prepared with fresh seasonal ingredients</p>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && <LoadingSpinner label="Loading menu..." />}
        {error && <ErrorMessage message={error} onRetry={loadData} />}

        {!loading && !error && (
          <>
            <CategoryFilter
              categories={categories}
              selectedId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
            />

            {filteredItems.length === 0 ? (
              <p className="text-center text-stone-500 py-8">No dishes in this category.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <DishCard
                    key={item.id}
                    item={item}
                    categoryName={categoryMap[item.categoryId]}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
