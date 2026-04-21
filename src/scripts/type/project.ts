import type { categorySlugs } from "../../data/category";
import type { statusLang } from "../../data/dictionary/statusLang";
import type { CategoriesStore, FiltersStore } from "./filters";
import type { NewsStore } from "./news";

export interface Timeline {
  yearStart?: number;
  yearEnd?: number;
}

export type CategorySlug = (typeof categorySlugs)[number];

export interface Category {
  _id: string;
  name: string;
  slug: CategorySlug;
}

export interface City {
  _id: string;
  name: string;
  slug: string;
}

export interface Supplier {
  _id: string;
  name: string;
  location?: string;
  link?: string;
}

export interface Partner extends Supplier {
  logo?: string;
}

export interface generalDesigner extends Supplier {}

export interface Seo {
  metaTitle: string;
  metaDescription: string;
}

export type ConsequenceClass = "CC1" | "CC2" | "CC3";

export interface Location {
  _type: "geopoint";
  lat: number;
  lng: number;
  alt?: number;
}

export interface Seo {
  metaTitle: string;
  metaDescription: string;
}

interface Advantage {
  title: string;
  description: string;
}

export type Status = "concept" | "in-progress" | "completed";

export type StatusLang = (typeof statusLang)[number]["key"];

export type TypeOfServices =
  | "Житлові комплекси"
  | "Торговельні центри"
  | "Бізнес-центри"
  | "Освітні комплекси"
  | "Промислове будівництво"
  | "Укриття";

export interface Project {
  _id: string;
  projectName: string;
  slug: string;
  country: string;
  city: City;
  adress: string;
  location: Location;
  area: number;
  timeline: Timeline;
  status: Status;
  typeOfServices: TypeOfServices[];
  category: Category;
  constructive: string;
  consequenceClass: ConsequenceClass;
  description?: string;
  advantages?: Advantage[];
  supplier?: Supplier;
  partner?: Supplier;
  generalDesigner?: Supplier;
  award?: string;
  siteUrl?: string;
  cover: string;
  schema?: string;
  photo?: string[];
  linkDocuments?: string;
  seo: Seo;
  _createdAt?: Date;
  _rev?: string;
  searchIndex?: string;
}

export type ProjectsStore = {
  projects: Project[];
  isReady: boolean;
  isLoading: boolean;
  error: unknown;
  set: (data: Project[]) => void;
  setError: (error: unknown) => void;
  setloading: (isLoading: boolean) => void;
};

export interface Store {
  filters: FiltersStore;
  categories: CategoriesStore;
  projects: ProjectsStore;
  news: NewsStore;
}
