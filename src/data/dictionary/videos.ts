export const videosData = {
  titleHead: {
    en: "Video Gallery – Explore Our Projects",
    uk: "Відео – Перегляньте наші проєкти",
  },
  description: {
    en: "Discover inspiring videos showcasing our architecture, design, and future concepts.",
    uk: "Перегляньте добірку відео з нашими архітектурними рішеннями, дизайном та ідеями майбутнього.",
  },
  title: {
    en: "Welcome to the Video section",
    uk: "Ласкаво просимо до розділу «Відео»",
  },
} as const;

export type VideosData = typeof videosData;
