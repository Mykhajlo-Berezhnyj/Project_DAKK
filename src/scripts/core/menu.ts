import Alpine, { type AlpineComponent } from "alpinejs";
import { localization } from "./localization";
import type { LocaleStore } from "../type/lang";

interface MenuData {
  open: boolean;
  pages: MenuItem[];
  openMenu(): void;
  closeMenu(): void;
}

interface MenuItem {
  link: string;
  name: string;
}

function buildMenu() {
  return [
    {
      link: localization().l("/about"),
      name: localization().t(localization().menuData.about),
    },
    {
      link: localization().l("/projects"),
      name: localization().t(localization().menuData.projects),
    },
    {
      link: localization().l("/news"),
      name: localization().t(localization().menuData.news),
    },
    {
      link: "https://drive.google.com/",
      name: localization().t(localization().menuData.vacancies),
    },
    {
      link: localization().l("/videos"),
      name: localization().t(localization().menuData.videos),
    },
    {
      link: "#footer",
      name: localization().t(localization().menuData.contacts),
    },
  ] as MenuItem[];
}

export const renderMenu = (): AlpineComponent<MenuData> => ({
  open: false,
  pages: buildMenu(),

  openMenu() {
    this.open = true;
  },

  closeMenu() {
    this.open = false;
  },

  init() {
    this.$watch("open", (value: boolean) => {
      document.body.style.overflow = value ? "hidden" : "";
    });
    Alpine.effect(() => {
      const currentLocale = (Alpine.store("locale") as LocaleStore).current;
      currentLocale;
      this.pages = buildMenu();
    });
  },
});
