// indicateur de chargement réutilisable affiché pendant qu'une requête API est en cours
// le label peut être personnalisé selon le contexte (menu, tables, réservations...)
export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div
        className="h-10 w-10 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin"
        role="status"
        aria-label={label}
      />
      <p className="text-stone-600 text-sm">{label}</p>
    </div>
  );
}
