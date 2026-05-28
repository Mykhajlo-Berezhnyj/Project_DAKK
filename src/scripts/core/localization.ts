import Alpine from "alpinejs";
import {
  projectsData,
  type ProjectsData,
} from "../../data/dictionary/projects";
import type { Field, LocaleStore } from "../type/lang";
import { statusLang } from "../../data/dictionary/statusLang";
import { DEFAULT_LANG, SUPPORTED_LANG } from "../../data/lang";
import { SORT_OPTIONS, type SortOptions } from "../../data/sortOptions";
import { indexData, type IndexData } from "../../data/dictionary/indexData";
import { aboutData, type AboutData } from "../../data/dictionary/aboutData";
import { newsData, type NewsData } from "../../data/dictionary/newsData";
import { videosData, type VideosData } from "../../data/dictionary/videos";
import { menuData, type MenuData } from "../../data/dictionary/menu";
import type { StatusLang } from "../type/project";
import { footerData, type FooterData } from "../../data/dictionary/footer";
import { projectData, type ProjectData } from "../../data/dictionary/project";

export interface Localization {
  projectsData: ProjectsData;
  projectData: ProjectData;
  statusLang: StatusLang;
  SORT_OPTIONS: SortOptions;
  aboutData: AboutData;
  indexData: IndexData;
  newsData: NewsData;
  videosData: VideosData;
  menuData: MenuData;
  footerData: FooterData;
  t: (key: string) => string;
  l: (link: string) => string;
}

export function localization() {
  return {
    projectsData,
    projectData,
    statusLang,
    SORT_OPTIONS,
    aboutData,
    indexData,
    newsData,
    videosData,
    menuData,
    footerData,

    t(field: Field) {
      return (
        field[(Alpine.store("locale") as LocaleStore).current] ||
        field.uk ||
        field.en
      );
    },

    l(link: string) {
      const locale = (Alpine.store("locale") as LocaleStore).current;
      if (!SUPPORTED_LANG.includes(locale)) {
        return link;
      }
      if (locale === DEFAULT_LANG) {
        return link;
      }
      return `/${locale}${link}`;
    },
  };
}
