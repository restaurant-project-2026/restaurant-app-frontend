export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center max-w-md mx-auto">
      <p className="text-red-800 font-medium">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-700 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
