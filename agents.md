# 🤖 Agent Instructions: World Cup 2026 PWA (Data-Evolution Ready)

Este documento dirige la creación de una PWA móvil-first con Astro y Tailwind. El objetivo es un calendario patrocinado que evolucione automáticamente de "horarios programados" a "resultados en vivo".

## 📊 Estrategia de Datos y Referencia Cruzada
El agente debe programar la lógica de la aplicación basándose en dos fuentes de datos para anticipar el comportamiento del torneo:

1.  **Esquema de Resultados (Referencia: `worldcup2022.json`):**
    *   Utilizar este archivo como modelo para entender cómo aparecerán los datos de goles (`goals`), marcadores finales (`score.ft`), tiempos extra (`et`) y penales (`p`)[cite: 2].
    *   La lógica de cálculo de la tabla de posiciones de **Grupos** debe derivarse de procesar estos campos de score (G=3 pts, E=1 pt, P=0 pts)[cite: 2].

2.  **Estructura Oficial y Sedes (Referencia: `worldcup2026.json`):**
    *   Utilizar este archivo para la programación real de los 104 partidos[cite: 1].
    *   Manejar los 12 grupos (A hasta L) y las fases eliminatorias (Round of 32 hasta Final)[cite: 1].
    *   Extraer los nombres de las sedes (ej: Mexico City, Guadalajara, Vancouver, Miami) para la sección de Estadios[cite: 1].

## 🏗️ Requerimientos Técnicos
*   **Framework:** Astro (SSR habilitado).
*   **Tailwind CSS:** Diseño Mobile-First estricto.
*   **Data Source:** `https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json`.
*   **Normalización de Tiempo:** Los partidos tienen diferentes zonas horarias (UTC-4, UTC-5, UTC-6, UTC-7)[cite: 1]. El sistema debe convertirlos automáticamente a la hora local del usuario.

## 📱 Funcionalidades y Vistas

### 1. Branding (Sponsor)
*   **Splash Screen:** Pantalla de carga con el logo del sponsor centrado.
*   **Header Persistente:** Logo del sponsor siempre visible en la parte superior izquierda de todas las pantallas.

### 2. Navegación Inferior (Bottom Nav)
*   **Inicio:** 
    *   **Hero:** El partido más próximo a la hora actual (detectado mediante `Date.now()`)[cite: 1].
    *   **Daily Carousel:** Carrusel con los partidos programados para el día calendario actual[cite: 1].
*   **Grupos:** 
    *   Tablas de posiciones dinámicas calculadas en tiempo real. 
    *   Debe detectar si hay scores disponibles (usando el formato de 2022) para actualizar los puntos[cite: 2].
*   **Estadios:** 
    *   Listado de las 16 sedes mundiales[cite: 1].
    *   Incluir foto del estadio y ubicación (Ground).
*   **Calendario:** 
    *   Lista completa de partidos dividida por rondas[cite: 1].
    *   **Estado Visual:** Si el partido tiene `score`, mostrar marcador[cite: 2]. Si es futuro, mostrar hora y estadio[cite: 1].

## 🛠️ Instrucciones Específicas para Claude Code
1.  **Lógica Defensiva:** Al procesar el JSON, el código debe verificar: `if (match.score) { renderResult() } else { renderSchedule() }`[cite: 1, 2].
2.  **Assets:** 
    *   Banderas: Usar `https://flagcdn.com/{code}.svg`.
    *   Estadios: Mapear los nombres de `ground` en el JSON a imágenes locales en `public/assets/venues/`[cite: 1].
3.  **PWA:** Configurar el plugin de PWA para que sea instalable y funcione offline para consultas rápidas del calendario.