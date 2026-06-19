import { useEffect, useState } from 'react';
import { getCategories } from '../api/categories';
import { getMenuItems } from '../api/menuItems';
import CategoryFilter from '../components/CategoryFilter';
import DishCard from '../components/DishCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// page menu : charge toutes les catégories et tous les plats puis permet de filtrer
export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // incrémenter ce compteur depuis le bouton "Try Again" pour relancer le chargement
  const [retryCount, setRetryCount] = useState(0);

  // se déclenche au premier affichage et à chaque clic sur "Try Again" (via retryCount)
  // charge les catégories et les plats en parallèle pour optimiser le temps de chargement
  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [retryCount]);

  // construit un dictionnaire { id → nom } pour retrouver le nom d'une catégorie facilement
  const categoryMap = {};
  categories.forEach((c) => {
    categoryMap[c.id] = c.name;
  });

  // filtre les plats : on garde uniquement les disponibles et on applique le filtre de catégorie si actif
  let filteredItems = menuItems.filter((i) => i.isAvailable);
  if (selectedCategoryId !== null) {
    filteredItems = filteredItems.filter((i) => i.categoryId === selectedCategoryId);
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 py-16 text-center">
        <h1 className="font-serif text-4xl text-white mb-2">Our Menu</h1>
        <p className="text-stone-400">Dishes prepared with fresh seasonal ingredients</p>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && <LoadingSpinner label="Loading menu..." />}
        {error && <ErrorMessage message={error} onRetry={() => setRetryCount((c) => c + 1)} />}

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
