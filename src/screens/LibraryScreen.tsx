import { useFavoriteStore } from '../store/useFavoriteStore';
import { Link } from 'react-router-dom';
import { LibraryBig } from 'lucide-react';

export function LibraryScreen() {
  const { favorites } = useFavoriteStore();

  return (
    <div className="p-4 max-w-2xl mx-auto w-full flex flex-col min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 mt-4">Mi Biblioteca</h1>
      
      {favorites.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-20">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <LibraryBig className="w-12 h-12 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu biblioteca está vacía</h2>
          <p className="text-gray-500 mb-8 max-w-sm text-center">
            Aún no has guardado ningún manga. Explora nuestro catálogo y presiona el corazón para añadirlos aquí.
          </p>
          <Link 
            to="/explore" 
            className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-200"
          >
            Descubrir Mangas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {favorites.map((manga) => (
            <Link key={manga.id} to={`/manga/${manga.id}`} className="flex flex-col group">
              <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-2 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                 <img src={manga.coverUrl} alt={manga.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span className="text-sm font-semibold text-gray-800 line-clamp-2 px-1">{manga.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
