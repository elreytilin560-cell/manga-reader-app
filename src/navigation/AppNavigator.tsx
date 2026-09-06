import { BrowserRouter, Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';
import { LibraryScreen } from '../screens/LibraryScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { MangaDetailScreen } from '../screens/MangaDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ReaderScreen } from '../screens/ReaderScreen';
import { Book, Compass, Settings } from 'lucide-react';
import { cn } from '../utils/cn';

function TabBar() {
  const location = useLocation();
  
  const tabs = [
    { name: 'Biblioteca', path: '/', icon: Book },
    { name: 'Explorar', path: '/explore', icon: Compass },
    { name: 'Ajustes', path: '/settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs transition-colors",
                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-900"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span className="font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function TabLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}

export function AppNavigator() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tab Navigator */}
        <Route element={<TabLayout />}>
          <Route path="/" element={<LibraryScreen />} />
          <Route path="/explore" element={<ExploreScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Route>
        
        {/* Stack Navigator (Hides Tab Bar) */}
        <Route path="/manga/:mangaId" element={<MangaDetailScreen />} />
        <Route path="/reader/:chapterId" element={<ReaderScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
