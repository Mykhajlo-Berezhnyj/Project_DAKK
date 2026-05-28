export const newsData = {
  titleHead: {
    en: "Our News",
    uk: "Наші новини",
  },
  title: {
    en: "News",
    uk: "Новини",
  },
  loading: {
    en: "Loading...Please wait",
    uk: "Завантажуємо.....Почекайте будь-ласка",
  },
  publication: {
    en: "Publication",
    uk: "Публікація",
  },
  back: {
    en: "Back to publications",
    uk: "Повернутися до публікацій",
  },
  more: {
    en: "More publication",
    uk: "Ще публікації",
  },
} as const;

export type NewsData = typeof newsData;
