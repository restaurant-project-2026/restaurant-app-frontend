import { getDishImage } from "../utils/images";

// carte affichée pour chaque plat : photo, nom, prix, description et badge "Indisponible"
export default function DishCard({ item, categoryName }) {
  const imageUrl = getDishImage(item, categoryName);

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-stone-100">
      <div className="aspect-4/3 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-5 text-left">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg text-stone-900">{item.name}</h3>
          <span className="shrink-0 font-semibold text-amber-700">
            {Number(item.price).toFixed(2)} €
          </span>
        </div>
        {item.description && (
          <p className="mt-2 text-sm text-stone-600 line-clamp-2">
            {item.description}
          </p>
        )}
        {!item.isAvailable && (
          <span className="inline-block mt-2 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
            Unavailable
          </span>
        )}
      </div>
    </article>
  );
}
