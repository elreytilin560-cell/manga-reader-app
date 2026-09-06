import axios from 'axios';
import { Manga } from '../types/manga';
import { Chapter } from '../types/chapter';

const BASE_URL = 'https://api.mangadex.org';
const UPLOADS_URL = 'https://uploads.mangadex.org';

const api = axios.create({
  baseURL: BASE_URL,
});

export const getPopularManga = async (): Promise<Manga[]> => {
  try {
    // includes[]=cover_art is MANDATORY to get the cover file name in relationships
    const response = await api.get('/manga', {
      params: {
        'includes[]': 'cover_art',
        'order[followedCount]': 'desc',
        limit: 20,
        hasAvailableChapters: 'true',
      },
    });

    return mapMangaDexResponse(response.data.data);
  } catch (error) {
    console.error('Error fetching popular manga:', error);
    throw error;
  }
};

export const searchManga = async (query: string): Promise<Manga[]> => {
  try {
    const response = await api.get('/manga', {
      params: {
        title: query,
        'includes[]': 'cover_art',
        limit: 20,
        hasAvailableChapters: 'true',
      },
    });
    return mapMangaDexResponse(response.data.data);
  } catch (error) {
    console.error('Error searching manga:', error);
    throw error;
  }
};

// Utility function to map and clean the response
const mapMangaDexResponse = (data: any[]): Manga[] => {
  return data.map((item) => {
    // 1. Get Title (Fallback to the first available language if English is missing)
    const titleObj = item.attributes.title;
    const title = titleObj.en || titleObj['es-la'] || titleObj.es || Object.values(titleObj)[0] || 'Desconocido';

    // 2. Extract Cover File Name from relationships
    const coverRel = item.relationships.find((rel: any) => rel.type === 'cover_art');
    const coverFileName = coverRel?.attributes?.fileName;

    // 3. Build Cover URL
    const coverUrl = coverFileName 
      ? `${UPLOADS_URL}/covers/${item.id}/${coverFileName}.256.jpg` // .256.jpg gets a smaller optimized version
      : 'https://via.placeholder.com/256x384.png?text=Sin+Portada';

    return {
      id: item.id,
      title: title as string,
      coverUrl,
    };
  });
};

export const getMangaById = async (id: string): Promise<Manga> => {
  try {
    const response = await api.get(`/manga/${id}`, {
      params: {
        'includes[]': 'cover_art',
      },
    });
    return mapMangaDexResponse([response.data.data])[0];
  } catch (error) {
    console.error('Error fetching manga details:', error);
    throw error;
  }
};

export const getMangaChapters = async (mangaId: string): Promise<Chapter[]> => {
  try {
    const response = await api.get(`/manga/${mangaId}/feed`, {
      params: {
        'translatedLanguage[]': ['es-la', 'es', 'en'], // Prioritizing Spanish and English
        'order[chapter]': 'asc',
        limit: 500,
      },
    });

    return response.data.data.map((item: any) => ({
      id: item.id,
      chapterNumber: item.attributes.chapter || '0', // '0' for oneshots usually
      title: item.attributes.title,
      language: item.attributes.translatedLanguage,
    }));
  } catch (error) {
    console.error('Error fetching manga chapters:', error);
    throw error;
  }
};

export const getChapterPages = async (chapterId: string): Promise<string[]> => {
  try {
    const response = await api.get(`/at-home/server/${chapterId}`);
    const { baseUrl, chapter } = response.data;
    const { hash, data } = chapter;

    // Construct the high-quality URL for each page
    return data.map((filename: string) => `${baseUrl}/data/${hash}/${filename}`);
  } catch (error) {
    console.error('Error fetching chapter pages:', error);
    throw error;
  }
};
