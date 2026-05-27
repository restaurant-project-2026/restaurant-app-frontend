import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMenuItems } from '../api/menuItems';
import DishCard from '../components/DishCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getRestaurantHeroImage, getRestaurantInteriorImage } from '../utils/images';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFeatured = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await getMenuItems();
      const available = items.filter((i) => i.isAvailable);
      setFeatured(available.slice(0, 4));
    } catch {
      setError('Unable to load dishes. Please make sure the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatured();
  }, []);

  return (
    <div>
      <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <img
          src={getRestaurantHeroImage()}
          alt="Olympique de Marseille restaurant dining room"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/55" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <p className="text-amber-300 uppercase tracking-widest text-sm mb-4 font-medium">
            Fine Dining Restaurant
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white mb-6 leading-tight">
            Olympique de Marseille
          </h1>
          <p className="text-stone-200 text-lg mb-8 max-w-xl mx-auto">
            A unique culinary experience, blending Mediterranean tradition with modern creativity.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/menu"
              className="inline-flex items-center rounded-full bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-500 transition-colors"
            >
              View Menu
            </Link>
            <Link
              to="/reservation"
              className="inline-flex items-center rounded-full border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={getRestaurantInteriorImage()}
                alt="Restaurant interior"
                className="w-full h-80 object-cover"
              />
            </div>
            <div className="text-left">
              <h2 className="font-serif text-3xl text-stone-900 mb-4">Our Story</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Founded in 2010, Olympique de Marseille celebrates seasonal produce and the expertise
                of our chefs. Every dish tells a story, from farm to table.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Whether for a business lunch or a romantic dinner, our team welcomes you in an
                elegant and warm atmosphere in the heart of Tel Aviv.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-stone-900 mb-2">Our Signature Dishes</h2>
            <p className="text-stone-600">Discover a selection of our creations</p>
          </div>

          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} onRetry={loadFeatured} />}

          {!loading && !error && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((item) => (
                  <DishCard key={item.id} item={item} />
                ))}
              </div>
              {featured.length === 0 && (
                <p className="text-stone-500 text-center">No dishes available at the moment.</p>
              )}
              <div className="text-center mt-10">
                <Link
                  to="/menu"
                  className="inline-flex items-center text-amber-700 font-semibold hover:text-amber-600 transition-colors"
                >
                  View full menu →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
