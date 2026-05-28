export const footerData = {
  partners: {
    en: "Our partners",
    uk: "Наші партнери",
  },
  contacts: {
    en: "Contacts",
    uk: "Контакти",
  },
  titleAdress: {
    en: "Our adress:",
    uk: "Наша адреса:",
  },
  adress: {
    en: "st. Shevchenko, 1, Kyiv, Ukraine",
    uk: "вул. Шевченка, 1, Київ, Україна",
  },
  phone: {
    en: "Phone:",
    uk: "Телефон:",
  },
  email: {
    en: "Email:",
    uk: "Пошта:",
  },
  social: {
    en: "Social media",
    uk: "Соціальні мережі",
  },
  facebook: {
    en: "Our Facebook page",
    uk: "Наша сторінка на Facebook",
  },
  instagram: {
    en: "Our Instagram page",
    uk: "Наша сторінка на Instagram",
  },
  linkedIn: {
    en: "Our LinkedIn page",
    uk: "Наша сторінка на LinkedIn",
  },
} as const;

export type FooterData = typeof footerData;
