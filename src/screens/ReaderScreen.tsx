import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings2, Bookmark, LayoutTemplate, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';
import { getChapterPages } from '../api/mangadex';
import { useFavoriteStore } from '../store/useFavoriteStore';

export function ReaderScreen() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const mangaId = searchParams.get('mangaId');
  const chapterNumber = searchParams.get('chapterNumber');
  
  const { saveReadingProgress } = useFavoriteStore();

  const [showControls, setShowControls] = useState(true);
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Reading mode: true = Horizontal (paginated), false = Vertical (webtoon)
  const [isHorizontal, setIsHorizontal] = useState(true);

  useEffect(() => {
    if (chapterId) {
      fetchPages(chapterId);
    }
  }, [chapterId]);

  const fetchPages = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getChapterPages(id);
      setPages(data);
      
      // Save reading progress
      if (mangaId && chapterNumber) {
        saveReadingProgress(mangaId, id, chapterNumber);
      }
    } catch (err) {
      setError('Error al cargar las páginas del capítulo.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDirection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHorizontal(!isHorizontal);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
        <p>Cargando páginas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-red-500 p-6 text-center">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="mb-6 font-medium text-lg">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white relative select-none overflow-hidden">
      {/* Top Header (Absolute to overlay on manga) */}
      <div 
        className={cn(
          "absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent flex items-center justify-between z-20 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm bg-black/20">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center backdrop-blur-sm bg-black/20 px-4 py-1 rounded-full">
          <span className="font-semibold text-sm leading-tight">Lector</span>
          <span className="text-xs text-gray-300 font-medium tracking-wide">
            {isHorizontal ? 'Modo Paginado' : 'Modo Webtoon'}
          </span>
        </div>
        <div className="flex items-center gap-2 -mr-2">
           <button 
             onClick={toggleDirection}
             className="p-2 hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm bg-black/20"
             title="Cambiar dirección de lectura"
           >
            <LayoutTemplate className={cn("w-5 h-5 transition-transform", !isHorizontal && "rotate-90")} />
          </button>
        </div>
      </div>

      {/* Manga Pages Viewport */}
      <div 
        className={cn(
          "flex-1 w-full h-full cursor-pointer relative",
          isHorizontal 
            ? "flex overflow-x-auto snap-x snap-mandatory hide-scrollbar" 
            : "flex flex-col overflow-y-auto hide-scrollbar"
        )}
        onClick={() => setShowControls(!showControls)}
        style={{ scrollBehavior: 'smooth' }}
      >
        {pages.map((pageUrl, index) => (
          <div 
            key={index}
            className={cn(
              "flex items-center justify-center shrink-0",
              isHorizontal ? "w-screen h-screen snap-center" : "w-full min-h-screen"
            )}
          >
            <img 
              src={pageUrl} 
              alt={`Page ${index + 1}`} 
              loading="lazy"
              className={cn(
                "object-contain",
                isHorizontal ? "w-full h-full max-w-5xl" : "w-full h-auto max-w-3xl"
              )}
            />
          </div>
        ))}
      </div>

      {/* Bottom Progress Bar (Absolute) */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-3 z-20 pb-safe transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex justify-between text-sm text-gray-300 font-medium px-1 drop-shadow-md">
          <span>{pages.length} páginas en total</span>
        </div>
      </div>
      
      {/* Hide scrollbar styles directly in the component for the preview */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
