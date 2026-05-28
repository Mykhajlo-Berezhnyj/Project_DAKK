export const menuData = {
  menu: {
    en: "Menu",
    uk: "Меню",
  },
  about: {
    en: "About",
    uk: "Про компанію",
  },
  projects: {
    en: "Projects",
    uk: "Проекти",
  },
  news: {
    en: "News",
    uk: "Новини",
  },
  vacancies: {
    en: "Vacancies",
    uk: "Вакансії",
  },
  videos: {
    en: "Videos",
    uk: "Відео",
  },
  contacts: {
    en: "Contacts",
    uk: "Контакти",
  },
} as const;

export type MenuData = typeof menuData;
