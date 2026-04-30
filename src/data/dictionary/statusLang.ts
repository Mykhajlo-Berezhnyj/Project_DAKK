export const statusLang = [
  {
    key: "all",
    label: {
      uk: "Всі проекти",
      en: "All projects",
    },
  },
  {
    key: "completed",
    label: {
      uk: "Побудовано",
      en: "Completed",
    },
  },
  {
    key: "in-progress",
    label: {
      uk: "Будуються",
      en: "in-progress",
    },
  },
  {
    key: "concept",
    label: {
      uk: "Концепція",
      en: "Concept",
    },
  },
] as const;

export type StatusItem = typeof statusLang[number];
