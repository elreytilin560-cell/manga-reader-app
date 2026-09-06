import { useState } from 'react';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { Trash2, HardDrive, Info, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

export function SettingsScreen() {
  const { clearAllData } = useFavoriteStore();
  
  const [showConfirm, setShowConfirm] = useState<'cache' | 'data' | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const handleClearCache = () => {
    // Simulating expo-image cache clearing for the web preview
    setTimeout(() => {
      setShowConfirm(null);
      setShowSuccess('La caché ha sido liberada correctamente.');
      setTimeout(() => setShowSuccess(null), 3000);
    }, 500);
  };

  const handleClearData = () => {
    clearAllData();
    setShowConfirm(null);
    setShowSuccess('Todos los datos han sido borrados.');
    setTimeout(() => setShowSuccess(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="p-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Ajustes</h1>

        {/* Modal Overlay for Web Preview */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                {showConfirm === 'cache' ? 'Limpiar Caché' : 'Borrar Datos'}
              </h3>
              <p className="text-center text-gray-500 mb-6">
                {showConfirm === 'cache' 
                  ? '¿Estás seguro de que deseas borrar las imágenes en caché? Esto liberará espacio.' 
                  : '¿Estás seguro? Esto eliminará todos tus favoritos y tu historial de lectura de forma permanente.'}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirm(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={showConfirm === 'cache' ? handleClearCache : handleClearData}
                  className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-lg z-50 animate-in fade-in slide-in-from-top-5">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="font-medium text-sm">{showSuccess}</span>
          </div>
        )}

        <div className="max-w-2xl mx-auto w-full space-y-6">
          
          {/* Storage Section */}
          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-2">Almacenamiento</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button 
                onClick={() => setShowConfirm('cache')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <HardDrive className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <span className="block font-medium text-gray-900">Limpiar Caché</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Libera espacio eliminando portadas y páginas guardadas</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </section>

          {/* Danger Zone Section */}
          <section>
            <h2 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3 ml-2">Zona de Peligro</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
              <button 
                onClick={() => setShowConfirm('data')}
                className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors active:bg-red-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <span className="block font-medium text-red-600">Borrar todos los datos</span>
                    <span className="block text-xs text-red-400 mt-0.5">Elimina favoritos e historial permanentemente</span>
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* About Section */}
          <section className="mt-8 pt-8">
            <div className="flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4 flex items-center justify-center">
                <Info className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Manga Reader App</h3>
              <p className="text-sm font-medium text-gray-500 mt-1 mb-2">Versión 1.0.0</p>
              <p className="text-xs text-gray-400 max-w-[200px]">Desarrollado con la API de MangaDex. Las imágenes pertenecen a sus respectivos autores.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
