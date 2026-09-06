import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMangaById, getMangaChapters } from '../api/mangadex';
import { Manga } from '../types/manga';
import { Chapter } from '../types/chapter';
import { Loader2, AlertCircle, ArrowLeft, Play } from 'lucide-react';
import { useFavoriteStore } from '../store/useFavoriteStore';

export function MangaDetailScreen() {
  const { mangaId } = useParams();
  const navigate = useNavigate();
  const { history } = useFavoriteStore();
  
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mangaId) {
      fetchData(mangaId);
    }
  }, [mangaId]);

  const fetchData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const [mangaData, chaptersData] = await Promise.all([
        getMangaById(id),
        getMangaChapters(id)
      ]);
      
      setManga(mangaData);
      setChapters(chaptersData);
    } catch (err) {
      setError('Error al cargar la información del manga.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
        <p className="font-medium">Cargando detalles...</p>
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-red-500 p-4 text-center">
        <AlertCircle className="w-10 h-10 mb-4" />
        <p className="font-medium mb-4">{error || 'Manga no encontrado'}</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors font-medium"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-safe">
      {/* Header */}
      <div className="relative h-64 md:h-80 bg-gray-900 w-full">
        <img 
          src={manga.coverUrl} 
          alt={manga.title} 
          className="w-full h-full object-cover opacity-40 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="absolute bottom-0 left-0 w-full p-6 flex items-end gap-6">
          <div className="w-28 h-40 md:w-36 md:h-52 rounded-lg overflow-hidden shadow-xl border-2 border-white/10 shrink-0 bg-gray-800">
            <img 
              src={manga.coverUrl} 
              alt={manga.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="pb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
              {manga.title}
            </h1>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-md">
                {chapters.length} Capítulos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 mt-4 relative">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Capítulos</h2>
        
        {mangaId && history[mangaId] && (
          <div className="mb-4">
            <Link 
              to={`/reader/${history[mangaId].chapterId}?mangaId=${mangaId}&chapterNumber=${history[mangaId].chapterNumber}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              Continuar leyendo: Cap {history[mangaId].chapterNumber}
            </Link>
          </div>
        )}

        {chapters.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p>No hay capítulos disponibles en tu idioma.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chapters.map((chapter) => (
              <Link 
                key={chapter.id}
                to={`/reader/${chapter.id}?mangaId=${manga.id}&chapterNumber=${chapter.chapterNumber}`}
                className="flex flex-col bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Capítulo {chapter.chapterNumber}
                  </span>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">
                    {chapter.language}
                  </span>
                </div>
                {chapter.title && (
                  <span className="text-sm text-gray-500 mt-1 line-clamp-1">{chapter.title}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
