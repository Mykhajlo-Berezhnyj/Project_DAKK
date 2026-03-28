import type { categorySlugs } from "../../data/category";
import type { statusLang } from "../../data/dictionary/statusLang";
import type { Categories } from "../service/filters";

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
}

export type Mode = "all" | "group";

export type CategoriesStore = {
  list: Categories[];
  isReady: boolean;
  init: () => Promise<void>;
};
