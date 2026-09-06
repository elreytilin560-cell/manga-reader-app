import { useEffect, useState } from 'react';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { Manga } from '../types/manga';
import { Link } from 'react-router-dom';
import { Heart, Loader2, AlertCircle, Search, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { getPopularManga, searchManga } from '../api/mangadex';

export function ExploreScreen() {
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    fetchMangas();
  }, []);

  const fetchMangas = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsSearchActive(false);
      const data = await getPopularManga();
      setMangas(data);
    } catch (err) {
      setError('Error al cargar los mangas. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      fetchMangas();
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setIsSearchActive(true);
      const data = await searchManga(searchQuery);
      setMangas(data);
    } catch (err) {
      setError('Error al buscar mangas. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchMangas();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
          <p className="font-medium">Cargando catálogo...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-red-500 p-4 text-center">
          <AlertCircle className="w-10 h-10 mb-4" />
          <p className="font-medium mb-4">{error}</p>
          <button 
            onClick={isSearchActive ? () => handleSearch() : fetchMangas}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors font-medium"
          >
            Reintentar
          </button>
        </div>
      );
    }

    if (mangas.length === 0 && isSearchActive) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500 text-center px-4">
          <Search className="w-12 h-12 mb-4 text-gray-300" />
          <p className="font-medium text-lg text-gray-800">No se encontraron mangas</p>
          <p className="text-sm mt-1">Intenta con otros términos de búsqueda.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        {mangas.map((manga) => {
          const favorite = isFavorite(manga.id);
          return (
            <div key={manga.id} className="relative flex flex-col group">
              <Link to={`/manga/${manga.id}`} className="aspect-[2/3] bg-gray-200 rounded-lg mb-2 overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow">
                <img 
                  src={manga.coverUrl} 
                  alt={manga.title} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </Link>
              <button 
                onClick={() => favorite ? removeFavorite(manga.id) : addFavorite(manga)}
                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
              >
                <Heart className={cn("w-5 h-5 transition-colors", favorite ? 'fill-red-500 text-red-500' : 'text-gray-500')} />
              </button>
              <span className="text-sm font-semibold text-gray-800 line-clamp-2 px-1">{manga.title}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-2xl mx-auto w-full flex flex-col min-h-screen">
      <div className="mt-4 mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Explorar</h1>
        
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar mangas..."
            className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-12 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
          />
          <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          {searchQuery && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 rounded-full p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
        
        {isSearchActive && !loading && (
          <p className="text-sm text-gray-500 mt-4 px-1">
            Resultados para "<span className="font-medium text-gray-800">{searchQuery}</span>"
          </p>
        )}
      </div>

      {renderContent()}
    </div>
  );
}

