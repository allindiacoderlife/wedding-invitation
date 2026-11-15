import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h1 className="text-6xl font-serif text-rose-700 font-bold">404</h1>
        <h2 className="text-xl font-serif text-stone-800">Page Not Found</h2>
        <p className="text-xs text-stone-500">
          The celebration page you are looking for does not exist or may have been moved.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-block px-5 py-2.5 bg-rose-700 text-white rounded-xl text-xs font-semibold hover:bg-rose-800 transition"
          >
            Return to Wedding Home
          </Link>
        </div>
      </div>
    </div>
  );
};
