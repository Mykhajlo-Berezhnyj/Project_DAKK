import { type AlpineComponent } from "alpinejs";

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

export const renderMenu = (): AlpineComponent<MenuData> => ({
  open: false,

  pages: [
    { link: "/about", name: "Про компанію" },
    { link: "/projects", name: "Проекти" },
    { link: "/news", name: "Новини" },
    { link: "https://drive.google.com/", name: "Вакансії" },
    { link: "/videos", name: "Відео" },
    { link: "#footer", name: "Контакти" },
  ] as MenuItem[],

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
  },
});
