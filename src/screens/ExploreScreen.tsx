import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity,
  Dimensions,
  TextInput,
  Keyboard
} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, Search, X } from 'lucide-react-native';
import { getPopularManga, searchManga } from '../api/mangadex';
import { Manga } from '../types/manga';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { RootStackParamList } from '../../App';

type ExploreNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 32 - (10 * (numColumns - 1))) / numColumns;
const PAGE_LIMIT = 20;

export function ExploreScreen() {
  const navigation = useNavigation<ExploreNavigationProp>();
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
  
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Estados de paginación
  const [offset, setOffset] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Carga inicial (reinicia offset)
  const fetchInitialMangas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setIsSearchActive(false);
      setOffset(0);
      setHasMore(true);

      const data = await getPopularManga(PAGE_LIMIT, 0);
      setMangas(data);
      if (data.length < PAGE_LIMIT) setHasMore(false);
    } catch (err) {
      setError('Error al conectar con MangaDex. Verifica tu internet.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialMangas();
  }, [fetchInitialMangas]);

  // Búsqueda inicial (reinicia offset)
  const handleSearch = async () => {
    Keyboard.dismiss();
    if (!searchQuery.trim()) {
      fetchInitialMangas();
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setIsSearchActive(true);
      setOffset(0);
      setHasMore(true);

      const data = await searchManga(searchQuery, PAGE_LIMIT, 0);
      setMangas(data);
      if (data.length < PAGE_LIMIT) setHasMore(false);
    } catch (err) {
      setError('Error al buscar mangas.');
    } finally {
      setLoading(false);
    }
  };

  // Carga de siguientes páginas (Concatena al arreglo existente)
  const loadMoreMangas = async () => {
    if (isFetchingMore || !hasMore || loading) return;

    try {
      setIsFetchingMore(true);
      const nextOffset = offset + PAGE_LIMIT;

      const newMangaBatch = isSearchActive
        ? await searchManga(searchQuery, PAGE_LIMIT, nextOffset)
        : await getPopularManga(PAGE_LIMIT, nextOffset);

      if (newMangaBatch.length < PAGE_LIMIT) {
        setHasMore(false);
      }

      setMangas((prev) => [...prev, ...newMangaBatch]);
      setOffset(nextOffset);
    } catch (err) {
      console.error('Error al cargar más mangas:', err);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    Keyboard.dismiss();
    fetchInitialMangas();
  };

  const renderItem = ({ item }: { item: Manga }) => {
    const isFav = isFavorite(item.id);

    return (
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('MangaDetail', { manga: item })}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.coverUrl }} 
            style={styles.cover} 
            contentFit="cover"
            transition={300}
          />
          <TouchableOpacity 
            style={styles.favoriteBtn}
            onPress={() => isFav ? removeFavorite(item.id) : addFavorite(item)}
          >
            <Heart size={20} color={isFav ? '#ef4444' : '#6b7280'} fill={isFav ? '#ef4444' : 'transparent'} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#2563eb" />
      </View>
    );
  };

  const renderContent = () => {
    if (loading && mangas.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Cargando catálogo...</Text>
        </View>
      );
    }

    if (error && mangas.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={isSearchActive ? handleSearch : fetchInitialMangas}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (mangas.length === 0 && isSearchActive) {
      return (
        <View style={styles.centerContainer}>
          <Search size={48} color="#d1d5db" />
          <Text style={styles.emptySearchText}>No se encontraron mangas</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={mangas}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        refreshing={loading}
        onRefresh={isSearchActive ? handleSearch : fetchInitialMangas}
        showsVerticalScrollIndicator={false}
        
        // Propiedades de Paginación Infinita
        onEndReached={loadMoreMangas}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorar</Text>
        <View style={styles.searchContainer}>
          <Search color="#9ca3af" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar mangas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
              <X color="#6b7280" size={16} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 16, paddingHorizontal: 12, height: 48 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#1f2937' },
  clearBtn: { padding: 4, backgroundColor: '#e5e7eb', borderRadius: 12 },
  
  listContainer: { padding: 16, paddingBottom: 100 },
  columnWrapper: { gap: 10, marginBottom: 16 },
  card: { width: itemWidth },
  imageContainer: { width: '100%', aspectRatio: 2/3, backgroundColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
  cover: { flex: 1, width: '100%', height: '100%' },
  favoriteBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 6, zIndex: 10 },
  title: { fontSize: 13, fontWeight: '600', color: '#1f2937', paddingHorizontal: 2 },
  
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: '#6b7280', fontSize: 16 },
  errorText: { color: '#ef4444', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  retryBtn: { backgroundColor: '#f3f4f6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  retryText: { color: '#1f2937', fontWeight: '600' },
  emptySearchText: { marginTop: 16, fontSize: 18, fontWeight: '600', color: '#4b5563' },
  footerLoader: { paddingVertical: 20, alignItems: 'center' },
});