import axios from 'axios';
import { Manga } from '../types/manga';

const BASE_URL = 'https://api.mangadex.org';

export const getPopularManga = async (limit: number = 20, offset: number = 0): Promise<Manga[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit,
        offset,
        'includes[]': ['cover_art'],
        'order[followedCount]': 'desc',
        'contentRating[]': ['safe', 'suggestive'],
      },
    });

    return parseMangaResponse(response.data.data);
  } catch (error) {
    console.error('Error fetching popular manga:', error);
    throw error;
  }
};

export const searchManga = async (title: string, limit: number = 20, offset: number = 0): Promise<Manga[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        title,
        limit,
        offset,
        'includes[]': ['cover_art'],
        'contentRating[]': ['safe', 'suggestive'],
      },
    });

    return parseMangaResponse(response.data.data);
  } catch (error) {
    console.error('Error searching manga:', error);
    throw error;
  }
};

// Función auxiliar para mapear la respuesta de MangaDex a nuestro tipo Manga
const parseMangaResponse = (data: any[]): Manga[] => {
  return data.map((item) => {
    const title = item.attributes.title.en || Object.values(item.attributes.title)[0] || 'Sin título';
    const coverRel = item.relationships.find((r: any) => r.type === 'cover_art');
    const fileName = coverRel?.attributes?.fileName;
    const coverUrl = fileName
      ? `https://uploads.mangadex.org/covers/${item.id}/${fileName}.256.jpg`
      : 'https://via.placeholder.com/256x360?text=No+Cover';

    return {
      id: item.id,
      title,
      coverUrl,
      description: item.attributes.description?.en || 'Sin descripción disponible.',
      status: item.attributes.status,
    };
  });
};