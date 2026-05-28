export const projectData = {
  area: {
    uk: "Площа:",
    en: "Area:",
  },
  timeline: {
    uk: "Рік роботи:",
    en: "Timeline",
  },
  status: {
    uk: "Статус:",
    en: "Status:",
  },
  linkWebsite: {
    uk: "Перейти на сайт проекту:",
    en: "Go to the project website:",
  },
  techinfo: {
    uk: "Технічна інформація",
    en: "Technical information",
  },
  services: {
    uk: "Надані послуги:",
    en: "Services provided:",
  },
  service: {
    uk: "Надана послуга:",
    en: "Service provided:",
  },
  customers: {
    uk: "Замовники:",
    en: "Customers:",
  },
  customer: {
    uk: "Замовник:",
    en: "Customer:",
  },
  generalDesigner: {
    uk: "Генпроектувальник:",
    en: "General Designer:",
  },
  consequenceClass: {
    uk: "Код категорії:",
    en: "Consequence class:",
  },
  constructive: {
    uk: "Конструктив:",
    en: "Constructive:",
  },
  award: {
    uk: "Нагороди:",
    en: "Award:",
  },
  passport: {
    uk: "Паспорт об'єкта:",
    en: "Object passport:",
  },
  photo: {
    en: "Object photo",
    uk: "Фото об'єкту",
  },
  partners: {
    en: "Partners",
    uk: "Партнери",
  },
  adress: {
    en: "Адресса:",
    uk: "Adress:",
  },
  web: {
    en: "Веб-сайт:",
    uk: "Website",
  },
} as const;

export type ProjectData = typeof projectData;
