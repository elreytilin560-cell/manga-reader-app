# Manga Reader App 📚

Una aplicación móvil de alto rendimiento para la lectura de manga, construida con React Native (Expo) y respaldada por la API de MangaDex. Diseñada con una arquitectura limpia y escalable.

## 🚀 Características Principales

*   **Motor de Lectura Inmersivo:** Soporte para paginación horizontal (estilo manga clásico) y vertical continuo (estilo Webtoon). Gestos nativos de *Pinch-to-Zoom* para visualizar detalles.
*   **Gestión Inteligente de Memoria:** Precarga y caché en disco de imágenes de alta resolución usando `expo-image` para una lectura fluida sin consumir datos de más.
*   **Biblioteca y Persistencia:** Guardado local de mangas favoritos y del historial de lectura (capítulo exacto donde te quedaste) utilizando `Zustand` + `AsyncStorage`.
*   **Exploración y Búsqueda:** Conexión directa a MangaDex para descubrir mangas populares o buscar por título.
*   **Gestión de Almacenamiento:** Controles en la app para liberar la memoria caché y borrar los datos de usuario.

## 🛠️ Stack Tecnológico

*   **Framework:** [React Native](https://reactnative.dev/) (con [Expo](https://expo.dev/))
*   **Navegación:** React Navigation (Tabs & Native Stack)
*   **Estado Global:** Zustand (con middleware de persistencia)
*   **Networking:** Axios (integración con MangaDex API)
*   **Imágenes:** Expo Image
*   **Iconos:** Lucide React Native

## 📂 Arquitectura del Proyecto

```text
/src
  ├── api/          # Configuración de Axios y endpoints de MangaDex
  ├── navigation/   # Configuración de rutas (Stack y Tabs)
  ├── screens/      # Vistas (Explore, Library, Reader, Settings, Detail)
  ├── store/        # Estado global (Zustand)
  └── types/        # Interfaces de TypeScript
```

## 💻 Instalación y Uso Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
    cd manga-reader-app
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar el servidor de desarrollo de Expo:**
    ```bash
    npx expo start
    ```

4.  **Probar la aplicación:**
    *   Escanea el código QR con la app **Expo Go** (Android) o la app de Cámara (iOS).
    *   O presiona `a` para abrir en el emulador de Android / `i` para el simulador de iOS.

## 📝 Licencia

Este proyecto es de propósito educativo. Las imágenes y el contenido de los mangas pertenecen a sus respectivos autores y a MangaDex.
