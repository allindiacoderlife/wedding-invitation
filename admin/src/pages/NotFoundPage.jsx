import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h1 className="text-5xl font-bold text-rose-700">404</h1>
        <h2 className="text-lg font-bold text-stone-800">Admin Page Not Found</h2>
        <p className="text-xs text-stone-500">The administration link you followed is invalid.</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition"
        >
          Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
};
